import { useEffect, useState, ChangeEvent } from "react";
import { api } from "@/shared/api";
import { RoadmapBlock } from "@/shared/types";
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

/** Administrative page managing educational roadmap blocks, structural sorting configurations, and visibility toggles */
export function AdminRoadmapBlocksPage() {
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
      toast.error("Failed to load blocks");
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
      toast.error("Block title is required");
      return;
    }
    try {
      await api.post("/api/admin/blocks", {
        title,
        description: description || undefined,
        sort_order: parseInt(sortOrder, 10) || 1,
        is_active: true,
      });
      toast.success("Block created");
      setTitle("");
      setDescription("");
      setSortOrder("1");
      loadBlocks();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to create block");
      }
    }
  };

  const toggleBlockStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/admin/blocks/${id}`, { is_active: !currentStatus });
      toast.success("Status changed");
      loadBlocks();
    } catch {
      toast.error("Failed to change status");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading blocks...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
        <CardBody className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2">
            <Icon icon="lucide:folder-plus" /> New Block
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              size="sm"
              label="Title"
              variant="bordered"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              data-testid="block-title-input"
            />
            <Input
              size="sm"
              label="Description"
              variant="bordered"
              value={description}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
              data-testid="block-desc-input"
            />
            <Input
              size="sm"
              type="number"
              label="Order"
              variant="bordered"
              value={sortOrder}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSortOrder(e.target.value)
              }
              data-testid="block-sort-input"
            />
          </div>
          <div className="flex justify-end">
            <Button
              size="sm"
              color="secondary"
              className="font-medium text-xs"
              onClick={handleCreateBlock}
              data-testid="block-submit-button"
            >
              Create Block
            </Button>
          </div>
        </CardBody>
      </Card>

      <Table aria-label="Blocks" data-testid="blocks-table">
        <TableHeader>
          <TableColumn>Order</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn align="end">Active</TableColumn>
        </TableHeader>
        <TableBody>
          {[...blocks]
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((block) => (
              <TableRow
                key={block.id}
                data-testid={`block-row-${block.id}`}
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
                    data-testid={`block-status-switch-${block.id}`}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminRoadmapBlocksPage;
