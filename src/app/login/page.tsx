"use client";
import Link from "next/link";
import {useState} from "react";
import {createBrowserClient} from "@supabase/ssr";

function supabase(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;return url&&key?createBrowserClient(url,key):null}

export default function Login(){
  const[status,setStatus]=useState("");const[showPassword,setShowPassword]=useState(false);
  async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);const client=supabase();if(!client){setStatus("Student sign-in will be available once authentication is configured.");return}const {error}=await client.auth.signInWithPassword({email:String(f.get("email")),password:String(f.get("password"))});if(error){setStatus(error.message);return}const next=new URLSearchParams(location.search).get("next");location.assign(next?.startsWith("/courses/")?next:"/student/dashboard")}
  return <main className="page-main wrap auth-flow-page"><div className="auth-flow-layout">
    <div className="page-heading auth-flow-heading"><span className="eyebrow">STUDENT PORTAL</span><h1>Welcome<br/><em>back.</em></h1><p>Sign in to continue your learning journey.</p></div>
    <div className="auth-flow-card"><span className="eyebrow">WELCOME BACK</span><h2>Student sign in</h2><p>Access is available to verified students with an active enrollment.</p>
      <form className="form-card auth-flow-form" onSubmit={submit}><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required/><label htmlFor="password">Password</label><div className="password-field"><input id="password" name="password" type={showPassword?"text":"password"} autoComplete="current-password" required/><button type="button" className="password-toggle" onClick={()=>setShowPassword(value=>!value)} aria-label={showPassword?"Hide password":"Show password"}>{showPassword?"Hide":"Show"}</button></div><button className="button button-dark form-submit">Sign in</button>{status&&<p className="form-status" role="status">{status}</p>}</form>
      <div className="auth-flow-links"><Link href="/register">Create an account</Link><Link href="/forgot-password">Forgot password?</Link></div>
    </div>
  </div></main>
}
