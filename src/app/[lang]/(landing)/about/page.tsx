import About from "@/components/About";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About us | ModAstera - AI Solutions Tailored for HealthTech",
  description: "AI Solutions Tailored for HealthTech: From Idea to Deployment in Days | Cheaper than Hiring AI Specialists",
};

const AboutPage = async ({ params }: { params: { lang: string } }) => {
  return (
    <main>
      <Breadcrumb pageName="About Us Page" />
      <About />
      <Team lang={params.lang}/>
    </main>
  );
};

export default AboutPage;
