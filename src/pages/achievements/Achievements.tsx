import { useEffect, useState, ChangeEvent } from "react";
import { api } from "@/shared/api";
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
import { Achievement } from "@/shared/types";

const WORKING_ICONS = [
  { id: "mdi:star", name: "Star (MDI)" },
  { id: "mdi:star-outline", name: "Star Outline" },
  { id: "material-symbols:star", name: "Star (Material)" },
  { id: "ic:baseline-star", name: "Star (Google)" },
  { id: "fa6-solid:star", name: "Star (FA6)" },
  { id: "ph:star-fill", name: "Star (Phosphor)" },
];

/** Administrative page managing custom gamification milestones and unlockable achievements */
export function AdminAchievementsPage() {
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
      toast.error("Failed to load achievements");
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
      toast.error("All fields are required");
      return;
    }
    try {
      await api.post("/api/admin/achievements", {
        title,
        description,
        reward_bonus: parseInt(bonus, 10),
        image_url: imgUrl,
        condition_type: "manual_trigger",
        is_active: true,
        sort_order: achievements.length + 1,
      });
      toast.success("Achievement added");
      setTitle("");
      setDescription("");
      setBonus("100");
      setImgUrl("mdi:star");
      loadAchievements();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to add achievement");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading achievements...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
        <CardBody className="p-6">
          <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2 mb-4">
            <Icon icon="mdi:star" className="w-4 h-4 text-brand-purple" />
            New Achievement
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              size="sm"
              label="Title"
              variant="bordered"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              data-testid="achievement-title-input"
            />
            <Input
              size="sm"
              label="Description"
              variant="bordered"
              value={description}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              data-testid="achievement-desc-input"
            />
            <Input
              size="sm"
              type="number"
              label="Reward (bonus)"
              variant="bordered"
              value={bonus}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setBonus(e.target.value)
              }
              data-testid="achievement-bonus-input"
            />
            <div className="flex gap-2 items-end">
              <Select
                size="sm"
                label="Icon"
                variant="bordered"
                selectedKeys={[imgUrl]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  if (selected) setImgUrl(selected);
                }}
                data-testid="achievement-icon-select"
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
            <Button
              size="sm"
              color="secondary"
              className="font-medium text-xs"
              onClick={handleCreate}
              data-testid="achievement-submit-button"
            >
              Add Achievement
            </Button>
          </div>
        </CardBody>
      </Card>

      <Table aria-label="Achievements" data-testid="achievements-table">
        <TableHeader>
          <TableColumn>Icon</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Condition</TableColumn>
          <TableColumn>Reward</TableColumn>
          <TableColumn align="end">Active</TableColumn>
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
                  {ach.is_active ? "Active" : "Off"}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminAchievementsPage;
