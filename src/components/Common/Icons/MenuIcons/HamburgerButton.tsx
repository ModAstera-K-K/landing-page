import HamburgerIcon from "./HamburgerIcon";

interface HamburgerButtonProps {
  navbarOpen: boolean;
  pathUrl: string;
  sticky: boolean;
  onClick: () => void;
}

const HamburgerButton = ({ navbarOpen, pathUrl, sticky, onClick }: HamburgerButtonProps) => (
  <button
    onClick={onClick}
    id="navbarToggler"
    aria-label="Mobile Menu"
    className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
  >
    <HamburgerIcon 
      navbarOpen={navbarOpen}
      pathUrl={pathUrl}
      sticky={sticky}
    />
  </button>
);

export default HamburgerButton; 