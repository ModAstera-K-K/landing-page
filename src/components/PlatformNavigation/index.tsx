"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BackArrowIcon from "@/components/Common/Icons/NavigationIcons/BackArrowIcon";

const NavigationMenu = () => {
  const currentPath = usePathname();
  const isTrainingAdvanced = currentPath.includes("/platform/training-advanced");

  return (
    <div className="mb-8 flex items-center justify-between">
      <nav className="space-x-6">
        <Link href="/platform/dashboard">
          <span
            className={
              currentPath.includes("/platform/dashboard")
                ? "font-semibold text-gray-800 dark:text-gray-200"
                : "text-gray-500 dark:text-gray-400"
            }
          >
            Dashboard
          </span>
        </Link>
        <Link href="/platform/training">
          <span
            className={
              currentPath.includes("/platform/training")
                ? "font-semibold text-gray-800 dark:text-gray-200"
                : "text-gray-500 dark:text-gray-400"
            }
          >
            Training
          </span>
        </Link>
        <Link href="/platform/deployment">
          <span
            className={
              currentPath.includes("/platform/deployment")
                ? "font-semibold text-gray-800 dark:text-gray-200"
                : "text-gray-500 dark:text-gray-400"
            }
          >
            Deployment
          </span>
        </Link>
      </nav>
      {isTrainingAdvanced && (
        <Link
          href={`/platform/training/${currentPath.split('/').pop()}`}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <BackArrowIcon />
          <span>Back</span>
        </Link>
      )}
    </div>
  );
};

export default NavigationMenu;
