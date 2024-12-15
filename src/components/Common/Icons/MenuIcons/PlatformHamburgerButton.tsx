import PlatformHamburgerIcon from "./PlatformHamburgerIcon";

interface PlatformHamburgerButtonProps {
  navbarOpen: boolean;
  pathUrl: string;
  sticky: boolean;
  onClick: () => void;
}

const PlatformHamburgerButton = ({ navbarOpen, pathUrl, sticky, onClick }: PlatformHamburgerButtonProps) => (
  <button
    onClick={onClick}
    id="navbarToggler"
    aria-label="Mobile Menu"
    className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
  >
    <PlatformHamburgerIcon 
      navbarOpen={navbarOpen}
      pathUrl={pathUrl}
      sticky={sticky}
    />
  </button>
);

export default PlatformHamburgerButton; 