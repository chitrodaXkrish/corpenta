"use client";
import Image from "next/image";
import Link from "next/link";
import {usePathname,useRouter} from "next/navigation";
import {createBrowserClient} from "@supabase/ssr";
import {useState} from "react";
import {SiteHeader} from "@/components/site-header";
import {Footer} from "@/components/footer";

export function PortalChrome(){
  const pathname=usePathname(),router=useRouter(),[busy,setBusy]=useState(false);
  const portal=pathname.startsWith("/student/");
  async function logout(){setBusy(true);const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(url&&key)await createBrowserClient(url,key).auth.signOut();router.replace("/login");router.refresh()}
  return <>{portal?<header className="student-portal-bar"><Link href="/student/dashboard" aria-label="Corpenta Global dashboard"><Image src="/logo.png" alt="Corpenta Global" width={88} height={78} priority/></Link><button type="button" onClick={logout} disabled={busy}>{busy?"Signing out…":"Log out"}</button></header>:<SiteHeader/>}{!portal&&<Footer/>}</>;
}
