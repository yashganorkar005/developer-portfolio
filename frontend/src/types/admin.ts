// Admin DTO types — match the backend records exactly

export interface ProjectDto {
  id: number;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  sortOrder: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillDto {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificationDto {
  id: number;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  imageUrl?: string;
  sortOrder: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EducationDto {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
  currentlyEnrolled: boolean;
  description: string;
  sortOrder: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExperienceDto {
  id: number;
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  currentRole: boolean;
  description: string;
  techStack: string[];
  sortOrder: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AchievementDto {
  id: number;
  title: string;
  description: string;
  date?: string;
  imageUrl?: string;
  sortOrder: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLinkDto {
  id: number;
  platform: string;
  url: string;
  iconName?: string;
  sortOrder: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessageDto {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

export interface ContactMessageUpdateRequest {
  read?: boolean;
}

export interface ContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ProfileDto {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  avatarUrl?: string;
  heroHeadline?: string;
  resumeUrl?: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}