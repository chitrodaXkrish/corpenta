import {NextResponse} from "next/server";
import {z} from "zod";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";

const input=z.object({courseId:z.string().uuid()});

export async function POST(req:Request){
  if(!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET||!process.env.RAZORPAY_WEBHOOK_SECRET){
    return NextResponse.json({error:"Checkout is unavailable until secure payment confirmation is configured."},{status:503});
  }
  let parsed;
  try{parsed=input.parse(await req.json())}catch{return NextResponse.json({error:"Invalid course."},{status:400})}

  const session=await createClient();
  const {data:{user}}=await session?.auth.getUser()??{data:{user:null}};
  if(!user)return NextResponse.json({error:"Sign in to enroll."},{status:401});

  const admin=createAdminClient();
  if(!admin)return NextResponse.json({error:"Payment service is not configured."},{status:503});
  const {data:course}=await admin.from("courses").select("id,title,price,currency,is_published,archived_at").eq("id",parsed.courseId).eq("is_published",true).is("archived_at",null).maybeSingle();
  if(!course||course.price===null)return NextResponse.json({error:"This course is not open for enrollment."},{status:409});

  const {data:activeEnrollment}=await admin.from("enrollments").select("id").eq("student_id",user.id).eq("course_id",course.id).eq("status","active").maybeSingle();
  if(activeEnrollment)return NextResponse.json({error:"You are already enrolled in this course."},{status:409});

  const amount=Math.round(Number(course.price)*100);
  if(!Number.isSafeInteger(amount)||amount<100)return NextResponse.json({error:"Course pricing is invalid."},{status:409});
  const authorization=Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const orderResponse=await fetch("https://api.razorpay.com/v1/orders",{
    method:"POST",
    headers:{authorization:`Basic ${authorization}`,"content-type":"application/json"},
    body:JSON.stringify({amount,currency:course.currency,receipt:`${user.id.slice(0,8)}-${course.id.slice(0,8)}-${Date.now()}`,notes:{user_id:user.id,course_id:course.id}}),
    cache:"no-store",
  });
  if(!orderResponse.ok)return NextResponse.json({error:"Unable to start checkout."},{status:502});
  const order=await orderResponse.json();
  const {error}=await admin.from("payments").insert({student_id:user.id,course_id:course.id,provider:"razorpay",provider_order_id:order.id,amount:course.price,currency:course.currency,status:"pending"});
  if(error)return NextResponse.json({error:"Unable to record checkout."},{status:503});
  return NextResponse.json({orderId:order.id,amount:order.amount,currency:order.currency,keyId:process.env.RAZORPAY_KEY_ID,courseName:course.title});
}
