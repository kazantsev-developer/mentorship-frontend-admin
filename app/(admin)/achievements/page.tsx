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
  Chip,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Achievement } from "@/types";

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bonus, setBonus] = useState("100");
  const [imgUrl, setImgUrl] = useState("mdi:star");

  const loadAchievements = async () => {
    try {
      const data = await api.get<Achievement[]>("/api/admin/achievements");
      setAchievements(data || []);
    } catch {
      toast.error("Не удалось загрузить достижения");
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleCreate = async () => {
    if (!title || !description || !bonus) {
      toast.error("Заполните поля");
      return;
    }
    try {
      await api.post("/api/admin/achievements", {
        title,
        description,
        reward_bonus: parseInt(bonus),
        image_url: imgUrl,
        condition_type: "manual_trigger",
        is_active: true,
        sort_order: achievements.length + 1,
      });
      toast.success("Достижение добавлено");
      setTitle("");
      setDescription("");
      setBonus("100");
      setImgUrl("mdi:star");
      loadAchievements();
    } catch (err: any) {
      toast.error(err.message || "Ошибка");
    }
  };

  if (loading)
    return <div className="text-center py-8">Загрузка достижений...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
        <CardBody className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2">
            <Icon icon="lucide:sparkles" /> Новое достижение
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
              label="Награда (бонусы)"
              variant="bordered"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
            />
            <div className="flex gap-2 items-end">
              <Input
                size="sm"
                label="Иконка (Iconify ID)"
                variant="bordered"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
              />
              <div className="p-2 rounded-lg bg-default-100">
                <Icon icon={imgUrl} className="w-6 h-6" />
              </div>
            </div>
          </div>
          <Button
            size="sm"
            color="secondary"
            className="font-medium text-xs"
            onClick={handleCreate}
          >
            Добавить достижение
          </Button>
        </CardBody>
      </Card>

      <Table aria-label="Достижения">
        <TableHeader>
          <TableColumn>Иконка</TableColumn>
          <TableColumn>Название</TableColumn>
          <TableColumn>Условие</TableColumn>
          <TableColumn>Награда</TableColumn>
          <TableColumn align="end">Активно</TableColumn>
        </TableHeader>
        <TableBody>
          {achievements.map((ach) => (
            <TableRow
              key={ach.id}
              className="border-b border-border-subtle/40 last:border-none"
            >
              <TableCell>
                <div
                  className={`p-2 rounded-full w-fit ${ach.is_active ? "bg-brand-purple/10 text-brand-purple" : "bg-canvas text-text-muted"}`}
                >
                  <Icon icon={ach.image_url} className="w-5 h-5" />
                </div>
              </TableCell>
              <TableCell className="text-sm font-medium">{ach.title}</TableCell>
              <TableCell className="text-sm text-text-muted">
                {ach.description}
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color="secondary"
                  className="font-medium text-xs"
                >
                  +{ach.reward_bonus} XP
                </Chip>
              </TableCell>
              <TableCell className="text-right">
                <Chip
                  size="sm"
                  variant="flat"
                  color={ach.is_active ? "success" : "default"}
                  className="text-[10px] uppercase font-medium"
                >
                  {ach.is_active ? "Активно" : "Откл."}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
