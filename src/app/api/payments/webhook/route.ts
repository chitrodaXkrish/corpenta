import {NextResponse} from "next/server";
import {createHmac,timingSafeEqual} from "node:crypto";
import {createAdminClient} from "@/lib/supabase/admin";
export async function POST(req:Request){
 const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
 if(!secret)return NextResponse.json({error:"Webhook is not configured."},{status:503});
 const raw=await req.text(),signature=req.headers.get("x-razorpay-signature")??"",eventId=req.headers.get("x-razorpay-event-id")??"";
 const expected=createHmac("sha256",secret).update(raw).digest("hex"),a=Buffer.from(signature),b=Buffer.from(expected);
 if(a.length!==b.length||!timingSafeEqual(a,b))return NextResponse.json({error:"Invalid signature."},{status:400});
 let event;try{event=JSON.parse(raw)}catch{return NextResponse.json({error:"Invalid payload."},{status:400})}
 if(event.event!=="payment.captured"&&event.event!=="order.paid")return NextResponse.json({ok:true,ignored:true});
 const entity=event.payload?.payment?.entity;
 if(!entity?.order_id||!entity?.id||!Number.isInteger(entity.amount)||!entity.currency)return NextResponse.json({error:"Missing payment reference."},{status:400});
 const admin=createAdminClient();if(!admin)return NextResponse.json({error:"Payment service is not configured."},{status:503});
 const {error}=await admin.rpc("confirm_razorpay_payment",{p_order_id:entity.order_id,p_payment_id:entity.id,p_event_id:eventId||expected,p_amount_minor:entity.amount,p_currency:entity.currency});
 if(error)return NextResponse.json({error:"Payment confirmation could not be processed."},{status:500});return NextResponse.json({ok:true});
}
