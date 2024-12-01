"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          <span>Back</span>
        </Link>
      )}
    </div>
  );
};

export default NavigationMenu;
