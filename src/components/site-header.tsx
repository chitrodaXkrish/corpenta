"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { courses } from "@/lib/content";

type MenuName = "programs" | "specialization" | "mode";
const specializations: string[] = [];
const learningModes = ["Online Learning"];

export function SiteHeader() {
  const [active, setActive] = useState<MenuName | null>(null);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setActive(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function toggle(menu: MenuName) { setActive(current => current === menu ? null : menu); }

  return <header className="site-header" ref={root}>
    <svg className="nav-swoop" viewBox="0 0 1000 112" preserveAspectRatio="none" aria-hidden="true"><path d="M310 0H690C723 0 721 29 746 67C770 100 790 112 824 112H176C210 112 230 100 254 67C279 29 277 0 310 0Z"/></svg>
    <Link className="nav-pill nav-academy" href="/courses" onClick={() => setActive(null)}>
      <span>Academy</span><ArrowUpRight size={15} aria-hidden="true"/>
    </Link>

    <div className="nav-selectors">
      <div className="nav-selector-wrap">
        <button className={`nav-selector${active === "programs" ? " is-open" : ""}`} type="button" aria-expanded={active === "programs"} onClick={() => toggle("programs")}>
          <span className="nav-selector-copy"><span className="nav-label">Programs</span><span className="nav-value">6 Courses</span></span><ChevronDown size={16}/>
        </button>
        {active === "programs"&&<div className="nav-dropdown programs-dropdown"><span className="dropdown-heading">THE ACADEMY <span>06</span></span>{courses.map((course,index)=><Link href={`/courses/${course.id}`} key={course.id} onClick={() => setActive(null)}><span className="dropdown-index">0{index+1}</span><span>{course.title}</span><ArrowUpRight size={13}/></Link>)}</div>}
      </div>

      <div className="nav-selector-wrap">
        <button className={`nav-selector${active === "specialization" ? " is-open" : ""}`} type="button" aria-expanded={active === "specialization"} onClick={() => toggle("specialization")}>
          <span className="nav-selector-copy"><span className="nav-label">Specialization</span><span className="nav-value">Forex Markets</span></span><ChevronDown size={16}/>
        </button>
        {active === "specialization"&&<div className="nav-dropdown"><span className="dropdown-heading">LEARNING FOCUS</span>{specializations.length?specializations.map(item=><Link key={item} href={`/courses?focus=${encodeURIComponent(item)}`} onClick={() => setActive(null)}>{item}<ArrowUpRight size={13}/></Link>):<div className="dropdown-empty">Specializations will appear here when configured by the academy.</div>}</div>}
      </div>

      <div className="nav-selector-wrap">
        <button className={`nav-selector${active === "mode" ? " is-open" : ""}`} type="button" aria-expanded={active === "mode"} onClick={() => toggle("mode")}>
          <span className="nav-selector-copy"><span className="nav-label">Learning Mode</span><span className="nav-value">Online Learning</span></span><ChevronDown size={16}/>
        </button>
        {active === "mode"&&<div className="nav-dropdown"><span className="dropdown-heading">AVAILABLE FORMATS</span>{learningModes.map(mode=><div className="dropdown-option" key={mode}><span className="option-dot"/>{mode}<span className="option-current">CURRENT</span></div>)}</div>}
      </div>
    </div>

    <Link className="nav-pill nav-enroll" href="/register" onClick={() => setActive(null)}>
      <span>Enroll Now</span><ArrowUpRight size={15} aria-hidden="true"/>
    </Link>
  </header>;
}
