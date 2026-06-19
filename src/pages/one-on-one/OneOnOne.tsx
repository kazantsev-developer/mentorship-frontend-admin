import { useEffect, useState } from "react";
import { api } from "@/shared/api";
import { OneOnOneRequest } from "@/shared/types";
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
import { toast } from "sonner";

/** Administrative view managing and auditing student 1-on-1 consultation requests and bonus balance operations */
export function AdminOneOnOnePage() {
  const [requests, setRequests] = useState<OneOnOneRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const data = await api.get<OneOnOneRequest[]>("/api/admin/one-on-one");
      setRequests(data || []);
    } catch {
      toast.error("Failed to load requests");
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
      toast.error("Insufficient bonus balance (need 1000)");
      return;
    }
    try {
      await api.post(`/api/admin/one-on-one/${id}/${action}`, {});
      toast.success(
        `Request ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "completed"}`,
      );
      loadRequests();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to process request");
      }
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Table aria-label="1-on-1 Requests" data-testid="one-on-one-table">
        <TableHeader>
          <TableColumn>Student</TableColumn>
          <TableColumn>Bonus</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {requests.map((req) => (
            <TableRow
              key={req.id}
              data-testid={`request-row-${req.id}`}
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
                {req.created_at
                  ? new Date(req.created_at).toLocaleString()
                  : "—"}
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
                      data-testid={`approve-button-${req.id}`}
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
                      data-testid={`reject-button-${req.id}`}
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
                    data-testid={`complete-button-${req.id}`}
                  >
                    Complete
                  </Button>
                )}
                {(req.status === "rejected" || req.status === "completed") && (
                  <span className="text-xs text-text-muted italic">
                    Processed
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

export default AdminOneOnOnePage;
