import { useEffect, useState } from "react";

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
      className="wow fadeInUp fixed bottom-0 left-0 right-0 z-10 bg-[#090E34]"
      data-wow-delay=".15s"
    >
      <div className="border-t border-[#8890A4] border-opacity-40 py-1">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-2/3 lg:w-1/2"></div>
            <div className="w-full px-4 md:w-1/3 lg:w-1/2">
              <div className="flex justify-center font-thin md:justify-end">
                <p className="text-xs text-gray-7">
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
    </footer>
  );
};

export default Footer;
