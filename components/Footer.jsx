"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Github, Paintbrush } from "lucide-react";

function capitalise(string) {
  return string[0].toUpperCase() + string.slice(1);
}

export default function Footer() {
  const { setTheme, themes } = useTheme();
  const pathname = usePathname();
  const isDocs = pathname.includes("/docs");

  return (
    <footer className={`${isDocs ? "hidden" : ""} border-t border-neutral-200`}>
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <span className="text-sm font-medium">{siteConfig.name.default}</span>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Paintbrush className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {themes.map((t) => (
                <DropdownMenuItem key={t} onClick={() => setTheme(t)}>
                  {capitalise(t)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
