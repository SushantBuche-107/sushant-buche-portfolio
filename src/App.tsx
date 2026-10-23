import { MotionConfig } from "framer-motion";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageLoader } from "@/components/layout/PageLoader";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

const AboutPage = lazy(() => import("@/pages/AboutPage"));
const SkillsPage = lazy(() => import("@/pages/SkillsPage"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("@/pages/ProjectDetailPage"));
const ExperiencePage = lazy(() => import("@/pages/ExperiencePage"));
const ResumePage = lazy(() => import("@/pages/ResumePage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const ArticlePage = lazy(() => import("@/pages/ArticlePage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

export function AppFrame(): React.ReactElement {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <SkipLink />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<ArticlePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  );
}

export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <AppFrame />
    </BrowserRouter>
  );
}
