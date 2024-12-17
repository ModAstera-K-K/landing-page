interface HamburgerIconProps {
  navbarOpen: boolean;
  pathUrl: string;
  sticky: boolean;
}

const HamburgerIcon = ({ navbarOpen, pathUrl, sticky }: HamburgerIconProps) => (
  <>
    <span
      className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
        navbarOpen ? " top-[7px] rotate-45" : " "
      } ${pathUrl !== "/" && "!bg-dark dark:!bg-white"} ${
        pathUrl === "/" && sticky
          ? "bg-dark dark:bg-white"
          : "bg-white"
      }`}
    />
    <span
      className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
        navbarOpen ? "opacity-0 " : " "
      } ${pathUrl !== "/" && "!bg-dark dark:!bg-white"} ${
        pathUrl === "/" && sticky
          ? "bg-dark dark:bg-white"
          : "bg-white"
      }`}
    />
    <span
      className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
        navbarOpen ? " top-[-8px] -rotate-45" : " "
      } ${pathUrl !== "/" && "!bg-dark dark:!bg-white"} ${
        pathUrl === "/" && sticky
          ? "bg-dark dark:bg-white"
          : "bg-white"
      }`}
    />
  </>
);

export default HamburgerIcon; 