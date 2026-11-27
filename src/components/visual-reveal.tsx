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

const TEXT_REVEAL_TARGETS = "h1,h2,h3,h4,.home-course-trigger strong";

export function VisualReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pending = new Set<Element>();
    const pendingHeadlines = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        if (entry.target.matches("[data-center-burst]")) entry.target.classList.add("is-center-bursting");
        observer.unobserve(entry.target);
        pending.delete(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });
    const headlineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-text-visible");
        headlineObserver.unobserve(entry.target);
        pendingHeadlines.delete(entry.target);
      });
    }, { threshold: 0.01, rootMargin: "0px" });

    const scan = () => {
      document.querySelectorAll(TEXT_REVEAL_TARGETS).forEach((element) => {
        if (pendingHeadlines.has(element) || element.classList.contains("is-text-visible")) return;
        element.classList.add("text-reveal-title");
        pendingHeadlines.add(element);
        headlineObserver.observe(element);
      });
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
    return () => { mutations.disconnect(); observer.disconnect(); headlineObserver.disconnect(); pending.clear(); pendingHeadlines.clear(); };
  }, []);

  return null;
}
