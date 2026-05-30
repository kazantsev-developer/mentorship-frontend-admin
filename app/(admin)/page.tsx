// app/(admin)/page.tsx

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Автоматический перенос в рабочее пространство аналитики
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-canvas">
      <Spinner
        size="lg"
        color="secondary"
        label="Вход в панель управления..."
        labelColor="secondary"
      />
    </div>
  );
}
