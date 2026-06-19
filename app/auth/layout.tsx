import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

/** Authentication layout wrapper providing structural layout boundaries and unified canvas styling */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] to-[#f3f4f6] flex items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
