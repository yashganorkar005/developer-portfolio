import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import {
  OverviewPage,
  ProjectsPage,
  SkillsPage,
  CertificationsPage,
  EducationPage,
  ExperiencePage,
  AchievementsPage,
  SocialLinksPage,
  ProfilePage,
  ContactMessagesPage,
  ResumePage,
} from './pages/admin/AdminPages';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public site */}
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin auth */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin dashboard (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="certifications" element={<CertificationsPage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="social-links" element={<SocialLinksPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="contact" element={<ContactMessagesPage />} />
            <Route path="resume" element={<ResumePage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
