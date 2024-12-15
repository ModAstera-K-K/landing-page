import { useTheme } from "next-themes";
import SunIcon from "@/components/Common/Icons/ThemeIcons/SunIcon";
import MoonIcon from "@/components/Common/Icons/ThemeIcons/MoonIcon";

interface ThemeTogglerProps {
  sticky: boolean;
  isHome: boolean;
}

const ThemeToggler = ({ sticky, isHome }: ThemeTogglerProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="theme toggler"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-8 w-8 items-center justify-center text-body-color duration-300 dark:text-white"
    >
      <span>
        <SunIcon />
        <MoonIcon sticky={sticky} isHome={isHome} />
      </span>
    </button>
  );
};

export default ThemeToggler; 