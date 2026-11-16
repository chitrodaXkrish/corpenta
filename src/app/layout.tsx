import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Corpenta Global — Market education, thoughtfully delivered", description: "A premium academy for considered forex and financial market education." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><SiteHeader/>{children}<Footer/></body></html>; }
