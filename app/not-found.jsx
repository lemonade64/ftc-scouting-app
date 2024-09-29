import Link from "next/link";
import { ChevronRight, BookOpen, Flag, ClipboardList } from "lucide-react";
import { errorLinks } from "@/config/site";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-130px)] bg-background">
      <div className="w-full max-w-2xl px-4 py-12">
        <h2 className="text-primary text-4xl font-bold text-center mb-4">
          404
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          This page does not exist
        </h1>
        <p className="text-lg md:text-xl text-center mb-12 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div className="space-y-4 md:space-y-6">
          {errorLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="flex items-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <div className="w-6 h-6 mr-4 text-primary">
                {getIcon(link.name)}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{link.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function getIcon(name) {
  switch (name.toLowerCase()) {
    case "documentation":
      return <BookOpen className="w-6 h-6" />;
    case "features":
      return <Flag className="w-6 h-6" />;
    case "scout":
      return <ClipboardList className="w-6 h-6" />;
  }
}
