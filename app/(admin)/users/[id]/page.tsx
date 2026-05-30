"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/components/api";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { User } from "@/types";

interface StudentProgressLog {
  block_id: string;
  block_title: string;
  status:
    | "not_started"
    | "in_progress"
    | "waiting_buddy_confirmation"
    | "approved";
  percent: number;
}

export default function AdminUserProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<StudentProgressLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async () => {
    try {
      const [userData, progressData] = await Promise.all([
        api.get<User>(`/api/admin/users/${id}`),
        api.get<StudentProgressLog[]>(`/api/admin/users/${id}/progress`),
      ]);
      setUser(userData);
      setProgress(progressData || []);
    } catch (err) {
      toast.error("Не удалось загрузить данные пользователя");
      setUser(null);
      setProgress([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadUserProfile();
  }, [id]);

  const handleSuperBuddyApprove = async (blockId: string) => {
    try {
      await api.post(`/api/admin/users/${id}/approve-block/${blockId}`, {});
      toast.success("Блок подтверждён администратором!");
      loadUserProfile();
    } catch {
      toast.error("Не удалось подтвердить блок");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "waiting_buddy_confirmation":
        return "warning";
      case "in_progress":
        return "primary";
      default:
        return "default";
    }
  };

  if (loading)
    return (
      <Spinner
        className="flex h-[60vh] justify-center"
        color="secondary"
        size="lg"
      />
    );
  if (!user)
    return (
      <div className="text-center py-8 text-danger">Профиль не найден</div>
    );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Button
        size="sm"
        variant="bordered"
        className="border-border-subtle text-text-muted"
        onClick={() => router.push("/users")}
      >
        <Icon icon="lucide:arrow-left" /> Назад
      </Button>

      <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
        <CardBody className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text-main">
                {user.display_name}
              </h2>
              <Chip
                size="sm"
                variant="flat"
                color="secondary"
                className="text-[10px] font-medium uppercase"
              >
                @{user.login}
              </Chip>
            </div>
            <p className="text-sm text-text-muted">
              Дата начала:{" "}
              {user.learning_started_at
                ? new Date(user.learning_started_at).toLocaleDateString()
                : "—"}
            </p>
            {user.telegram_username && (
              <p className="text-sm text-brand-purple font-medium">
                Telegram: {user.telegram_username}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {user.roles.map((r) => (
              <Chip
                key={r}
                size="sm"
                className="border border-border-subtle uppercase text-[10px] font-medium"
              >
                {r}
              </Chip>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-text-main flex items-center gap-2">
            <Icon icon="lucide:shield-alert" className="text-brand-purple" />{" "}
            Прогресс студента
          </h3>
          <p className="text-sm text-text-muted">
            Администратор может подтверждать блоки вручную
          </p>
        </div>
        <Table aria-label="Прогресс по блокам">
          <TableHeader>
            <TableColumn>Блок</TableColumn>
            <TableColumn>Прогресс</TableColumn>
            <TableColumn>Статус</TableColumn>
            <TableColumn align="end">Действие</TableColumn>
          </TableHeader>
          <TableBody>
            {progress.map((prog) => (
              <TableRow
                key={prog.block_id}
                className="border-b border-border-subtle/40 last:border-none"
              >
                <TableCell className="text-sm font-medium">
                  {prog.block_title}
                </TableCell>
                <TableCell className="text-sm">{prog.percent}%</TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={getStatusColor(prog.status)}
                    className="text-[10px] uppercase font-medium"
                  >
                    {prog.status.replace(/_/g, " ")}
                  </Chip>
                </TableCell>
                <TableCell className="text-right">
                  {prog.status === "waiting_buddy_confirmation" ? (
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      className="text-xs font-medium"
                      onClick={() => handleSuperBuddyApprove(prog.block_id)}
                    >
                      Подтвердить
                    </Button>
                  ) : prog.status === "approved" ? (
                    <span className="text-xs text-success italic">
                      Одобрено
                    </span>
                  ) : (
                    <span className="text-xs text-text-muted italic">
                      В процессе
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
