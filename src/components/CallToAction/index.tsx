import Link from "next/link";
import { getDictionary } from "@/app/[lang]/(landing)/dictionaries";
import LeftDecoration from "@/components/Common/Icons/CallToActionIcons/LeftDecoration";
import RightDecoration from "@/components/Common/Icons/CallToActionIcons/RightDecoration";

const CallToAction = async ({ lang }: { lang: string }) => {
  const t =  await getDictionary(lang);
  return (
    <section className="relative z-10 overflow-hidden bg-primary py-20 lg:py-[115px]">
      <div className="container mx-auto">
        <div className="relative overflow-hidden">
          <div className="-mx-4 flex flex-wrap items-stretch">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[570px] text-center">
                <h2 className="mb-2.5 text-3xl font-bold text-white md:text-[38px] md:leading-[1.44]">
                  <span>{t.callToAction.title}</span>
                  <span className="text-3xl font-normal md:text-[40px]">
                    {" "}
                    {t.callToAction.subTitle}
                  </span>
                </h2>
                <p className="mx-auto mb-6 max-w-[515px] text-base leading-[1.5] text-white">
                  {t.callToAction.desc}
                </p>
                <Link
                  href={t.callToAction.scheduleLink}
                  className="inline-block rounded-md border border-transparent bg-secondary px-7 py-3 text-base font-medium text-white transition hover:bg-[#0BB489]"
                >
                  {t.callToAction.scheduleBtnText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span className="absolute left-0 top-0">
          <LeftDecoration />
        </span>
        <span className="absolute bottom-0 right-0">
          <RightDecoration />
        </span>
      </div>
    </section>
  );
};

export default CallToAction;
