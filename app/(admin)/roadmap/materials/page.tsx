"use client";

import { useEffect, useState, ChangeEvent } from "react";
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

/** Administrative page for managing learning materials inside roadmap blocks */
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
        api.get<RoadmapMaterial[]>("/api/admin/materials"),
        api.get<RoadmapBlock[]>("/api/admin/blocks"),
      ]);
      setMaterials(materialsData || []);
      setBlocks(blocksData || []);
    } catch {
      toast.error("Failed to load data");
      setMaterials([]);
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMaterial = async () => {
    if (!title || !selectedBlockId) {
      toast.error("Title and block are required");
      return;
    }
    try {
      await api.post("/api/admin/materials", {
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
      toast.success("Material added");
      setTitle("");
      setDescription("");
      setUrl("");
      setSortOrder("1");
      loadData();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error creating material";
      toast.error(message);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/api/admin/materials/${id}/status`, {
        is_active: !currentStatus,
      });
      toast.success("Status changed");
      loadData();
    } catch {
      toast.error("Failed to change status");
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
    return <div className="text-center py-8">Loading materials...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
        <CardBody className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2">
            <Icon icon="lucide:file-plus-2" /> New Material
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              size="sm"
              label="Title"
              variant="bordered"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              data-testid="material-title-input"
            />
            <Select
              size="sm"
              label="Block"
              variant="bordered"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedBlockId(e.target.value)
              }
            >
              {blocks.map((b) => (
                <SelectItem key={b.id}>{b.title}</SelectItem>
              ))}
            </Select>
            <Select
              size="sm"
              label="Type"
              variant="bordered"
              defaultSelectedKeys={["theory"]}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setMaterialType(e.target.value as any)
              }
            >
              <SelectItem key="theory">Theory</SelectItem>
              <SelectItem key="questions">Questions</SelectItem>
              <SelectItem key="practice">Practice</SelectItem>
              <SelectItem key="homework">Homework</SelectItem>
            </Select>
            <Input
              size="sm"
              label="URL"
              variant="bordered"
              placeholder="https://..."
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUrl(e.target.value)
              }
              data-testid="material-url-input"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pt-2">
            <Input
              size="sm"
              type="number"
              label="Order"
              variant="bordered"
              value={sortOrder}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSortOrder(e.target.value)
              }
              data-testid="material-sort-input"
            />
            <div className="flex items-center gap-2 bg-canvas/50 p-2 rounded-lg border border-border-subtle justify-between px-4">
              <span className="text-sm text-text-muted">Required:</span>
              <Switch
                size="sm"
                color="danger"
                isSelected={isRequired}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setIsRequired(e.target.checked)
                }
                data-testid="material-required-switch"
              />
            </div>
            <div className="flex justify-end">
              <Button
                size="sm"
                color="secondary"
                className="font-medium text-xs"
                onClick={handleCreateMaterial}
                data-testid="material-submit-button"
              >
                Add Material
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Table aria-label="Materials" data-testid="materials-table">
        <TableHeader>
          <TableColumn>Block</TableColumn>
          <TableColumn>Order</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Required</TableColumn>
          <TableColumn align="end">Active</TableColumn>
        </TableHeader>
        <TableBody>
          {materials.map((mat) => {
            const parentBlock = blocks.find((b) => b.id === mat.block_id);
            return (
              <TableRow
                key={mat.id}
                className="border-b border-border-subtle/40 last:border-none"
                data-testid={`material-row-${mat.id}`}
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
                    {mat.is_required ? "Yes" : "No"}
                  </Chip>
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    size="sm"
                    color="secondary"
                    isSelected={mat.is_active}
                    onChange={() => handleToggleActive(mat.id, mat.is_active)}
                    data-testid={`material-status-switch-${mat.id}`}
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
