import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/shared/api";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

interface BackendUser {
  id: string;
  login: string;
  display_name: string;
  avatar_url?: string;
  about?: string;
  telegram_username?: string;
  is_profile_private: boolean;
  is_deleted: boolean;
}

/** Administrative page managing platform accounts, role configurations, and account state lifecycles */
export function AdminUsersPage() {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [tgUsername, setTgUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "student" | "buddy" | "admin"
  >("student");
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const data = await api.get<BackendUser[]>("/api/admin/users");
      setUsers(data || []);
    } catch {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!login || !password || !displayName) {
      toast.error("Login, password and display name are required");
      return;
    }
    try {
      await api.post("/api/admin/users", {
        login,
        password,
        display_name: displayName,
        telegram_username: tgUsername || undefined,
        roles: [selectedRole],
      });
      toast.success("User created");
      setLogin("");
      setPassword("");
      setDisplayName("");
      setTgUsername("");
      loadUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to create user");
      }
    }
  };

  const handleSoftDelete = async (id: string) => {
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.warning("User deactivated");
      loadUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="bg-surface border border-border-subtle p-6 rounded-xl space-y-4">
        <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2">
          <Icon icon="lucide:user-plus" /> Create Account
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <Input
            size="sm"
            label="Login"
            variant="bordered"
            value={login}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLogin(e.target.value)
            }
            data-testid="user-login-input"
          />
          <Input
            size="sm"
            type="password"
            label="Password"
            variant="bordered"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            data-testid="user-password-input"
          />
          <Input
            size="sm"
            label="Display Name"
            variant="bordered"
            value={displayName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDisplayName(e.target.value)
            }
            data-testid="user-name-input"
          />
          <Input
            size="sm"
            label="Telegram"
            variant="bordered"
            placeholder="@username"
            value={tgUsername}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTgUsername(e.target.value)
            }
            data-testid="user-telegram-input"
          />
          <Select
            size="sm"
            label="Role"
            variant="bordered"
            defaultSelectedKeys={["student"]}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSelectedRole(e.target.value as "student" | "buddy" | "admin")
            }
            data-testid="user-role-select"
          >
            <SelectItem key="student">Student</SelectItem>
            <SelectItem key="buddy">Buddy</SelectItem>
            <SelectItem key="admin">Admin</SelectItem>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button
            size="sm"
            color="secondary"
            className="font-medium text-xs"
            onClick={handleCreateUser}
            data-testid="user-submit-button"
          >
            Register
          </Button>
        </div>
      </div>

      <Table
        aria-label="Users table"
        className="bg-surface border border-border-subtle rounded-xl shadow-none"
        data-testid="users-table"
      >
        <TableHeader>
          <TableColumn>Login</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Telegram</TableColumn>
          <TableColumn>Roles</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn align="end">Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow
              key={u.id}
              data-testid={`user-row-${u.id}`}
              className="border-b border-border-subtle/40 last:border-none"
            >
              <TableCell className="text-sm font-mono">
                <span
                  className="cursor-pointer hover:text-brand-primary hover:underline"
                  onClick={() => navigate(`/users/${u.id}`)}
                >
                  {u.login}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                <span
                  className="cursor-pointer hover:text-brand-primary hover:underline"
                  onClick={() => navigate(`/users/${u.id}`)}
                >
                  {u.display_name}
                </span>
              </TableCell>
              <TableCell className="text-sm text-brand-purple">
                {u.telegram_username ? (
                  <a
                    href={`https://t.me/${u.telegram_username.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1"
                    data-testid={`user-tg-link-${u.id}`}
                  >
                    <Icon icon="lucide:send" className="w-3 h-3" />{" "}
                    {u.telegram_username}
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <span className="text-xs text-text-muted italic">—</span>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  color={u.is_deleted ? "danger" : "success"}
                  variant="flat"
                  className="text-[10px] uppercase font-medium"
                >
                  {u.is_deleted ? "Deleted" : "Active"}
                </Chip>
              </TableCell>
              <TableCell className="text-right">
                {!u.is_deleted ? (
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    isIconOnly
                    onClick={() => handleSoftDelete(u.id)}
                    title="Delete"
                    data-testid={`user-delete-button-${u.id}`}
                  >
                    <Icon icon="lucide:user-x" className="w-4 h-4" />
                  </Button>
                ) : (
                  <span className="text-xs text-text-muted italic">
                    Blocked
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

export default AdminUsersPage;
