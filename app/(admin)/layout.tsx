"use client";
import "../../styles/globals.css";
import { useEffect, useState, useRef } from "react";
import {
  HeroUIProvider,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Toaster } from "sonner";
import { flushSync } from "react-dom";
import AdminSidebar from "./components/admin-sidebar";

// Временная заглушка (позже заменить на реальный хук)
const useAuthMock = () => ({
  user: { display_name: "Admin" },
  logout: () => {
    document.cookie = "token=; path=/; max-age=0";
    localStorage.removeItem("token");
    window.location.href = "/login";
  },
});

function AdminHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuthMock();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const pageTitles: Record<string, string> = {
    "/dashboard": "Дашборд",
    "/users": "Пользователи",
    "/roadmap/blocks": "Блоки",
    "/roadmap/materials": "Материалы",
    "/achievements": "Достижения",
    "/one-on-one": "Заявки 1x1",
  };

  const currentTitle = pageTitles[pathname] || "Администрирование";

  const toggleThemeWithWave = async () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }
    document.documentElement.classList.add("disable-transitions");
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });
    await transition.ready;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const right = window.innerWidth - rect.left;
      const bottom = window.innerHeight - rect.top;
      const maxRadius = Math.hypot(
        Math.max(rect.left, right),
        Math.max(rect.top, bottom),
      );
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }
    transition.finished.finally(() => {
      document.documentElement.classList.remove("disable-transitions");
    });
  };

  return (
    <header className="h-20 px-8 border-b border-border-subtle bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
      <div className="min-w-[200px]" />
      <div className="flex justify-center flex-1">
        <h1 className="text-lg font-bold font-mono text-text-main tracking-tight uppercase border-b-2 border-brand-primary/40 px-2 pb-0.5">
          {currentTitle}
        </h1>
      </div>
      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        <Button
          ref={buttonRef}
          isIconOnly
          size="sm"
          variant="light"
          className="text-text-muted hover:text-text-main rounded-full active:scale-95 transition-transform"
          onClick={toggleThemeWithWave}
        >
          {mounted ? (
            <Icon
              icon={theme === "dark" ? "lucide:sun" : "lucide:moon"}
              className="w-[18px] h-[18px]"
            />
          ) : (
            <div className="w-[18px] h-[18px] bg-text-muted/20 rounded-full" />
          )}
        </Button>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly variant="light" className="rounded-full">
              <Avatar
                name={user?.display_name || "Admin"}
                size="sm"
                className="cursor-pointer"
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Профиль">
            <DropdownItem
              key="profile"
              startContent={<Icon icon="lucide:user" />}
            >
              Профиль
            </DropdownItem>
            <DropdownItem
              key="logout"
              startContent={<Icon icon="lucide:log-out" />}
              color="danger"
              onClick={logout}
            >
              Выход
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="system">
        <div className="flex h-screen w-full overflow-hidden bg-canvas">
          <AdminSidebar />
          <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-8 bg-canvas text-text-main">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
