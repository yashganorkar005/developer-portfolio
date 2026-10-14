// Application-wide type definitions

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  iconName?: string;
  sortOrder: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  category: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number; // 0–100
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  techStack: string[];
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  date?: string;
  imageUrl?: string;
  sortOrder: number;
  published?: boolean;
}

export interface Profile {
  name: string;
  tagline?: string;
  bio?: string;
  email?: string;
  location?: string;
  avatarUrl?: string;
  heroHeadline?: string;
  resumeUrl?: string;
  available?: boolean;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  imageUrl?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
