"use client";

import Link from "next/link";
import {createPortal} from "react-dom";
import {useEffect, useRef, useState} from "react";
import {ArrowUpRight, Menu, X} from "lucide-react";

const primaryLinks=[
  {label:"Home",href:"/"},
  {label:"Our approach",href:"/about"},
  {label:"Founder’s Desk",href:"/founders-desk"},
  {label:"Academy",href:"/courses"},
  {label:"Market notes",href:"/scenarios"},
  {label:"Contact",href:"/contact"},
];
const studentLinks=[
  {label:"Student login",href:"/login"},
  {label:"Create account",href:"/register"},
  {label:"Dashboard",href:"/student/dashboard"},
  {label:"My courses",href:"/student/my-courses"},
  {label:"Student market notes",href:"/student/market-scenarios"},
  {label:"Live classes",href:"/student/live-classes"},
  {label:"Profile",href:"/student/profile"},
];
const legalLinks=[
  {label:"Terms & Conditions",href:"/legal/terms"},
  {label:"Refund policy",href:"/legal/refunds"},
  {label:"Trading risk",href:"/legal/risk"},
];

export function HeroMenu(){
  const [open,setOpen]=useState(false);
  const [mounted,setMounted]=useState(false);
  const toggleRef=useRef<HTMLButtonElement>(null);
  const closeRef=useRef<HTMLButtonElement>(null);

  useEffect(()=>setMounted(true),[]);
  useEffect(()=>{
    if(!open)return;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    closeRef.current?.focus();
    function onKeyDown(event:KeyboardEvent){if(event.key==="Escape")setOpen(false)}
    document.addEventListener("keydown",onKeyDown);
    return()=>{document.body.style.overflow=previousOverflow;document.removeEventListener("keydown",onKeyDown);toggleRef.current?.focus()};
  },[open]);

  const menu=mounted?createPortal(
    <div id="site-navigation-overlay" className={`site-menu-overlay${open?" is-open":""}`} aria-hidden={!open}>
      <div className="site-menu-panel" role="dialog" aria-modal="true" aria-label="Site navigation" aria-hidden={!open}>
        <div className="site-menu-top"><Link className="site-menu-wordmark" href="/" onClick={()=>setOpen(false)}>CORPENTA <span>GLOBAL</span></Link><button ref={closeRef} className="site-menu-close" type="button" aria-label="Close navigation menu" onClick={()=>setOpen(false)}><X size={21}/></button></div>
        <nav className="site-menu-primary" aria-label="Main pages">{primaryLinks.map((item,index)=><Link href={item.href} key={item.href} onClick={()=>setOpen(false)}><span className="site-menu-number">0{index+1}</span><span>{item.label}</span><ArrowUpRight className="site-menu-arrow" size={20}/></Link>)}</nav>
        <div className="site-menu-secondary">
          <section><h2>STUDENT SPACE</h2><div className="site-menu-small-links">{studentLinks.map(item=><Link href={item.href} key={item.href} onClick={()=>setOpen(false)}>{item.label}</Link>)}</div></section>
          <section><h2>INFORMATION</h2><div className="site-menu-small-links">{legalLinks.map(item=><Link href={item.href} key={item.href} onClick={()=>setOpen(false)}>{item.label}</Link>)}</div></section>
        </div>
      </div>
    </div>,document.body):null;

  return <>
    <button ref={toggleRef} className="hero-menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded={open} aria-controls="site-navigation-overlay" onClick={()=>setOpen(true)}><Menu size={21}/></button>
    {menu}
  </>;
}
