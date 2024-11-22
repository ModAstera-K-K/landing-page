import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact us | ModAstera - AI Solutions Tailored for HealthTech",
  description: "AI Solutions Tailored for HealthTech: From Idea to Deployment in Days | Cheaper than Hiring AI Specialists",
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
