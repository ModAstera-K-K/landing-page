import Breadcrumb from "@/components/Common/Breadcrumb";
import Faq from "@/components/Faq";
import Pricing from "@/components/Pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Page | ModAstera - Save 90% on Medical AI Development Costs",
  description:
    "Save 90% on Medical AI Development Costs: Integrated and AI-automated workflow. From data preprocessing and annotation to model building and deployment in days.",
};

const PricingPage = () => {
  return (
    <>
      <Breadcrumb pageName="Pricing Page" />
      <Pricing />
      <Faq />
    </>
  );
};

export default PricingPage;
