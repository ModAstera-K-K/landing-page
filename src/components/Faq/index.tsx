import SectionTitle from "../Common/SectionTitle";
import SingleFaq from "./SingleFaq";
import DotPatternLeft from "@/components/Common/Icons/FaqIcons/DotPatternLeft";
import DotPatternRight from "@/components/Common/Icons/FaqIcons/DotPatternRight";

const Faq = () => {
  return (
    <section className="relative z-20 overflow-hidden bg-white pb-8 pt-20 dark:bg-dark lg:pb-[50px] lg:pt-[120px]">
      <div className="container">
        <SectionTitle
          subtitle="FAQ"
          title="Any Questions? Answered"
          paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
          width="640px"
          center
        />

        <div className="-mx-4 mt-[60px] flex flex-wrap lg:mt-20">
          <div className="w-full px-4 lg:w-1/2">
            <SingleFaq
              question="How to use TailGrids?"
              answer="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
            <SingleFaq
              question="How to download icons from LineIcons?"
              answer="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
            <SingleFaq
              question="Is GrayGrids part of UIdeck?"
              answer="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
          </div>

          <div className="w-full px-4 lg:w-1/2">
            <SingleFaq
              question="Can I use this template for commercial project?"
              answer="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
            <SingleFaq
              question="Do you have plan to releasing Play Pro?"
              answer="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
            <SingleFaq
              question="Where and how to host this template?"
              answer="It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available ."
            />
          </div>
        </div>
      </div>

      <div>
        <span className="absolute left-4 top-4 -z-[1]">
          <DotPatternLeft />
        </span>
        <span className="absolute bottom-4 right-4 -z-[1]">
          <DotPatternRight />
        </span>
      </div>
    </section>
  );
};

export default Faq;
