"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface MenuItem {
  href: string;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { href: "/dashboard", label: "Дашборд", icon: "lucide:layout-dashboard" },
  { href: "/users", label: "Пользователи", icon: "lucide:users" },
  { href: "/roadmap/blocks", label: "Блоки", icon: "lucide:layers" },
  { href: "/roadmap/materials", label: "Материалы", icon: "lucide:book-open" },
  { href: "/achievements", label: "Достижения", icon: "lucide:award" },
  { href: "/one-on-one", label: "Заявки 1x1", icon: "lucide:help-circle" },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const renderMenuItem = (item: MenuItem) => {
    const isActive =
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href));

    return (
      <div
        key={item.href}
        onClick={() => router.push(item.href)}
        className={`h-12 px-3 rounded-md font-mono text-base transition-colors mb-1 flex items-center cursor-pointer ${
          isCollapsed ? "justify-center px-0" : ""
        } ${
          isActive
            ? "bg-brand-primary/10 text-brand-primary font-bold"
            : "text-text-muted hover:text-text-main hover:bg-surface/50"
        }`}
      >
        <Icon
          icon={item.icon}
          className={`w-5 h-5 shrink-0 ${isCollapsed ? "mx-auto" : "mr-3"}`}
        />
        {!isCollapsed && <span>{item.label}</span>}
      </div>
    );
  };

  return (
    <>
      {/* Мобильная кнопка */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-surface border border-border-subtle text-text-muted hover:text-text-main transition-all duration-300 lg:hidden"
      >
        <Icon
          icon={isCollapsed ? "lucide:chevron-right" : "lucide:chevron-left"}
          className="w-5 h-5"
        />
      </button>

      <aside
        className={`h-screen bg-surface border-r border-border-subtle flex flex-col justify-between p-6 shrink-0 sticky top-0 transition-all duration-300 ${
          isCollapsed ? "w-[80px]" : "w-[280px]"
        }`}
      >
        <div>
          {/* Полный логотип */}
          <div
            className={`flex flex-col items-center text-center mb-8 transition-all duration-300 ${
              isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            <span className="text-2xl font-bold tracking-tight text-text-main font-mono">
              Go <span className="text-brand-primary">Admin</span>
            </span>
            <span className="text-[11px] uppercase font-mono tracking-wider text-text-muted mt-1 font-bold">
              Панель управления
            </span>
          </div>

          {/* Компактный логотип */}
          {isCollapsed && (
            <div className="flex justify-center mb-8">
              <span className="text-2xl font-bold text-brand-primary font-mono">
                GA
              </span>
            </div>
          )}

          {/* Кнопка сворачивания */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex items-center justify-center w-full mb-4 p-2 rounded-lg bg-surface border border-border-subtle text-text-muted hover:text-text-main transition-all duration-300 ${
              isCollapsed ? "px-0" : ""
            }`}
          >
            <Icon
              icon={
                isCollapsed ? "lucide:chevron-right" : "lucide:chevron-left"
              }
              className="w-4 h-4"
            />
            {!isCollapsed && (
              <span className="ml-2 text-xs font-mono">Свернуть</span>
            )}
          </button>

          {/* Меню */}
          <div className="flex flex-col gap-1">
            {menuItems.map((item) =>
              isCollapsed ? (
                <Tooltip key={item.href} content={item.label} placement="right">
                  {renderMenuItem(item)}
                </Tooltip>
              ) : (
                renderMenuItem(item)
              ),
            )}
          </div>
        </div>

        {/* Кнопка основного сайта */}
        <Tooltip
          content="На основной сайт"
          placement="right"
          isDisabled={!isCollapsed}
        >
          <button
            onClick={() =>
              window.open(
                process.env.NEXT_PUBLIC_MAIN_SITE_URL ||
                  "http://localhost:3000",
                "_blank",
              )
            }
            className={`w-full mt-4 h-9 rounded-md text-xs text-text-muted hover:text-text-main flex items-center justify-center gap-2 transition-all hover:bg-surface/30 border border-border-subtle ${
              isCollapsed ? "px-0" : "px-3"
            }`}
          >
            <Icon icon="lucide:external-link" className="w-4 h-4 shrink-0" />
            {!isCollapsed && "Основной сайт"}
          </button>
        </Tooltip>
      </aside>
    </>
  );
}
