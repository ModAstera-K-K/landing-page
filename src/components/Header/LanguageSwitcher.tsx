"use client";

import { usePathname, useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

const LanguageSwitcher = ({ currentLang }: { currentLang: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: string) => {
    setCookie("i18nlang", newLang);
    const newPathname = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-2 mr-2">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`text-sm ${
          currentLang === "en"
            ? "text-primary"
            : "text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
        }`}
      >
        EN
      </button>
      <span className="text-body-color dark:text-dark-6">|</span>
      <button
        onClick={() => handleLanguageChange("jp")}
        className={`text-sm ${
          currentLang === "jp"
            ? "text-primary"
            : "text-body-color hover:text-primary dark:text-dark-6 dark:hover:text-primary"
        }`}
      >
        日本語
      </button>
    </div>
  );
};

export default LanguageSwitcher;
