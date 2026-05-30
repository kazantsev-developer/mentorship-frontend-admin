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
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Achievement } from "@/types";

const WORKING_ICONS = [
  { id: "mdi:star", name: "Звезда (MDI)" },
  { id: "mdi:star-outline", name: "Звезда контур" },
  { id: "material-symbols:star", name: "Звезда (Material)" },
  { id: "ic:baseline-star", name: "Звезда (Google)" },
  { id: "fa6-solid:star", name: "Звезда (FA6)" },
  { id: "ph:star-fill", name: "Звезда (Phosphor)" },
];

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
        <CardBody className="p-6">
          <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2 mb-4">
            <Icon icon="mdi:star" className="w-4 h-4 text-brand-purple" />
            Новое достижение
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Select
                size="sm"
                label="Иконка"
                variant="bordered"
                selectedKeys={[imgUrl]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  if (selected) setImgUrl(selected);
                }}
              >
                {WORKING_ICONS.map((icon) => (
                  <SelectItem key={icon.id}>{icon.name}</SelectItem>
                ))}
              </Select>
              <div className="p-2 rounded-lg bg-brand-purple/10 flex items-center justify-center min-w-[40px] h-[38px]">
                <Icon icon={imgUrl} className="w-5 h-5 text-brand-purple" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button size="sm" color="secondary" className="font-medium text-xs">
              Добавить достижение
            </Button>
          </div>
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
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand-purple/10">
                  <Icon
                    icon={ach.image_url}
                    className="w-4 h-4 text-brand-purple"
                  />
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
