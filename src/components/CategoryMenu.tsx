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
        <ul className="flex flex-wrap items-center justify-start gap-0">
          {CATEGORIES.map((category) => (
            <li
              key={category.slug}
              className="relative group"
              onMouseEnter={() => setOpenMenu(category.slug)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className={cn(
                  "flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium transition-colors hover:bg-primary-foreground/10",
                  openMenu === category.slug && "bg-primary-foreground/10"
                )}
              >
                {category.name}
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  openMenu === category.slug && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              {openMenu === category.slug && (
                <div className="absolute left-0 top-full z-50 min-w-[260px] bg-card border border-border shadow-lg rounded-b-md py-2">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      to={`/categoria/${category.slug}/${sub.slug}`}
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
