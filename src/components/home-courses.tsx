"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { courseCatalog } from "@/lib/course-catalog";

export function HomeCourses() {
  const [openCourse, setOpenCourse] = useState<string | null>(null);

  return <ol className="home-course-list">
    {courseCatalog.map((course, index) => {
      const isOpen = openCourse === course.id;
      return <li className={`home-course-item${isOpen ? " is-open" : ""}`} key={course.id}>
        <button className="home-course-trigger" type="button" aria-expanded={isOpen} aria-controls={`course-detail-${course.id}`} onClick={() => setOpenCourse(isOpen ? null : course.id)}>
          <span className="home-course-number">{String(index + 1).padStart(2, "0")}</span>
          <strong>{course.title}</strong>
          <span className="home-course-meta">{index < 2 ? "Foundations" : index < 4 ? "Markets & risk" : "Specialist"}<i>·</i>{course.duration}</span>
          <Plus className="home-course-plus" size={25} aria-hidden="true" />
        </button>
        <div className={`home-course-detail-shell${isOpen ? " is-open" : ""}`} id={`course-detail-${course.id}`} aria-hidden={!isOpen}>
          <div className="home-course-detail">
            <div className="home-course-summary"><p className="home-course-tagline">{course.tagline}</p><span>{course.duration} · Self-paced learning</span></div>
            <div className="home-course-outcomes"><h3>What you’ll learn</h3><ul>{course.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div>
            <div className="home-course-enrollment"><span>Programme fee</span><strong>₹{new Intl.NumberFormat("en-IN").format(course.price)}</strong><Link href={`/courses/${course.id}`} className="home-course-detail-link" tabIndex={isOpen ? 0 : -1}>Course details <ArrowRight size={16}/></Link></div>
          </div>
        </div>
      </li>;
    })}
  </ol>;
}
