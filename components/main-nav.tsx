import Link from "next/link"
import { cn } from "@/lib/utils"

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  activeItem?: string;
}

export function MainNav({ className, activeItem, ...props }: MainNavProps) {
  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/alerts", label: "Alerts" },
    { href: "/devices", label: "Devices" },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            item.href === activeItem
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
