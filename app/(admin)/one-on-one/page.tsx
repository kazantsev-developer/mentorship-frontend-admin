"use client";
import { useEffect, useState } from "react";
import { api } from "@/components/api";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { OneOnOneRequest } from "@/types";

export default function AdminOneOnOnePage() {
  const [requests, setRequests] = useState<OneOnOneRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const data = await api.get<OneOnOneRequest[]>("/api/admin/one-on-one");
      setRequests(data || []);
    } catch {
      toast.error("Не удалось загрузить заявки");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleProcess = async (
    id: string,
    action: "approve" | "reject" | "complete",
    currentBonus: number,
  ) => {
    if (action === "approve" && currentBonus < 1000) {
      toast.error("Недостаточно бонусов (нужно 1000)");
      return;
    }
    try {
      await api.post(`/api/admin/one-on-one/${id}/${action}`, {});
      toast.success(
        `Заявка ${action === "approve" ? "одобрена" : action === "reject" ? "отклонена" : "завершена"}`,
      );
      loadRequests();
    } catch (err: any) {
      toast.error(err.message || "Ошибка");
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "approved":
        return "Одобрена";
      case "rejected":
        return "Отклонена";
      case "completed":
        return "Завершена";
      default:
        return status;
    }
  };

  if (loading)
    return <div className="text-center py-8">Загрузка заявок...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Table aria-label="Заявки">
        <TableHeader>
          <TableColumn>Студент</TableColumn>
          <TableColumn>Бонусы</TableColumn>
          <TableColumn>Дата</TableColumn>
          <TableColumn>Статус</TableColumn>
          <TableColumn align="end">Действия</TableColumn>
        </TableHeader>
        <TableBody>
          {requests.map((req) => (
            <TableRow
              key={req.id}
              className="border-b border-border-subtle/40 last:border-none"
            >
              <TableCell className="text-sm font-medium">
                {req.student_name}
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={req.student_bonus >= 1000 ? "success" : "danger"}
                  className="font-medium text-xs"
                >
                  {req.student_bonus} XP
                </Chip>
              </TableCell>
              <TableCell className="text-sm">
                {new Date(req.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={
                    req.status === "pending"
                      ? "warning"
                      : req.status === "approved"
                        ? "success"
                        : "default"
                  }
                  className="text-xs uppercase font-medium"
                >
                  {getStatusLabel(req.status)}
                </Chip>
              </TableCell>
              <TableCell className="text-right">
                {req.status === "pending" && (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      className="text-xs font-medium"
                      isDisabled={req.student_bonus < 1000}
                      onClick={() =>
                        handleProcess(req.id, "approve", req.student_bonus)
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      className="text-xs font-medium"
                      onClick={() =>
                        handleProcess(req.id, "reject", req.student_bonus)
                      }
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {req.status === "approved" && (
                  <Button
                    size="sm"
                    color="primary"
                    variant="solid"
                    className="text-xs font-medium"
                    onClick={() =>
                      handleProcess(req.id, "complete", req.student_bonus)
                    }
                  >
                    Complete
                  </Button>
                )}
                {(req.status === "rejected" || req.status === "completed") && (
                  <span className="text-xs text-text-muted italic">
                    Обработано
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
