import Link from "next/link";
import { getDictionary } from "@/app/[lang]/(landing)/dictionaries";
import LocationIcon from "@/components/Common/Icons/ContactIcons/LocationIcon";
import EmailIcon from "@/components/Common/Icons/ContactIcons/EmailIcon";

const Contact = async ({ lang }: { lang: string }) => {
  const t = await getDictionary(lang);
  return (
    <section id="contact" className="relative py-20 md:py-[120px]">
      <div className="absolute left-0 top-0 -z-[1] h-full w-full dark:bg-dark"></div>
      <div className="absolute left-0 top-0 -z-[1] h-1/2 w-full bg-[#E9F9FF] dark:bg-dark-700 lg:h-[45%] xl:h-1/2"></div>
      <div className="container px-4">
        {/*<div className="-mx-4 flex flex-wrap items-center">*/}
        {/*  <div className="w-full px-4 lg:w-7/12 xl:w-8/12">*/}
        <div className="ud-contact-content-wrapper">
          <div className="ud-contact-title mb-12 lg:mb-[150px]">
            <span className="mb-6 block text-center text-base font-medium text-dark dark:text-white md:text-left">
              {t.contact.title}
            </span>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <h2 className="mx-auto max-w-[260px] text-center text-[35px] font-semibold leading-[1.14] text-dark dark:text-white md:ml-0 md:text-left">
                {t.contact.subTitle}
              </h2>
              <div className="m-auto"></div>
            </div>
          </div>
          <div className="mb-12 flex flex-wrap justify-between lg:mb-0">
            <div className="mb-8 flex w-[330px] max-w-full">
              <div className="mr-6 text-[32px] text-primary">
                <LocationIcon />
              </div>
              <div>
                <h3 className="mb-[18px] text-lg font-semibold text-dark dark:text-white">
                  {t.contact.locationTitle}
                </h3>
                <p className="text-base text-body-color dark:text-dark-6">
                  {t.contact.address.map((line: string, index: number) => (
                    <span key={index}>
                      {line}
                      {index < t.contact.address.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <div className="mb-8 flex w-[330px] max-w-full">
              <div className="mr-6 text-[32px] text-primary">
                <EmailIcon />
              </div>
              <div className="flex flex-col">
                <h3 className="mb-[18px] text-lg font-semibold text-dark dark:text-white">
                  {t.contact.emailTitle}
                </h3>
                <p className="text-base text-body-color dark:text-dark-6">
                  {t.contact.emailAddr}
                </p>
                <Link
                  href={t.contact.scheduleLink}
                  className="mt-4 inline-block rounded-md border border-transparent bg-secondary px-7 py-3 text-center text-base font-medium text-white transition hover:bg-[#0BB489]"
                >
                  {t.contact.scheduleBtnText}
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/*</div>*/}
        {/*<div className="w-full px-4 lg:w-5/12 xl:w-4/12">*/}
        {/*  <div*/}
        {/*    className="wow fadeInUp rounded-lg bg-white px-8 py-10 shadow-testimonial dark:bg-dark-2 dark:shadow-none sm:px-10 sm:py-12 md:p-[60px] lg:p-10 lg:px-10 lg:py-12 2xl:p-[60px]"*/}
        {/*    data-wow-delay=".2s*/}
        {/*    "*/}
        {/*  >*/}
        {/*    <h3 className="mb-8 text-2xl font-semibold text-dark dark:text-white md:text-[28px] md:leading-[1.42]">*/}
        {/*      Send us a Message*/}
        {/*    </h3>*/}
        {/*    <form>*/}
        {/*      <div className="mb-[22px]">*/}
        {/*        <label*/}
        {/*          htmlFor="fullName"*/}
        {/*          className="mb-4 block text-sm text-body-color dark:text-dark-6"*/}
        {/*        >*/}
        {/*          Full Name**/}
        {/*        </label>*/}
        {/*        <input*/}
        {/*          type="text"*/}
        {/*          name="fullName"*/}
        {/*          placeholder="Adam Gelius"*/}
        {/*          className="w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-dark placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white"*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*      <div className="mb-[22px]">*/}
        {/*        <label*/}
        {/*          htmlFor="email"*/}
        {/*          className="mb-4 block text-sm text-body-color dark:text-dark-6"*/}
        {/*        >*/}
        {/*          Email**/}
        {/*        </label>*/}
        {/*        <input*/}
        {/*          type="email"*/}
        {/*          name="email"*/}
        {/*          placeholder="example@yourmail.com"*/}
        {/*          className="w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-dark placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white"*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*      <div className="mb-[22px]">*/}
        {/*        <label*/}
        {/*          htmlFor="phone"*/}
        {/*          className="mb-4 block text-sm text-body-color dark:text-dark-6"*/}
        {/*        >*/}
        {/*          Phone**/}
        {/*        </label>*/}
        {/*        <input*/}
        {/*          type="text"*/}
        {/*          name="phone"*/}
        {/*          placeholder="+885 1254 5211 552"*/}
        {/*          className="w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-dark placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white"*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*      <div className="mb-[30px]">*/}
        {/*        <label*/}
        {/*          htmlFor="message"*/}
        {/*          className="mb-4 block text-sm text-body-color dark:text-dark-6"*/}
        {/*        >*/}
        {/*          Message**/}
        {/*        </label>*/}
        {/*        <textarea*/}
        {/*          name="message"*/}
        {/*          rows={1}*/}
        {/*          placeholder="type your message here"*/}
        {/*          className="w-full resize-none border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-dark placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white"*/}
        {/*        ></textarea>*/}
        {/*      </div>*/}
        {/*      <div className="mb-0">*/}
        {/*        <button*/}
        {/*          type="submit"*/}
        {/*          className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-3 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-primary/90"*/}
        {/*        >*/}
        {/*          Send*/}
        {/*        </button>*/}
        {/*      </div>*/}
        {/*    </form>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*</div>*/}
      </div>
    </section>
  );
};

export default Contact;
