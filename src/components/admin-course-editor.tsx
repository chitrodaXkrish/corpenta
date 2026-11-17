"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Archive, ArrowUpRight, BookOpen, Plus, X} from "lucide-react";

type Course={id:string;title:string;short_description:string;full_description:string;price:number|null;currency:string;duration_label:string|null;is_published:boolean};
type CourseInput=Omit<Course,"id">;

const emptyCourse:CourseInput={title:"",short_description:"",full_description:"",price:null,currency:"INR",duration_label:null,is_published:false};

export function AdminCourseEditor({courses:initialCourses}:{courses:Course[]}){
  const router=useRouter();
  const [courses,setCourses]=useState(initialCourses);
  const [editing,setEditing]=useState<string|null>(null);
  const [creating,setCreating]=useState(false);
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState("");

  function formValue(form:HTMLFormElement):CourseInput{
    const f=new FormData(form),amount=String(f.get("price")??"").trim();
    return {title:String(f.get("title")??"").trim(),short_description:String(f.get("short_description")??"").trim(),full_description:String(f.get("full_description")??"").trim(),price:amount?Number(amount):null,currency:String(f.get("currency")??"INR").trim().toUpperCase(),duration_label:String(f.get("duration_label")??"").trim()||null,is_published:f.get("is_published")==="on"};
  }

  async function save(e:React.FormEvent<HTMLFormElement>,id?:string){
    e.preventDefault();setBusy(true);setStatus("");
    try{
      const body=formValue(e.currentTarget);
      const res=await fetch(id?`/api/admin/courses/${id}`:"/api/admin/courses",{method:id?"PATCH":"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
      const data=await res.json().catch(()=>({}));
      if(!res.ok){setStatus(data.error||"Could not save this course. Check the details and try again.");return;}
      if(id)setCourses(current=>current.map(course=>course.id===id?{...course,...body}:course));
      else if(data.course)setCourses(current=>[...current,data.course]);
      setEditing(null);setCreating(false);setStatus(id?"Course changes saved.":"Course created.");router.refresh();
    }catch{setStatus("Could not reach the server. Please try again.");}
    finally{setBusy(false);}
  }

  async function archive(course:Course){
    if(!window.confirm(`Remove “${course.title}” from the course catalogue? Existing enrollments and learning history will be preserved.`))return;
    setBusy(true);setStatus("");
    try{
      const res=await fetch(`/api/admin/courses/${course.id}`,{method:"DELETE"});
      const data=await res.json().catch(()=>({}));
      if(!res.ok){setStatus(data.error||"Could not remove this course.");return;}
      setCourses(current=>current.filter(item=>item.id!==course.id));setStatus("Course removed from the catalogue; student records were preserved.");router.refresh();
    }catch{setStatus("Could not reach the server. Please try again.");}
    finally{setBusy(false);}
  }

  return <section className="admin-course-manager" aria-label="Course management">
    <div className="admin-course-toolbar"><div><span className="eyebrow">COURSE CATALOGUE</span><p>{courses.length} {courses.length===1?"course":"courses"} · Select a course to edit its details.</p></div><button type="button" className="button button-dark" onClick={()=>{setCreating(true);setEditing(null);setStatus("");}} disabled={busy}><Plus size={16}/> Create course</button></div>
    {status&&<p className="form-status" role="status">{status}</p>}
    {creating&&<form className="form-card admin-course-form" onSubmit={e=>save(e)}><div className="admin-course-form-heading"><div><span className="eyebrow">NEW COURSE</span><h2>Course details</h2></div><button type="button" className="admin-course-close" aria-label="Close form" onClick={()=>setCreating(false)}><X size={18}/></button></div><CourseFields course={emptyCourse}/><div className="admin-course-actions"><button className="button button-dark" disabled={busy}>{busy?"Creating…":"Create course"}</button><button type="button" className="button button-quiet" onClick={()=>setCreating(false)}>Cancel</button></div></form>}
    {courses.length===0&&!creating?<div className="admin-course-empty"><BookOpen size={22}/><h2>No courses yet</h2><p>Create the first course to begin building your catalogue.</p></div>:<div className="admin-course-list">{courses.map((course,index)=><article className="admin-course-row" key={course.id}>
      <div className="admin-course-summary"><span className="admin-course-number">{String(index+1).padStart(2,"0")}</span><div className="admin-course-name"><h2>{course.title||"Untitled course"}</h2><p>{course.short_description||"No short description yet."}</p></div><span className={`admin-course-state ${course.is_published?"is-published":"is-draft"}`}>{course.is_published?"Published":"Draft"}</span><span className="admin-course-price">{course.price===null?"Price pending":`${course.currency} ${Number(course.price).toLocaleString()}`}</span><div className="admin-course-row-actions"><button type="button" className="button button-quiet" onClick={()=>{setEditing(editing===course.id?null:course.id);setCreating(false);setStatus("");}} disabled={busy}>{editing===course.id?"Close":"Edit course"}</button><button type="button" className="admin-course-icon-button" onClick={()=>archive(course)} aria-label={`Remove ${course.title}`} title="Remove from catalogue" disabled={busy}><Archive size={16}/></button></div>
      </div>
      {editing===course.id&&<form className="form-card admin-course-form" onSubmit={e=>save(e,course.id)}><div className="admin-course-form-heading"><div><span className="eyebrow">EDIT COURSE</span><h2>{course.title}</h2></div><button type="button" className="admin-course-close" aria-label="Close form" onClick={()=>setEditing(null)}><X size={18}/></button></div><CourseFields key={course.id} course={course}/><div className="admin-course-actions"><button className="button button-dark" disabled={busy}>{busy?"Saving…":"Save changes"}</button><button type="button" className="button button-quiet" onClick={()=>setEditing(null)}>Cancel</button></div></form>}
    </article>)}</div>}
    <p className="admin-course-footnote"><ArrowUpRight size={13}/> Removing a course archives it from the catalogue. Existing student enrollments and records remain intact.</p>
  </section>;
}

function CourseFields({course}:{course:CourseInput}){
  return <>
    <label>Course name</label><input name="title" defaultValue={course.title} required maxLength={140}/>
    <label>Short description</label><input name="short_description" defaultValue={course.short_description} maxLength={300}/>
    <label>Full description</label><textarea name="full_description" defaultValue={course.full_description} maxLength={8000}/>
    <div className="form-row"><div><label>Price (blank = pending)</label><input name="price" type="number" min="0" step="0.01" defaultValue={course.price??""}/></div><div><label>Currency</label><input name="currency" defaultValue={course.currency||"INR"} maxLength={3} required/></div></div>
    <label>Duration</label><input name="duration_label" defaultValue={course.duration_label??""} maxLength={100}/>
    <label className="admin-course-publish"><input type="checkbox" name="is_published" defaultChecked={course.is_published}/> Publish course</label>
  </>;
}
