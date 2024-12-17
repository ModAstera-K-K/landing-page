import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DotsPattern from "@/components/Common/Icons/FooterIcons/DotsPattern";
import LinkedInIcon from "@/components/Common/Icons/SocialIcons/LinkedInIcon";

const Footer = ({ lang }: { lang: string }) => {
  // Add dictionary state
  const [dictionary, setDictionary] = useState<any>({});

  // Load dictionary on component mount
  useEffect(() => {
    const loadDictionary = async () => {
      const t = await import(`../../../public/dictionaries/${lang}.json`);
      setDictionary(t.default);
    };
    loadDictionary();
  }, [lang]);

  return (
    <footer
      className="wow fadeInUp relative z-10 bg-[#090E34] pt-20 lg:pt-[100px]"
      data-wow-delay=".15s"
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-4/12 xl:w-3/12">
            <div className="mb-10 w-full">
              <Link href="/" className="mb-6 inline-block max-w-[160px]">
                <Image
                  src="/images/logo/logo-white.svg"
                  alt="logo"
                  width={140}
                  height={30}
                  className="max-w-full"
                />
              </Link>
              <p className="mb-8 max-w-[270px] text-base text-gray-7">
                {dictionary?.footer?.title}
              </p>
              <div className="-mx-3 flex items-center">
                <a
                  aria-label="linkedin link"
                  href="https://www.linkedin.com/company/modastera"
                  className="px-3 text-gray-7 hover:text-white"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </div>
          {/*<div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">*/}
          {/*  <div className="mb-10 w-full">*/}
          {/*    <h4 className="mb-9 text-lg font-semibold text-white">*/}
          {/*      About Us*/}
          {/*    </h4>*/}
          {/*    <ul>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          Home*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          Features*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          About*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          Testimonial*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*    </ul>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-3/12 xl:w-2/12">*/}
          {/*  <div className="mb-10 w-full">*/}
          {/*    <h4 className="mb-9 text-lg font-semibold text-white">*/}
          {/*      Features*/}
          {/*    </h4>*/}
          {/*    <ul>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          How it works*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          Privacy policy*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          Terms of Service*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          Refund policy*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*    </ul>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-3/12 xl:w-2/12">*/}
          {/*  <div className="mb-10 w-full">*/}
          {/*    <h4 className="mb-9 text-lg font-semibold text-white">*/}
          {/*      Our Products*/}
          {/*    </h4>*/}
          {/*    <ul>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          LineIcons*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          Next.js Templates*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          TailAdmin*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          PlainAdmin*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*    </ul>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div className="w-full px-4 md:w-2/3 lg:w-6/12 xl:w-3/12">*/}
          {/*  <div className="mb-10 w-full">*/}
          {/*    <h4 className="mb-9 text-lg font-semibold text-white">*/}
          {/*      Useful Links*/}
          {/*    </h4>*/}
          {/*    <ul>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          FAQ*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          Blogs*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          Support*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*      <li>*/}
          {/*        <a*/}
          {/*          href="/#"*/}
          {/*          className="mb-3 inline-block text-base text-gray-7 hover:text-primary"*/}
          {/*        >*/}
          {/*          About*/}
          {/*        </a>*/}
          {/*      </li>*/}
          {/*    </ul>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>

      <div className="mt-12 border-t border-[#8890A4] border-opacity-40 py-8 lg:mt-[60px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-2/3 lg:w-1/2">
              {/* <div className="my-1">
                <div className="-mx-3 flex items-center justify-center md:justify-start">
                  <a
                    href="/#"
                    className="px-3 text-base text-gray-7 hover:text-white hover:underline"
                  >
                    Privacy policy
                  </a>
                  <a
                    href="/#"
                    className="px-3 text-base text-gray-7 hover:text-white hover:underline"
                  >
                    Legal notice
                  </a>
                  <a
                    href="/#"
                    className="px-3 text-base text-gray-7 hover:text-white hover:underline"
                  >
                    Terms of service
                  </a>
                </div>
              </div> */}
            </div>
            <div className="w-full px-4 md:w-1/3 lg:w-1/2">
              <div className="my-1 flex justify-center md:justify-end">
                <p className="text-base text-gray-7">
                  © 2024{" "}
                  <a
                    href="https://modastera.com"
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    className="text-gray-1 hover:underline"
                  >
                    ModAstera Inc.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <span className="absolute left-0 top-0 z-[-1] aspect-[95/82] w-full max-w-[570px]">
          <Image src="/images/footer/shape-1.svg" alt="shape" fill />
        </span>

        <span className="absolute bottom-0 right-0 z-[-1] aspect-[31/22] w-full max-w-[372px]">
          <Image src="/images/footer/shape-3.svg" alt="shape" fill />
        </span>

        <span className="absolute right-0 top-0 z-[-1]">
          <DotsPattern />
        </span>
      </div>
    </footer>
  );
};

export default Footer;
