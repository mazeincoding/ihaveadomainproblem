"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();

  const links = [
    {
      name: "Confessional",
      href: "/",
    },
    {
      name: "Listings",
      href: "/listings",
    },
  ];

  return (
    <nav className="flex justify-center items-center py-4 sticky top-0 z-50 backdrop-blur-md">
      <ul className="flex space-x-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors text-muted-foreground hover:text-primary",
                {
                  "text-foreground": pathname === link.href,
                }
              )}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
