import About from "@/components/About";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "About Us | Play SaaS Starter Kit and Boilerplate for Next.js",
  description: "This is About page description",
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
