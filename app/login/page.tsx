"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { api } from "@/components/api";

export default function AdminLoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ token: string; user: any; roles: string[] }>(
        "/api/auth/login",
        { login, password },
      );
      document.cookie = `token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
      localStorage.setItem("token", res.token);
      if (!res.roles.includes("admin")) {
        setError("У вас нет прав администратора");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eff6ff] to-[#f3f4f6]">
      <div className="flex w-full max-w-sm flex-col gap-4 pb-20 rounded-large">
        <div className="flex flex-col items-center pb-2">
          <p className="text-6xl flex font-bold text-inherit">Go Admin</p>
          <p className="text-xl font-medium">Панель управления</p>
          <p className="text-small text-default-500">
            Войдите в аккаунт администратора
          </p>
        </div>

        {error && (
          <div className="text-center text-danger text-sm">{error}</div>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Логин"
            name="login"
            placeholder="Введите логин"
            variant="bordered"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            isRequired
            label="Пароль"
            name="password"
            placeholder="Введите пароль"
            variant="bordered"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
          />
          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={loading}
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
