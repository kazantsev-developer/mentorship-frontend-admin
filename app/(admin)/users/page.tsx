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
  Chip,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { User } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [tgUsername, setTgUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "student" | "buddy" | "admin"
  >("student");

  const loadUsers = async () => {
    try {
      const data = await api.get<User[]>("/api/admin/users");
      setUsers(data || []);
    } catch (err) {
      toast.error("Не удалось загрузить пользователей");
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
      toast.error("Поля Логин, Пароль и Отображаемое имя обязательны!");
      return;
    }
    try {
      await api.post("/api/admin/users", {
        login,
        password,
        display_name: displayName,
        telegram_username: tgUsername || undefined,
        roles: [selectedRole],
        learning_started_at:
          selectedRole === "student" ? new Date().toISOString() : undefined,
      });
      toast.success("Пользователь добавлен");
      setLogin("");
      setPassword("");
      setDisplayName("");
      setTgUsername("");
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Ошибка создания");
    }
  };

  const handleSoftDelete = async (id: string) => {
    try {
      await api.delete(`/api/admin/users/${id}`);
      toast.warning("Пользователь деактивирован");
      loadUsers();
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  if (loading)
    return <div className="text-center py-8">Загрузка пользователей...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="bg-surface border border-border-subtle p-6 rounded-xl space-y-4">
        <h3 className="text-sm font-semibold text-brand-purple flex items-center gap-2">
          <Icon icon="lucide:user-plus" /> Ручное создание аккаунта
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <Input
            size="sm"
            label="Логин"
            variant="bordered"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            size="sm"
            type="password"
            label="Пароль"
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            size="sm"
            label="Отображаемое имя"
            variant="bordered"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            size="sm"
            label="Telegram"
            variant="bordered"
            placeholder="@username"
            value={tgUsername}
            onChange={(e) => setTgUsername(e.target.value)}
          />
          <Select
            size="sm"
            label="Роль"
            variant="bordered"
            defaultSelectedKeys={["student"]}
            onChange={(e) => setSelectedRole(e.target.value as any)}
          >
            <SelectItem key="student">Student</SelectItem>
            <SelectItem key="buddy">Buddy</SelectItem>
            <SelectItem key="admin">Admin</SelectItem>
          </Select>
        </div>
        <Button
          size="sm"
          color="secondary"
          className="font-medium text-xs"
          onClick={handleCreateUser}
        >
          Зарегистрировать
        </Button>
      </div>

      <Table
        aria-label="Таблица пользователей"
        className="bg-surface border border-border-subtle rounded-xl shadow-none"
      >
        <TableHeader>
          <TableColumn>Логин</TableColumn>
          <TableColumn>Имя</TableColumn>
          <TableColumn>Telegram</TableColumn>
          <TableColumn>Роли</TableColumn>
          <TableColumn>Статус</TableColumn>
          <TableColumn align="end">Действия</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow
              key={u.id}
              className="border-b border-border-subtle/40 last:border-none"
            >
              <TableCell className="text-sm">{u.login}</TableCell>
              <TableCell className="text-sm">{u.display_name}</TableCell>
              <TableCell className="text-sm text-brand-purple">
                {u.telegram_username ? (
                  <a
                    href={`https://t.me/${u.telegram_username.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1"
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
                  {u.roles.map((role) => (
                    <Chip
                      key={role}
                      size="sm"
                      color="secondary"
                      variant="flat"
                      className="text-[10px] uppercase font-medium"
                    >
                      {role}
                    </Chip>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  size="sm"
                  color={u.is_deleted ? "danger" : "success"}
                  variant="flat"
                  className="text-[10px] uppercase font-medium"
                >
                  {u.is_deleted ? "Удалён" : "Активен"}
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
                    title="Удалить"
                  >
                    <Icon icon="lucide:user-x" className="w-4 h-4" />
                  </Button>
                ) : (
                  <span className="text-xs text-text-muted italic">
                    Заблокирован
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
