import { featuresList } from "@/config/site";
import { cn } from "@/lib/utils";

import {
  QrCode,
  UserRoundCheck,
  Github,
  Cloud,
  UserPen,
  ChartColumn,
  FileSpreadsheet,
  Heart,
} from "lucide-react";

function FeatureSection() {
  return (
    <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 mx-auto px-4">
      {featuresList.map((feature, index) => (
        <div
          key={feature.title}
          className={cn(
            "flex flex-col lg:border-r py-10 relative group dark:border-neutral-800",
            (index === 0 || index === 4) &&
              "lg:border-l dark:border-neutral-800",
            index < 4 && "lg:border-b dark:border-neutral-800"
          )}
        >
          {index < 4 ? (
            <div className="opacity-0 group-hover:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
          ) : (
            <div className="opacity-0 group-hover:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
          )}
          <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
            {getIcon(feature.title)}
          </div>
          <div className="text-lg font-bold mb-2 relative z-10 px-10">
            <div className="absolute left-0 inset-y-0 h-6 group-hover:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover:bg-black transition-all duration-200 origin-center" />
            <span className="group-hover:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
              {feature.title}
            </span>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function getIcon(name) {
  switch (name.toLowerCase()) {
    case "offline compatibility":
      return <QrCode className="w-6 h-6" />;
    case "ease of use":
      return <UserRoundCheck className="w-6 h-6" />;
    case "open source":
      return <Github className="w-6 h-6" />;
    case "99.99% uptime":
      return <Cloud className="w-6 h-6" />;
    case "made by students":
      return <UserPen className="w-6 h-6" />;
    case "data analysis":
      return <ChartColumn className="w-6 h-6" />;
    case "google sheets integration":
      return <FileSpreadsheet className="w-6 h-6" />;
    case "and everything else":
      return <Heart className="w-6 h-6" />;
  }
}

export default function Home() {
  return (
    <>
      <FeatureSection />
    </>
  );
}
