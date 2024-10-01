"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { headerLinks, siteConfig } from "@/config/site";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Menu } from "lucide-react";

function DesktopNavigation({ isHome }) {
  const links = headerLinks;

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}

function MobileNavigation({ setIsModalOpen, isHome }) {
  const [isOpen, setIsOpen] = useState(false);
  const links = headerLinks;

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen, setIsModalOpen]);

  return (
    <div className="md:hidden">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="w-full max-w-sm mx-auto">
            <DrawerHeader>
              <DrawerTitle className="text-xl font-bold">
                {siteConfig.name.short}
              </DrawerTitle>
            </DrawerHeader>
            <nav className="flex flex-col space-y-4 px-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <DrawerFooter className="mt-auto pt-6">
              {isHome ? (
                <Button className="w-full" size="lg">
                  <Link href="/scout">Get Started</Link>
                </Button>
              ) : (
                <Button className="w-full" size="lg">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              )}
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function Navigation({ setIsModalOpen, isHome }) {
  return (
    <div className="flex items-center justify-between w-full">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-xl">{siteConfig.name.short}</span>
      </Link>
      <div className="flex items-center space-x-4">
        <DesktopNavigation isHome={isHome} />
        <MobileNavigation setIsModalOpen={setIsModalOpen} isHome={isHome} />
      </div>
    </div>
  );
}
