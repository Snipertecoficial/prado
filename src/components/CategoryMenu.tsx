import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";

export const CategoryMenu = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center gap-1">
          {CATEGORIES.map((category) => (
            <li
              key={category.slug}
              className="relative group"
              onMouseEnter={() => setOpenMenu(category.slug)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className={cn(
                  "flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/10",
                  openMenu === category.slug && "bg-primary-foreground/10"
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
