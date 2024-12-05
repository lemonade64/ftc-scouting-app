"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import Navigation from "@/components/navigation";

export default function Header({ scroll = true }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrolled = useScroll(50);

  const pathname = usePathname();
  const isDocs = pathname.startsWith("/docs");
  const isHome = pathname === "/";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isDocs || isHome) return null;

  return (
    <header
      className={cn(
        "z-40 w-full transition-all",
        "border-b",
        isModalOpen
          ? "bg-background"
          : scroll
          ? scrolled
            ? "border-b bg-background/60 backdrop-blur-xl"
            : "bg-background/0"
          : "bg-background"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 py-4">
        <Navigation setIsModalOpen={setIsModalOpen} isHome={false} />
        <div className="flex items-center space-x-3 pl-4">
          <Button className="px-3" variant="default" size="lg">
            <Link href="/teams">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
