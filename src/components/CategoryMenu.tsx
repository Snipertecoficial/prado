import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";

export const CategoryMenu = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <nav className="bg-primary text-primary-foreground shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap items-center justify-center gap-1 text-xs sm:text-sm font-semibold uppercase tracking-wide">
          {CATEGORIES.map((category) => (
            <li
              key={category.slug}
              className="relative group"
              onMouseEnter={() => setOpenMenu(category.slug)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className={cn(
                  "flex items-center gap-1 px-3 sm:px-4 py-3 transition-colors hover:bg-primary/80",
                  openMenu === category.slug && "bg-primary/80"
                )}
              >
                {category.name}
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Mega Menu Dropdown */}
              {openMenu === category.slug && (
                <div className="absolute left-0 top-full z-50 min-w-[280px] bg-background border border-border shadow-lg rounded-md p-4">
                  <div className="grid gap-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={`/categoria/${category.slug}/${sub.slug}`}
                        className={cn(
                          "block px-3 py-2 text-sm text-foreground rounded-md transition-colors hover:bg-muted",
                          sub.featured && "font-semibold text-primary"
                        )}
                      >
                        {sub.name}
                        {sub.featured && (
                          <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                            Destaque
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
