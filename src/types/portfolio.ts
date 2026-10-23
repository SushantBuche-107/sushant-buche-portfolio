export type PublishStatus = "published" | "draft";
export type SkillFocus = "core" | "working" | "exploring";
export type ContactMode = "none" | "mailto" | "endpoint";

export interface SiteConfig {
  title: string;
  shortTitle: string;
  domain: string;
  defaultDescription: string;
  defaultOgImage: string;
  locale: string;
  themeColor: string;
  keywords: string[];
  heroTechnologies: string[];
  showLastUpdated: boolean;
  contentUpdatedAt: string;
}

export interface Availability {
  show: boolean;
  label: string;
  detail?: string;
}

export type SocialKey =
  | "github"
  | "linkedin"
  | "naukri"
  | "leetcode"
  | "twitter"
  | "website"
  | "email";

export type SocialLinks = Partial<Record<SocialKey, string>>;

export interface PersonalProfile {
  name: string;
  title: string;
  altTitle: string;
  tagline: string;
  shortBio: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  initials: string;
  profileImage: string;
  resumeUrl: string;
  availability: Availability;
  socials: SocialLinks;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  detail?: string;
}

export type HighlightTone = "accent" | "success" | "warning" | "neutral";

export interface Highlight {
  id: string;
  label: string;
  show: boolean;
  tone: HighlightTone;
}

export interface SkillItem {
  name: string;
  description?: string;
  focus?: SkillFocus;
  relatedProjects?: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  items: SkillItem[];
}

export interface ProjectLinkSet {
  live?: string;
  github?: string;
  caseStudy?: boolean;
}

export interface ProjectDecision {
  title: string;
  detail: string;
}

export interface ProjectChallenge {
  title: string;
  detail: string;
}

export interface ProjectGalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  role: string;
  timeline: string;
  categories: string[];
  technologies: string[];
  featured: boolean;
  status: PublishStatus;
  coverImage?: string;
  coverAlt?: string;
  links: ProjectLinkSet;
  problem?: string;
  goals?: string[];
  constraints?: string[];
  contribution?: string[];
  architecture?: string;
  architectureImage?: string;
  architectureImageAlt?: string;
  dataFlow?: string[];
  apiDesign?: string[];
  databaseDesign?: string[];
  decisions?: ProjectDecision[];
  security?: string[];
  performance?: string[];
  challenges?: ProjectChallenge[];
  tradeoffs?: string[];
  testing?: string[];
  results?: string[];
  lessons?: string[];
  relatedSlugs?: string[];
  gallery?: ProjectGalleryItem[];
  codeSnippets?: CodeSnippet[];
}

export interface ExperienceRecord {
  id: string;
  employer: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  arrangement?: string;
  location?: string;
  summary: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: string[];
  relatedProjects?: string[];
}

export interface EducationRecord {
  id: string;
  qualification: string;
  institution: string;
  year?: string;
  grade?: string;
  location?: string;
}

export interface CertificationRecord {
  id: string;
  name: string;
  issuer: string;
  year?: string;
  credentialUrl?: string;
  credentialId?: string;
  image?: string;
  imageAlt?: string;
}

export interface ResumeVariant {
  id: string;
  label: string;
  url: string;
  description?: string;
  isDefault?: boolean;
  updatedAt?: string;
}

export interface Article {
  slug: string;
  title: string;
  summary: string;
  body: string;
  publicationDate: string;
  tags: string[];
  coverImage?: string;
  coverAlt?: string;
  published: boolean;
  readingTimeMinutes?: number;
}

export interface ContactConfig {
  enabled: boolean;
  showEmail: boolean;
  showPhone: boolean;
  mode: ContactMode;
  endpoint: string;
  bookingUrl: string;
  formIntro: string;
  notice: string;
  successMessage: string;
  privacyNote: string;
  responseNote?: string;
}

export interface NavigationItem {
  label: string;
  to: string;
  show: boolean;
}

export interface FooterConfig {
  copyrightName: string;
  showBackToTop: boolean;
  privacyUrl?: string;
  note?: string;
}

export interface AboutContent {
  intro: string;
  journey: string[];
  philosophy: string[];
  approach: ProjectDecision[];
  domains: ProjectDecision[];
  interests: string[];
  learning: string[];
  principles: ProjectDecision[];
}

export interface ResumeConfig {
  printEnabled: boolean;
  downloadNote: string;
  summary: string;
}

export interface PortfolioData {
  site: SiteConfig;
  personal: PersonalProfile;
  metrics: Metric[];
  highlights: Highlight[];
  skills: SkillCategory[];
  projects: Project[];
  experience: ExperienceRecord[];
  education: EducationRecord[];
  certifications: CertificationRecord[];
  resumes: ResumeVariant[];
  resume: ResumeConfig;
  articles: Article[];
  contact: ContactConfig;
  navigation: NavigationItem[];
  footer: FooterConfig;
  about: AboutContent;
}
