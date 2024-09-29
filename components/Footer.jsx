"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { siteConfig } from "@/config/site";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { Github, Moon, Sun } from "lucide-react";

export default function Footer() {
  const { theme, setTheme } = useTheme();

  const pathname = usePathname();
  const isDocs = pathname.includes("/docs");

  return (
    <footer
      className={`${
        isDocs ? "hidden" : ""
      } border-t border-neutral-200 dark:border-neutral-800`}
    >
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <span className="text-sm font-medium">{siteConfig.name.default}</span>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Link href={siteConfig.links.repo} target="_blank">
            <Button variant="ghost" size="icon">
              <Github className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
