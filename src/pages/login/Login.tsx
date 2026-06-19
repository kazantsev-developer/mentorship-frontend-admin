import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { api } from "@/shared/api";

interface LoginResponse {
  token: string;
  roles: string[];
}

/** Identity authentication gateway view for administrative access */
export function AdminLoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<LoginResponse>("/api/auth/login", {
        login,
        password,
      });

      document.cookie = `token=${res.token}; path=/; max-age=604800; SameSite=Lax`;
      localStorage.setItem("token", res.token);

      if (!res.roles.includes("admin")) {
        setError("You do not have admin permissions");
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid login or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eff6ff] to-[#f3f4f6]">
      <div className="flex w-full max-w-sm flex-col gap-4 pb-20 rounded-large">
        <div className="flex flex-col items-center pb-2">
          <p className="text-6xl flex font-bold text-inherit">Go Admin</p>
          <p className="text-xl font-medium">Control Panel</p>
          <p className="text-small text-default-500">
            Sign in to admin account
          </p>
        </div>

        {error && (
          <div
            className="text-center text-danger text-sm"
            data-testid="login-error"
          >
            {error}
          </div>
        )}

        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit}
          data-testid="login-form"
        >
          <Input
            isRequired
            label="Login"
            name="login"
            placeholder="Enter login"
            variant="bordered"
            value={login}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLogin(e.target.value)
            }
            data-testid="login-input"
          />
          <Input
            isRequired
            label="Password"
            name="password"
            placeholder="Enter password"
            variant="bordered"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            data-testid="password-input"
            endContent={
              <button
                type="button"
                onClick={toggleVisibility}
                data-testid="password-toggle"
              >
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
            className="w-full bg-blue-600 text-white"
            type="submit"
            isLoading={loading}
            data-testid="login-submit"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
