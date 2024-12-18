// import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/app/[lang]/(landing)/dictionaries";
import SupportLogos from "./SupportLogos";
import HeroDecorations from "./HeroDecorations";
const Hero = async ({ lang }: { lang: string }) => {
  const t = await getDictionary(lang);
  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden bg-primary pt-[120px] md:pt-[130px] lg:pt-[160px]"
      >
        <div className="container pb-10">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div
                className="hero-content wow fadeInUp mx-auto max-w-[780px] text-center"
                data-wow-delay=".2s"
              >
                <h1 className="mb-6 text-3xl font-bold leading-snug text-white sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]">
                  {t.mainPage.title}
                </h1>
                <p className="mx-auto mb-9 max-w-[600px] text-base text-white sm:text-lg sm:leading-[1.44]">
                  {t.mainPage.subTitle}
                </p>
              </div>
              <div>
                <p className="text-center text-sm text-white/80">
                  {t.mainPage.byTitle}
                </p>
                <SupportLogos />
              </div>
            </div>
          </div>

          <div className="w-full px-4">
            <div
              className="wow fadeInUp relative z-10 mx-auto max-w-[845px]"
              data-wow-delay=".25s"
            >
              <div className="mt-16">
                <video
                  src="/images/examples/modastera-demo-1.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="mx-auto max-w-full rounded-lg"
                  width={960}
                  height={540}
                />
              </div>
              <HeroDecorations />
            </div>
            <div className="mt-4 flex h-[55px] items-center justify-center">
              <Link
                href="https://docs.google.com/forms/d/1Ca9TLkSCnErycT54DUk2ZhzKlyOGakktV6S3m9gzSeg/viewform?edit_requested=true"
                className="mt-4 inline-block rounded-md border border-transparent bg-secondary px-7 py-3 text-center text-base font-medium text-white transition hover:bg-[#0BB489]"
              >
                {t?.header?.waitlistBtnTitle}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
