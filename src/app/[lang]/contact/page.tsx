import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact Page | Play SaaS Starter Kit and Boilerplate for Next.js",
  description: "This is contact page description",
};

const ContactPage  = async ({ params }: { params: { lang: string } }) => {
  return (
    <>
      <Breadcrumb pageName="Contact Page" />
      <Contact lang={params.lang} />
    </>
  );
};

export default ContactPage;
