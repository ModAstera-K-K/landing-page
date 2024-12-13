import About from "@/components/About";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About us | ModAstera - Save 90% on Medical AI Development Costs",
  description:
    "Integrated and AI-automated workflow. From data preprocessing and annotation to model building and deployment in days.",
};

const AboutPage = async ({ params }: { params: { lang: string } }) => {
  return (
    <main>
      <Breadcrumb pageName="About Us" />
      <About />
      <Team lang={params.lang} />
    </main>
  );
};

export default AboutPage;
