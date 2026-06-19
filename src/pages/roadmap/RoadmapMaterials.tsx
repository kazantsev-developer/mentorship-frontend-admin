import { useEffect, useState, ChangeEvent } from "react";
import { api } from "@/shared/api";
import { RoadmapBlock, RoadmapMaterial } from "@/shared/types";
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
  Select,
  SelectItem,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

/** Administrative page managing educational materials, content type mappings, and block assignments */
export function AdminRoadmapMaterialsPage() {
  const [materials, setMaterials] = useState<RoadmapMaterial[]>([]);
  const [blocks, setBlocks] = useState<RoadmapBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBlockId, setSelectedBlockId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<
    "theory" | "questions" | "practice" | "homework"
  >("theory");
  const [contentType, setContentType] = useState<
    "url" | "youtube" | "github" | "article" | "text" | "file"
  >("url");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [isRequired, setIsRequired] = useState(true);
  const [sortOrder, setSortOrder] = useState("1");

  const loadData = async () => {
    try {
      const [materialsData, blocksData] = await Promise.all([
        api.get<RoadmapMaterial[]>("/api/admin/materials"),
        api.get<RoadmapBlock[]>("/api/admin/blocks"),
      ]);
      setMaterials(materialsData || []);
      setBlocks(blocksData || []);
      if (blocksData && blocksData.length > 0) {
        setSelectedBlockId(blocksData[0].id);
      }
    } catch {
      toast.error("Failed to load materials");
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
        type,
        content_type: contentType,
        url: url || undefined,
        content: content || undefined,
        is_required: isRequired,
        is_active: true,
        sort_order: parseInt(sortOrder, 10) || 1,
      });
      toast.success("Material added");
      setTitle("");
      setDescription("");
      setUrl("");
      setContent("");
      setSortOrder("1");
      loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to create material");
      }
    }
  };

  const toggleMaterialStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/admin/materials/${id}`, {
        is_active: !currentStatus,
      });
      toast.success("Status changed");
      loadData();
    } catch {
      toast.error("Failed to change status");
    }
  };

  const getBlockTitle = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    return block ? block.title : "Unknown block";
  };

  const getTypeColor = (mType: string) => {
    switch (mType) {
      case "theory":
        return "primary";
      case "practice":
        return "success";
      case "homework":
        return "secondary";
      case "questions":
        return "warning";
      default:
        return "default";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading materials...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
        <CardBody className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2">
            <Icon icon="lucide:book-plus" /> New Material
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <Select
              size="sm"
              label="Target Block"
              variant="bordered"
              selectedKeys={selectedBlockId ? [selectedBlockId] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) setSelectedBlockId(selected);
              }}
            >
              {blocks.map((b) => (
                <SelectItem key={b.id}>{b.title}</SelectItem>
              ))}
            </Select>

            <Input
              size="sm"
              label="Title"
              variant="bordered"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
            />

            <Input
              size="sm"
              label="Description"
              variant="bordered"
              value={description}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDescription(e.target.value)
              }
            />

            <Input
              size="sm"
              type="number"
              label="Sort Order"
              variant="bordered"
              value={sortOrder}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSortOrder(e.target.value)
              }
            />

            <Select
              size="sm"
              label="Task Type"
              variant="bordered"
              selectedKeys={[type]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as any;
                if (selected) setType(selected);
              }}
            >
              <SelectItem key="theory">Theory</SelectItem>
              <SelectItem key="questions">Questions</SelectItem>
              <SelectItem key="practice">Practice</SelectItem>
              <SelectItem key="homework">Homework</SelectItem>
            </Select>

            <Select
              size="sm"
              label="Content Format"
              variant="bordered"
              selectedKeys={[contentType]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as any;
                if (selected) setContentType(selected);
              }}
            >
              <SelectItem key="url">External Link (URL)</SelectItem>
              <SelectItem key="youtube">YouTube Video</SelectItem>
              <SelectItem key="github">GitHub Repository</SelectItem>
              <SelectItem key="text">Text / Markdown</SelectItem>
            </Select>

            <Input
              size="sm"
              label="Link (URL)"
              variant="bordered"
              placeholder="https://..."
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUrl(e.target.value)
              }
              className="md:col-span-2 lg:col-span-2"
            />
          </div>

          <div className="flex items-center justify-between border-t border-border-subtle/60 pt-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-medium">
                Required:
              </span>
              <Switch
                size="sm"
                color="secondary"
                isSelected={isRequired}
                onValueChange={setIsRequired}
              />
            </div>
            <Button
              size="sm"
              color="secondary"
              className="font-medium text-xs"
              onClick={handleCreateMaterial}
            >
              Add Material
            </Button>
          </div>
        </CardBody>
      </Card>

      <Table aria-label="Materials" data-testid="materials-table">
        <TableHeader>
          <TableColumn>Block</TableColumn>
          <TableColumn>Title</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Format</TableColumn>
          <TableColumn>Req.</TableColumn>
          <TableColumn align="end">Active</TableColumn>
        </TableHeader>
        <TableBody>
          {materials.map((mat) => (
            <TableRow
              key={mat.id}
              data-testid={`material-row-${mat.id}`}
              className="border-b border-border-subtle/40 last:border-none"
            >
              <TableCell className="text-sm font-medium">
                {getBlockTitle(mat.block_id)}
              </TableCell>
              <TableCell className="text-sm font-medium">{mat.title}</TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  variant="flat"
                  color={getTypeColor(mat.type)}
                  className="text-[10px] uppercase font-medium"
                >
                  {mat.type}
                </Chip>
              </TableCell>
              <TableCell className="text-sm text-text-muted font-mono uppercase">
                {mat.content_type}
              </TableCell>
              <TableCell>
                <Icon
                  icon={
                    mat.is_required ? "lucide:check-circle-2" : "lucide:circle"
                  }
                  className={`w-4 h-4 ${mat.is_required ? "text-success" : "text-text-muted/40"}`}
                />
              </TableCell>
              <TableCell className="text-right">
                <Switch
                  size="sm"
                  color="secondary"
                  isSelected={mat.is_active}
                  onChange={() => toggleMaterialStatus(mat.id, mat.is_active)}
                  data-testid={`material-status-switch-${mat.id}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminRoadmapMaterialsPage;
