"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type CheckoutOrder = { orderId: string; amount: number; currency: string; keyId: string; courseName: string };
type CheckoutResult = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (result: CheckoutResult) => void;
  modal: { ondismiss: () => void };
  theme: { color: string };
};
type RazorpayInstance = { open: () => void };

declare global {
  interface Window { Razorpay?: new (options: RazorpayOptions) => RazorpayInstance }
}

async function loadCheckout() {
  if (window.Razorpay) return;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Secure checkout could not be loaded."));
    document.head.appendChild(script);
  });
  if (!window.Razorpay) throw new Error("Secure checkout is unavailable.");
}

export function CourseEnrollButton({ courseId }: { courseId: string }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  async function verifyPayment(result:CheckoutResult) {
    setStatus("Verifying payment and enrollment…");
    try {
      const response=await fetch("/api/payments/verify",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(result),
      });
      const data=await response.json() as {error?:string;enrolled?:boolean;pendingCapture?:boolean};
      if(!response.ok&&response.status!==202)throw new Error(data.error||"Payment verification is pending.");
      if(data.enrolled){
        setEnrolled(true);
        setStatus("Payment verified. Your course enrollment is active.");
      }else{
        setStatus("Payment is awaiting capture. Enrollment will activate once the payment provider confirms it.");
      }
    }catch(error){
      setStatus(error instanceof Error?error.message:"Payment verification is pending. Contact support if enrollment does not appear.");
    }finally{
      setBusy(false);
    }
  }

  async function startCheckout() {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json() as CheckoutOrder & { error?: string };
      if (response.status === 401) {
        window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!response.ok) throw new Error(data.error || "Checkout is unavailable right now.");
      await loadCheckout();
      if (!window.Razorpay) throw new Error("Secure checkout is unavailable.");
      new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Corpenta Global",
        description: data.courseName,
        order_id: data.orderId,
        handler: (result) => { void verifyPayment(result); },
        modal: { ondismiss: () => setBusy(false) },
        theme: { color: "#c9681e" },
      }).open();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to start checkout.");
      setBusy(false);
    }
  }

  return <div className="course-enroll-control">
    <button className="button button-orange" type="button" onClick={startCheckout} disabled={busy}>
      {busy ? "Opening secure checkout…" : "Enrol now"} <ArrowUpRight size={16}/>
    </button>
    {status && <p className="form-status" role="status">{status}</p>}
    {enrolled&&<Link className="underlined-link" href="/student/my-courses">Go to my courses <ArrowUpRight size={15}/></Link>}
  </div>;
}
