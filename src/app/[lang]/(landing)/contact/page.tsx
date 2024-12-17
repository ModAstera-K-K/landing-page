import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact us | ModAstera - Save 90% on Medical AI Development Costs",
  description:
    "Save 90% on Medical AI Development Costs: Integrated and AI-automated workflow. From data preprocessing and annotation to model building and deployment in days.",
};

const ContactPage = async ({ params }: { params: { lang: string } }) => {
  return (
    <>
      <Breadcrumb pageName="Contact Page" />
      <Contact lang={params.lang} />
    </>
  );
};

export default ContactPage;
