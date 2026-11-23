import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {createPageMetadata} from "@/lib/seo";

type LegalDocument={title:string;intro:string;sections:[string,string[]][]};
const docs:Record<string,LegalDocument>={
  terms:{
    title:"Terms & Conditions",
    intro:"Draft terms governing use of the Corpenta Global website, courses and student account.",
    sections:[
      ["Who provides the services",["Corpenta Global is operated by [FULL LEGAL ENTITY NAME], registered at [REGISTERED ADDRESS] (the “Academy”). Confirm the contracting entity and contact details before publication."]],
      ["Website and account use",["You must provide accurate account information, keep your login credentials secure and use the site lawfully. The Academy may suspend access for suspected misuse, subject to the final approved terms.","Eligibility, age requirements, account closure and complaint handling must be confirmed by the Academy and legal counsel before these terms take effect."]],
      ["Courses, fees and enrollment",["Course names, duration, fee, curriculum, delivery format, start dates, taxes, access period and any prerequisites must be shown accurately on the relevant course page before purchase.","Enrollment is subject to payment confirmation and the stated course terms. Payment processing is handled by the payment provider; the Academy records order and enrollment status.","For NISM Certify, course completion does not itself constitute NISM certification. The exact examination module and certification requirements must be confirmed. For Corpenta Funded, eligibility, evaluation and provider terms must be published before enrollment."]],
      ["Educational content and risk",["Courses and market information are for general educational purposes. They are not individualized investment, financial, legal or tax advice, and are not a recommendation to buy or sell an instrument.","Markets involve risk and financial outcomes are not guaranteed. Read the separate Risk Disclosure before participating."]],
      ["Content and acceptable use",["Course materials, recordings, branding and other Academy content may not be copied, redistributed or used commercially without written permission, except as permitted by applicable law. Confirm the final license and acceptable-use terms with counsel."]],
      ["Cancellations, liability and governing law",["See the Refund Policy for cancellation and refund terms. Liability limits, dispute resolution and governing law remain [TO BE COMPLETED BY THE ACADEMY AND LEGAL COUNSEL]."]],
      ["Contact and grievances",["Contracting entity: [FULL LEGAL ENTITY NAME]. Address: [REGISTERED ADDRESS]. Support email: [OFFICIAL SUPPORT EMAIL]. Grievance contact and response process: [CONFIRM AND COMPLETE]."]],
    ],
  },
  refunds:{
    title:"Refund Policy",
    intro:"Draft policy. The Academy must approve the specific cancellation and refund rules before enrollment opens.",
    sections:[
      ["Policy owner and contact",["Seller: [FULL LEGAL ENTITY NAME]. Support email: [OFFICIAL SUPPORT EMAIL]. Registered address: [REGISTERED ADDRESS]."]],
      ["Cancellation before course access",["Approved cancellation window and refund amount: [CONFIRM]. Define how a student requests cancellation and when the request is considered received: [CONFIRM]."]],
      ["Cancellation after course access begins",["State whether a refund is available after digital materials, lessons, recordings or live sessions have been accessed: [CONFIRM]. Define any prorating or exclusions: [CONFIRM]."]],
      ["Course changes or cancellation by the Academy",["State the remedy if the Academy changes dates, format, instructor or curriculum, or cancels a course: [CONFIRM]."]],
      ["Processing and payment fees",["Refund processing timeline, original payment method, treatment of transaction fees and applicable taxes: [CONFIRM]. Do not promise a processing period until approved and operationally verified."]],
      ["How to request help",["Contact [OFFICIAL SUPPORT EMAIL] with the registered email, course, order reference and reason for the request. Add the approved escalation and grievance process: [CONFIRM]."]],
    ],
  },
  privacy:{
    title:"Privacy Policy",
    intro:"Draft description of the personal information used by the website. The legal entity, retention periods and rights process require confirmation.",
    sections:[
      ["Who is responsible",["Data controller / fiduciary: [FULL LEGAL ENTITY NAME], [REGISTERED ADDRESS]. Privacy contact: [PRIVACY CONTACT EMAIL]. Confirm the applicable jurisdictions and legal roles before publication."]],
      ["Information the site handles",["Registration collects name, email address, password credentials through the authentication provider, and an optional phone number. Contact enquiries collect name, email address, subject and message.","When a student enrolls, the site stores course, order, payment provider reference, amount, currency and payment status. Payment card and bank credentials are handled by the payment provider and are not stored in the course catalog database.","The site uses authentication/session cookies. The homepage also loads a third-party market-data widget; that provider may process browser and device information under its own privacy terms."]],
      ["Why information is used",["Information is used to create and secure accounts, respond to enquiries, manage course access, process and reconcile payments, provide course services, prevent abuse and meet applicable legal obligations. Confirm whether any additional analytics, marketing or support tools are used."]],
      ["Service providers and sharing",["The site uses Supabase for authentication and database services, Razorpay for payment processing, and may use Bunny Stream for protected course video and TradingView for the public market ticker. Confirm current deployment, data locations, contracts and any other processors before publication.","The Academy does not sell personal information according to the current implementation. This statement must be re-confirmed against all operational systems and applicable law."]],
      ["Retention and security",["Retention periods for account, enquiry, payment and learning records: [CONFIRM]. Describe the actual deletion, backup and security practices: [CONFIRM WITH THE OPERATORS]."]],
      ["Your choices and requests",["Explain how people may access, correct, erase, withdraw consent where applicable, or raise a grievance: [CONFIRM THE PROCESS, CONTACT AND RESPONSE TIMELINES]."]],
      ["Children and international processing",["Minimum learner age, parental/guardian consent requirements and safeguards: [CONFIRM]. Identify any international transfers and safeguards after confirming provider regions: [CONFIRM]."]],
      ["Effective date and changes",["Effective date: [DATE AFTER APPROVAL]. Material changes and the method of notifying users: [CONFIRM]."]],
    ],
  },
  risk:{
    title:"Risk Disclosure",
    intro:"Financial markets involve risk. This draft is general information and must be reviewed against Corpenta Global’s exact programs and regulatory position.",
    sections:[
      ["No personalized advice",["Website material and courses are for general educational purposes only. They are not individualized investment, financial, tax or legal advice, nor a recommendation to trade or invest in any product."]],
      ["Market and leverage risk",["Currency, derivatives, leveraged trading, securities and digital assets can be volatile and may result in substantial losses, including loss of all capital committed. Leverage magnifies losses as well as gains. Only participate after understanding the product and risks."]],
      ["No promised outcomes",["Examples, simulations, course completion or past performance do not predict future results. The Academy does not guarantee profits, financial independence, certification, funded access or any particular outcome."]],
      ["Course-specific notices",["NISM Certify is an educational course; completion is not itself an NISM certificate. Name the exact NISM module and explain official eligibility and exam requirements before enrollment.","Corpenta Funded does not guarantee funding. Identify the provider, evaluation criteria, fees, eligibility, restrictions and payout rules before enrollment. These details are currently [PENDING CONFIRMATION]."]],
      ["Third-party data and services",["Market data, third-party platforms and course tools may be delayed, unavailable or governed by separate terms. Verify any time-sensitive information independently."]],
      ["Regulatory status and review",["Corpenta Global’s legal entity, registrations, authorizations and any affiliations: [CONFIRM AND DESCRIBE ACCURATELY]. Do not imply regulatory approval, endorsement or certification unless verified. This disclosure requires review by qualified counsel before publication."]],
    ],
  },
};

export function generateStaticParams(){return Object.keys(docs).map(slug=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const doc=docs[slug];return createPageMetadata({title:doc?.title||"Legal information",description:doc?.intro||"Legal information for Corpenta Global.",path:`/legal/${slug}`,index:false})}
export default async function Legal({params}:{params:Promise<{slug:string}>}){const {slug}=await params,doc=docs[slug];if(!doc)notFound();return <main className="page-main wrap"><div className="page-heading"><span className="eyebrow">CORPENTA GLOBAL · LEGAL</span><h1>{doc.title}</h1><p>{doc.intro}</p></div><div className="notice-box"><strong>Draft for review</strong><p>This document is not final or legal advice. Bracketed items require confirmation. Obtain company approval and qualified legal review before relying on or publishing as final policy.</p></div><article className="legal-copy">{doc.sections.map(([heading,paragraphs])=><section key={heading}><h2>{heading}</h2>{paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</section>)}</article></main>}
