import {NextResponse} from "next/server";
import {createHmac,timingSafeEqual} from "node:crypto";
import {z} from "zod";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";

const input=z.object({
  razorpay_order_id:z.string().min(1).max(100),
  razorpay_payment_id:z.string().min(1).max(100),
  razorpay_signature:z.string().regex(/^[a-f0-9]{64}$/i),
});

export async function POST(req:Request){
  const secret=process.env.RAZORPAY_KEY_SECRET;
  const keyId=process.env.RAZORPAY_KEY_ID;
  if(!secret||!keyId)return NextResponse.json({error:"Payment verification is not configured."},{status:503});

  let values;
  try{values=input.parse(await req.json())}catch{return NextResponse.json({error:"Invalid payment confirmation."},{status:400})}
  const session=await createClient();
  const {data:{user}}=await session?.auth.getUser()??{data:{user:null}};
  if(!user)return NextResponse.json({error:"Sign in to verify this payment."},{status:401});

  const admin=createAdminClient();
  if(!admin)return NextResponse.json({error:"Payment service is not configured."},{status:503});
  const {data:record}=await admin.from("payments").select("student_id,course_id,provider_order_id,amount,currency,status").eq("provider","razorpay").eq("provider_order_id",values.razorpay_order_id).maybeSingle();
  if(!record)return NextResponse.json({error:"Payment order was not found."},{status:404});
  if(record.student_id!==user.id)return NextResponse.json({error:"This payment belongs to another account."},{status:403});

  const expected=createHmac("sha256",secret).update(`${values.razorpay_order_id}|${values.razorpay_payment_id}`).digest();
  const supplied=Buffer.from(values.razorpay_signature,"hex");
  if(expected.length!==supplied.length||!timingSafeEqual(expected,supplied))return NextResponse.json({error:"Payment signature is invalid."},{status:400});
  if(record.status==="succeeded")return NextResponse.json({ok:true,enrolled:true});
  if(record.status!=="pending")return NextResponse.json({error:"This payment is no longer pending."},{status:409});

  const authorization=Buffer.from(`${keyId}:${secret}`).toString("base64");
  const response=await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(values.razorpay_payment_id)}`,{headers:{authorization:`Basic ${authorization}`},cache:"no-store"});
  if(!response.ok)return NextResponse.json({error:"Unable to confirm payment status with the payment provider."},{status:502});
  const payment=await response.json();
  if(payment.order_id!==record.provider_order_id||payment.amount!==Math.round(Number(record.amount)*100)||String(payment.currency).toUpperCase()!==String(record.currency).toUpperCase())return NextResponse.json({error:"Payment details do not match this course order."},{status:409});
  if(payment.status!=="captured")return NextResponse.json({ok:true,enrolled:false,pendingCapture:true},{status:202});

  const {error}=await admin.rpc("confirm_razorpay_payment",{
    p_order_id:record.provider_order_id,
    p_payment_id:values.razorpay_payment_id,
    p_event_id:`checkout-${values.razorpay_payment_id}`,
    p_amount_minor:payment.amount,
    p_currency:payment.currency,
  });
  if(error)return NextResponse.json({error:"Payment was received, but enrollment confirmation is pending."},{status:503});
  return NextResponse.json({ok:true,enrolled:true});
}
