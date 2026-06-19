"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

/** Root administrative page handling immediate client-side redirection to the core analytics workspace */
export function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
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

export default AdminRootPage;
