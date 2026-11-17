import {NextResponse} from "next/server";
import {randomUUID} from "node:crypto";
import {z} from "zod";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";

const schema=z.object({title:z.string().trim().min(1).max(140),short_description:z.string().trim().max(300),full_description:z.string().trim().max(8000),price:z.number().nonnegative().nullable(),currency:z.string().length(3),duration_label:z.string().max(100).nullable(),is_published:z.boolean()});

export async function POST(req:Request){
  const db=await createClient();
  if(!db)return NextResponse.json({error:"Database unavailable."},{status:503});
  const {data:{user}}=await db.auth.getUser();
  if(!user)return NextResponse.json({error:"Sign in required."},{status:401});
  const {data:role}=await db.from("user_roles").select("user_id").eq("user_id",user.id).eq("role","admin").maybeSingle();
  if(!role)return NextResponse.json({error:"Admin access required."},{status:403});
  let body;
  try{body=schema.parse(await req.json());}catch{return NextResponse.json({error:"Check the course details."},{status:400});}
  const base=body.title.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,90)||"course";
  const {data:last}=await db.from("courses").select("sort_order").is("archived_at",null).order("sort_order",{ascending:false}).limit(1).maybeSingle();
  const {data:course,error}=await db.from("courses").insert({...body,slug:`${base}-${randomUUID().slice(0,8)}`,sort_order:(last?.sort_order??0)+1}).select("id,title,short_description,full_description,price,currency,duration_label,is_published").single();
  if(error||!course)return NextResponse.json({error:"Unable to create this course."},{status:500});
  revalidatePath("/courses");
  revalidatePath(`/courses/${course.id}`);
  return NextResponse.json({course},{status:201});
}
