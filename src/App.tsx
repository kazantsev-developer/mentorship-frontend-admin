import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminLayout } from "./pages/roadmap/layout";
import { AdminLoginPage } from "./pages/login/Login";
import { AdminDashboardPage } from "./pages/dashboard/Dashboard";
import { AdminUsersPage } from "./pages/users/Users";
import { AdminUserProfilePage } from "./pages/users/UserProfile";
import { AdminRoadmapBlocksPage } from "./pages/roadmap/RoadmapBlocks";
import { AdminRoadmapMaterialsPage } from "./pages/roadmap/RoadmapMaterials";
import { AdminAchievementsPage } from "./pages/achievements/Achievements";
import { AdminOneOnOnePage } from "./pages/one-on-one/OneOnOne";

/** Core application routing configuration and workspace layer boundary mapping */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />

        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/users" element={<AdminUsersPage />} />
          <Route path="/users/:id" element={<AdminUserProfilePage />} />
          <Route path="/roadmap/blocks" element={<AdminRoadmapBlocksPage />} />
          <Route
            path="/roadmap/materials"
            element={<AdminRoadmapMaterialsPage />}
          />
          <Route path="/achievements" element={<AdminAchievementsPage />} />
          <Route path="/one-on-one" element={<AdminOneOnOnePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
