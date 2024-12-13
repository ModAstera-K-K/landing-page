import About from "@/components/About";
import CallToAction from "@/components/CallToAction";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Team from "@/components/Team";
// import HomeBlogSection from "@/components/Blog/HomeBlogSection";
// import Clients from "@/components/Clients";
// import Faq from "@/components/Faq";
// import Pricing from "@/components/Pricing";
// import Testimonials from "@/components/Testimonials";
import { getAllPosts } from "@/utils/markdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ModAstera - Save 90% on Medical AI Development Costs",
  description:
    "Save 90% on Medical AI Development Costs: Integrated and AI-automated workflow. From data preprocessing and annotation to model building and deployment in days.",
};

export default async function Home({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

  return (
    <main>
      <ScrollUp />
      <Hero lang={lang} />
      <Features lang={lang} />
      <About />
      <CallToAction lang={lang} />
      {/*<Pricing />*/}
      {/*<Testimonials />*/}
      {/*<Faq />*/}
      <Team lang={lang} />
      {/*<HomeBlogSection posts={posts} />*/}
      <Contact lang={lang} />
      {/*<Clients />*/}
    </main>
  );
}
