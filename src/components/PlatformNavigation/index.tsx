"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationMenu = () => {
  const currentPath = usePathname();

  return (
    <div className="mb-8 flex items-center space-x-4">
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
    </div>
  );
};

export default NavigationMenu;
