"use client";

import { useEffect } from "react";

const REVEAL_TARGETS = [
  "main > section",
  "main > .page-heading",
  "main > .simple-grid > *",
  "main > .market-note-list > *",
  "main .founders-session-gallery",
  "main .founder-live-sessions",
  "main .founders-profile-about",
  "main .founders-profile-expertise",
  "main .founders-profile-milestones",
  "main .founders-profile-vision",
  "main .founders-profile-philosophy",
  "main .founders-profile-contact",
].join(",");

export function VisualReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pending = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
        pending.delete(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });

    const scan = () => {
      document.querySelectorAll(REVEAL_TARGETS).forEach((element) => {
        if (pending.has(element) || element.classList.contains("is-revealed")) return;
        element.classList.add("visual-reveal");
        pending.add(element);
        observer.observe(element);
      });
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { mutations.disconnect(); observer.disconnect(); pending.clear(); };
  }, []);

  return null;
}
