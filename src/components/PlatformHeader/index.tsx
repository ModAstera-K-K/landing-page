"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import PlatformHamburgerButton from "@/components/Common/Icons/MenuIcons/PlatformHamburgerButton";
import ThemeToggler from "@/components/Common/ThemeToggler";

import menuData from "./menuData";

const Header = ({ lang }: { lang: string }) => {
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

  const pathUrl = usePathname();
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: any) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const { theme, setTheme } = useTheme();

  return (
    <>
      <header
        className={`ud-header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "shadow-nav fixed z-[999] border-b border-stroke bg-white/80 backdrop-blur-[15px] dark:border-dark-3/20 dark:bg-dark/50"
            : // : "absolute bg-transparent"
              "fixed z-[999] bg-white/80 backdrop-blur-[15px] dark:bg-dark/50"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4">
              <Link
                href="/"
                className={`navbar-logo block w-full ${
                  sticky ? "py-1" : "py-2"
                } `}
              >
                {pathUrl !== "/" ? (
                  <>
                    <Image
                      src={`/images/logo/logo.svg`}
                      alt="logo"
                      width={240}
                      height={30}
                      className="header-logo w-full dark:hidden"
                    />
                    <Image
                      src={`/images/logo/logo-white.svg`}
                      alt="logo"
                      width={240}
                      height={30}
                      className="header-logo hidden w-full dark:block"
                    />
                  </>
                ) : (
                  <>
                    <Image
                      src={`${
                        sticky
                          ? "/images/logo/logo.svg"
                          : "/images/logo/logo-white.svg"
                      }`}
                      alt="logo"
                      width={140}
                      height={30}
                      className="header-logo w-full dark:hidden"
                    />
                    <Image
                      src={"/images/logo/logo-white.svg"}
                      alt="logo"
                      width={140}
                      height={30}
                      className="header-logo hidden w-full dark:block"
                    />
                  </>
                )}
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <PlatformHamburgerButton
                  navbarOpen={navbarOpen}
                  pathUrl={pathUrl}
                  sticky={sticky}
                  onClick={navbarToggleHandler}
                />
              </div>
              <div className="hidden items-center justify-end pr-16 sm:flex lg:pr-0">
                <div>
                  <LanguageSwitcher currentLang={lang} />
                </div>
                <div>
                  <ThemeToggler sticky={sticky} isHome={pathUrl === "/"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
