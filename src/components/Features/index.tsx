import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresIconsData from "./featuresIconsData";
import { getDictionary } from "@/app/[lang]/(landing)/dictionaries";

const Features = async ({ lang }: { lang: string }) => {
  const t = await getDictionary(lang);

  // Combine icons with translations
  const features = featuresIconsData.map((feature, index) => ({
    ...feature,
    title: t.features.items[`feature${index + 1}`].title,
    paragraph: t.features.items[`feature${index + 1}`].paragraph,
    btn: t.features.items[`feature${index + 1}`].btn,
    btnLink: t.features.items[`feature${index + 1}`].btnLink,
    image: t.features.items[`feature${index + 1}`].image,
  }));
  return (
    <section className="pb-8 pt-20 dark:bg-dark lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        <SectionTitle
          subtitle={t.features.subtitle}
          title={t.features.title}
          paragraph={t.features.paragraph}
        />
        <div className="-mx-4 mt-12 flex flex-wrap lg:mt-20">
          {features.map((feature, i) => (
            <SingleFeature key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
