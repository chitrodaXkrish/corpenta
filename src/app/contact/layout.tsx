import {createPageMetadata} from "@/lib/seo";

export const metadata=createPageMetadata({
  title:"Contact and Enquiries",
  description:"Send an enquiry to Corpenta Global about its currency and financial market education programs. Official phone, email and address details will be added when confirmed.",
  path:"/contact",
});

export default function ContactLayout({children}:{children:React.ReactNode}){return children;}
