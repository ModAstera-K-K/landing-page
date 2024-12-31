"use client";

import PlatformNavigation from "@/components/PlatformNavigation";
import { DatasetsSection } from "./components/DatasetsSection";
import { ModelsSection } from "./components/ModelsSection";
import { StatsSection } from "./components/StatsSection";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />
      <StatsSection />
      <div className="grid grid-cols-2 gap-6">
        <DatasetsSection />
        <ModelsSection />
      </div>
    </div>
  );
}
