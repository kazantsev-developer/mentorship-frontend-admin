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
  Select,
  SelectItem,
  Switch,
  Card,
  CardBody,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { RoadmapMaterial, RoadmapBlock } from "@/types";

export default function AdminRoadmapMaterialsPage() {
  const [materials, setMaterials] = useState<RoadmapMaterial[]>([]);
  const [blocks, setBlocks] = useState<RoadmapBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState("");
  const [materialType, setMaterialType] = useState<
    "theory" | "questions" | "practice" | "homework"
  >("theory");
  const [url, setUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("1");
  const [isRequired, setIsRequired] = useState(true);

  const loadData = async () => {
    try {
      const [materialsData, blocksData] = await Promise.all([
        api.get<RoadmapMaterial[]>("/api/admin/roadmap/materials"),
        api.get<RoadmapBlock[]>("/api/admin/roadmap/blocks"),
      ]);
      setMaterials(materialsData || []);
      setBlocks(blocksData || []);
    } catch {
      setBlocks([
        { id: "b1", title: "Знакомство с Go", sort_order: 1, is_active: true },
        { id: "b2", title: "Структуры данных", sort_order: 2, is_active: true },
      ]);
      setMaterials([
        {
          id: "m1",
          block_id: "b1",
          title: "Введение в Go",
          type: "theory",
          content_type: "url",
          url: "https://go.dev",
          is_required: true,
          is_active: true,
          sort_order: 1,
        },
        {
          id: "m2",
          block_id: "b1",
          title: "Написать калькулятор",
          type: "practice",
          content_type: "text",
          is_required: true,
          is_active: true,
          sort_order: 2,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMaterial = async () => {
    if (!title || !selectedBlockId) {
      toast.error("Название и блок обязательны!");
      return;
    }
    try {
      await api.post("/api/admin/roadmap/materials", {
        block_id: selectedBlockId,
        title,
        description: description || undefined,
        type: materialType,
        content_type: "url",
        url: url || undefined,
        is_required: isRequired,
        is_active: true,
        sort_order: parseInt(sortOrder) || 1,
      });
      toast.success("Материал добавлен");
      setTitle("");
      setDescription("");
      setUrl("");
      setSortOrder("1");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Ошибка");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/admin/roadmap/materials/${id}/status`, {
        is_active: !currentStatus,
      });
      toast.success("Статус изменён");
      loadData();
    } catch {
      toast.error("Ошибка");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "theory":
        return "primary";
      case "practice":
        return "success";
      case "questions":
        return "warning";
      case "homework":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading)
    return <div className="text-center py-8">Загрузка материалов...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold text-text-main">
          Управление материалами
        </h2>
        <p className="text-sm text-text-muted mt-1">
          Добавление карточек теории, практики, вопросов, домашки
        </p>
      </div>

      <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
        <CardBody className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2">
            <Icon icon="lucide:file-plus-2" /> Новый материал
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              size="sm"
              label="Название"
              variant="bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Select
              size="sm"
              label="Блок"
              variant="bordered"
              onChange={(e) => setSelectedBlockId(e.target.value)}
            >
              {blocks.map((b) => (
                <SelectItem key={b.id}>{b.title}</SelectItem>
              ))}
            </Select>
            <Select
              size="sm"
              label="Тип"
              variant="bordered"
              defaultSelectedKeys={["theory"]}
              onChange={(e) => setMaterialType(e.target.value as any)}
            >
              <SelectItem key="theory">Теория</SelectItem>
              <SelectItem key="questions">Вопросы</SelectItem>
              <SelectItem key="practice">Практика</SelectItem>
              <SelectItem key="homework">Домашка</SelectItem>
            </Select>
            <Input
              size="sm"
              label="URL"
              variant="bordered"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pt-2">
            <Input
              size="sm"
              type="number"
              label="Порядок"
              variant="bordered"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            <div className="flex items-center gap-2 bg-canvas/50 p-2 rounded-lg border border-border-subtle justify-between px-4">
              <span className="text-sm text-text-muted">Обязательный:</span>
              <Switch
                size="sm"
                color="danger"
                isSelected={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
              />
            </div>
            <Button
              size="sm"
              color="secondary"
              className="font-medium text-xs"
              onClick={handleCreateMaterial}
            >
              Добавить материал
            </Button>
          </div>
        </CardBody>
      </Card>

      <Table aria-label="Материалы">
        <TableHeader>
          <TableColumn>Блок</TableColumn>
          <TableColumn>Порядок</TableColumn>
          <TableColumn>Название</TableColumn>
          <TableColumn>Тип</TableColumn>
          <TableColumn>Обязательный</TableColumn>
          <TableColumn align="end">Активен</TableColumn>
        </TableHeader>
        <TableBody>
          {materials.map((mat) => {
            const parentBlock = blocks.find((b) => b.id === mat.block_id);
            return (
              <TableRow
                key={mat.id}
                className="border-b border-border-subtle/40 last:border-none"
              >
                <TableCell className="text-sm text-brand-purple font-medium">
                  {parentBlock ? parentBlock.title : "—"}
                </TableCell>
                <TableCell className="text-sm">#{mat.sort_order}</TableCell>
                <TableCell className="text-sm font-medium">
                  {mat.url ? (
                    <a
                      href={mat.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      {mat.title}{" "}
                      <Icon icon="lucide:external-link" className="w-3 h-3" />
                    </a>
                  ) : (
                    mat.title
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color={getTypeColor(mat.type)}
                    variant="flat"
                    className="text-[10px] uppercase font-medium"
                  >
                    {mat.type}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="dot"
                    color={mat.is_required ? "danger" : "default"}
                    className="text-[10px] font-medium"
                  >
                    {mat.is_required ? "Да" : "Нет"}
                  </Chip>
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    size="sm"
                    color="secondary"
                    isSelected={mat.is_active}
                    onChange={() => handleToggleActive(mat.id, mat.is_active)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
