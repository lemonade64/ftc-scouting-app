"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useScroll } from "@/hooks/useScroll";

import { Button } from "@/components/ui/button";

import Navigation from "@/components/Navigation";

export default function Header({ scroll = true }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrolled = useScroll(50);

  const pathname = usePathname();

  const isHome = pathname === "/";
  const isDocs = pathname.includes("/docs");

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsModalOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header
      className={`${
        isHome ? "sticky top-0" : isDocs ? "hidden" : ""
      } z-40 flex w-full justify-center transition-all ${
        isModalOpen
          ? "bg-background"
          : scroll && isHome
          ? scrolled
            ? "bg-background/60 backdrop-blur-xl border-b"
            : "bg-background/0"
          : "bg-background border-b"
      }`}
    >
      <div className="container mx-auto flex h-16 justify-between py-4 md:gap-x-8 gap-x-2 px-4">
        <Navigation setIsModalOpen={setIsModalOpen} isHome={isHome} />
        <div className="flex items-center space-x-3">
          {isHome ? (
            <Button className="px-3" variant="default" size="lg">
              <Link href="/scout">Get Started</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
