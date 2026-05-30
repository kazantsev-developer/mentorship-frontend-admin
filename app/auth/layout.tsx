export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] to-[#f3f4f6] flex items-center justify-center">
      {children}
    </div>
  );
}
