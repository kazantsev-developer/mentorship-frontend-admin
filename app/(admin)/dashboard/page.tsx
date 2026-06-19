"use client";

import { useEffect, useState } from "react";
import { api } from "@/components/api";
import { Card, CardBody, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

interface DashboardStats {
  total_users: number;
  students_count: number;
  buddies_count: number;
  active_one_on_one: number;
  total_achievements_issued: number;
}

/** Administrative dashboard view displaying aggregated operational metrics and core platform statistics */
export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardStats>("/api/admin/stats")
      .then(setStats)
      .catch((err) => {
        toast.error(err.message || "Не удалось загрузить статистику");
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Spinner
        className="flex h-[60vh] justify-center"
        size="lg"
        color="secondary"
        data-testid="dashboard-spinner"
      />
    );
  }

  if (!stats) {
    return (
      <div
        className="text-center py-8 text-text-muted"
        data-testid="dashboard-no-data"
      >
        Нет данных
      </div>
    );
  }

  const cards = [
    {
      title: "Пользователи",
      val: stats.total_users,
      icon: "lucide:users",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      id: "users",
    },
    {
      title: "Студенты",
      val: stats.students_count,
      icon: "lucide:graduation-cap",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      id: "students",
    },
    {
      title: "Наставники",
      val: stats.buddies_count,
      icon: "lucide:shield-check",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      id: "buddies",
    },
    {
      title: "Заявки 1x1",
      val: stats.active_one_on_one,
      icon: "lucide:clock",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      id: "one-on-one",
    },
    {
      title: "Выдано наград",
      val: stats.total_achievements_issued,
      icon: "lucide:sparkles",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      id: "achievements",
    },
  ];

  return (
    <div
      className="space-y-6 max-w-7xl mx-auto"
      data-testid="dashboard-metrics-grid"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card
            key={c.id}
            data-testid={`stat-card-${c.id}`}
            className="bg-surface border border-border-subtle shadow-none rounded-xl"
          >
            <CardBody className="flex flex-row items-center gap-4 p-4">
              <div className={`p-3 rounded-lg ${c.bg} ${c.color}`}>
                <Icon icon={c.icon} className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase text-text-muted font-medium tracking-wider">
                  {c.title}
                </p>
                <p className="text-2xl font-bold mt-0.5">{c.val}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
