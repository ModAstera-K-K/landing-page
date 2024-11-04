// import About from "@/components/About";
// import HomeBlogSection from "@/components/Blog/HomeBlogSection";
import CallToAction from "@/components/CallToAction";
// import Clients from "@/components/Clients";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
// import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
// import Pricing from "@/components/Pricing";
import Team from "@/components/Team";
// import Testimonials from "@/components/Testimonials";
import { getAllPosts } from "@/utils/markdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ModAstera - AI Solutions Tailored for HealthTech",
  description:
    "AI Solutions Tailored for HealthTech: From Idea to Deployment in Days | Cheaper than Hiring AI Specialists.",
};

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

  return (
    <main>
      <ScrollUp />
      <Hero  lang={lang}/>
      <Features lang={lang}/>
      {/*<About />*/}
      <CallToAction lang={lang}/>
      {/*<Pricing />*/}
      {/*<Testimonials />*/}
      {/*<Faq />*/}
      <Team />
      {/*<HomeBlogSection posts={posts} />*/}
      <Contact lang={lang}/>
      {/*<Clients />*/}
    </main>
  );
}
