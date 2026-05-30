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
  Input,
  Switch,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { RoadmapBlock } from "@/types";

export default function AdminRoadmapBlocksPage() {
  const [blocks, setBlocks] = useState<RoadmapBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("1");

  const loadBlocks = async () => {
    try {
      const data = await api.get<RoadmapBlock[]>("/api/admin/blocks");
      setBlocks(data || []);
    } catch {
      toast.error("Не удалось загрузить блоки");
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const handleCreateBlock = async () => {
    if (!title) {
      toast.error("Название блока обязательно!");
      return;
    }
    try {
      await api.post("/api/admin/blocks", {
        title,
        description: description || undefined,
        sort_order: parseInt(sortOrder) || 1,
        is_active: true,
      });
      toast.success("Блок создан");
      setTitle("");
      setDescription("");
      setSortOrder("1");
      loadBlocks();
    } catch (err: any) {
      toast.error(err.message || "Ошибка");
    }
  };

  const toggleBlockStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/admin/blocks/${id}`, { is_active: !currentStatus });
      toast.success("Статус изменён");
      loadBlocks();
    } catch {
      toast.error("Не удалось изменить статус");
    }
  };

  if (loading)
    return <div className="text-center py-8">Загрузка блоков...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
        <CardBody className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2">
            <Icon icon="lucide:folder-plus" /> Новый блок
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              size="sm"
              label="Название"
              variant="bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              size="sm"
              label="Описание"
              variant="bordered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              size="sm"
              type="number"
              label="Порядок"
              variant="bordered"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            color="secondary"
            className="font-medium text-xs"
            onClick={handleCreateBlock}
          >
            Создать блок
          </Button>
        </CardBody>
      </Card>

      <Table aria-label="Блоки">
        <TableHeader>
          <TableColumn>Порядок</TableColumn>
          <TableColumn>Название</TableColumn>
          <TableColumn>Описание</TableColumn>
          <TableColumn align="end">Доступен</TableColumn>
        </TableHeader>
        <TableBody>
          {blocks
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((block) => (
              <TableRow
                key={block.id}
                className="border-b border-border-subtle/40 last:border-none"
              >
                <TableCell className="text-sm">#{block.sort_order}</TableCell>
                <TableCell className="text-sm font-medium">
                  {block.title}
                </TableCell>
                <TableCell className="text-sm text-text-muted">
                  {block.description || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    size="sm"
                    color="secondary"
                    isSelected={block.is_active}
                    onChange={() =>
                      toggleBlockStatus(block.id, block.is_active)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
