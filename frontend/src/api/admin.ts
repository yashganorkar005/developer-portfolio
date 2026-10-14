import axios from 'axios';
import type {
  ProjectDto,
  SkillDto,
  CertificationDto,
  EducationDto,
  ExperienceDto,
  AchievementDto,
  SocialLinkDto,
  ContactMessageDto,
  ContactMessageRequest,
  ProfileDto,
} from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const adminClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// Attach bearer token from session storage
adminClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Profile ────────────────────────────────────────────
export const profileApi = {
  get: () => adminClient.get<ProfileDto>('/admin/profile').then((r) => r.data),
  update: (data: Partial<ProfileDto>) =>
    adminClient.put<ProfileDto>('/admin/profile', data).then((r) => r.data),
};

// ── Projects ────────────────────────────────────────────
export const projectsApi = {
  getAll: () => adminClient.get<ProjectDto[]>('/admin/projects').then((r) => r.data),
  create: (data: Partial<ProjectDto>) =>
    adminClient.post<ProjectDto>('/admin/projects', data).then((r) => r.data),
  update: (id: number, data: Partial<ProjectDto>) =>
    adminClient.put<ProjectDto>(`/admin/projects/${id}`, data).then((r) => r.data),
  delete: (id: number) => adminClient.delete(`/admin/projects/${id}`),
};

// ── Skills ──────────────────────────────────────────────
export const skillsApi = {
  getAll: () => adminClient.get<SkillDto[]>('/admin/skills').then((r) => r.data),
  create: (data: Partial<SkillDto>) =>
    adminClient.post<SkillDto>('/admin/skills', data).then((r) => r.data),
  update: (id: number, data: Partial<SkillDto>) =>
    adminClient.put<SkillDto>(`/admin/skills/${id}`, data).then((r) => r.data),
  delete: (id: number) => adminClient.delete(`/admin/skills/${id}`),
};

// ── Certifications ──────────────────────────────────────
export const certificationsApi = {
  getAll: () => adminClient.get<CertificationDto[]>('/admin/certifications').then((r) => r.data),
  create: (data: Partial<CertificationDto>) =>
    adminClient.post<CertificationDto>('/admin/certifications', data).then((r) => r.data),
  update: (id: number, data: Partial<CertificationDto>) =>
    adminClient.put<CertificationDto>(`/admin/certifications/${id}`, data).then((r) => r.data),
  delete: (id: number) => adminClient.delete(`/admin/certifications/${id}`),
};

// ── Education ───────────────────────────────────────────
export const educationApi = {
  getAll: () => adminClient.get<EducationDto[]>('/admin/education').then((r) => r.data),
  create: (data: Partial<EducationDto>) =>
    adminClient.post<EducationDto>('/admin/education', data).then((r) => r.data),
  update: (id: number, data: Partial<EducationDto>) =>
    adminClient.put<EducationDto>(`/admin/education/${id}`, data).then((r) => r.data),
  delete: (id: number) => adminClient.delete(`/admin/education/${id}`),
};

// ── Experience ──────────────────────────────────────────
export const experienceApi = {
  getAll: () => adminClient.get<ExperienceDto[]>('/admin/experience').then((r) => r.data),
  create: (data: Partial<ExperienceDto>) =>
    adminClient.post<ExperienceDto>('/admin/experience', data).then((r) => r.data),
  update: (id: number, data: Partial<ExperienceDto>) =>
    adminClient.put<ExperienceDto>(`/admin/experience/${id}`, data).then((r) => r.data),
  delete: (id: number) => adminClient.delete(`/admin/experience/${id}`),
};

// ── Achievements ────────────────────────────────────────
export const achievementsApi = {
  getAll: () => adminClient.get<AchievementDto[]>('/admin/achievements').then((r) => r.data),
  create: (data: Partial<AchievementDto>) =>
    adminClient.post<AchievementDto>('/admin/achievements', data).then((r) => r.data),
  update: (id: number, data: Partial<AchievementDto>) =>
    adminClient.put<AchievementDto>(`/admin/achievements/${id}`, data).then((r) => r.data),
  delete: (id: number) => adminClient.delete(`/admin/achievements/${id}`),
};

// ── Social Links ────────────────────────────────────────
export const socialLinksApi = {
  getAll: () => adminClient.get<SocialLinkDto[]>('/admin/social-links').then((r) => r.data),
  create: (data: Partial<SocialLinkDto>) =>
    adminClient.post<SocialLinkDto>('/admin/social-links', data).then((r) => r.data),
  update: (id: number, data: Partial<SocialLinkDto>) =>
    adminClient.put<SocialLinkDto>(`/admin/social-links/${id}`, data).then((r) => r.data),
  delete: (id: number) => adminClient.delete(`/admin/social-links/${id}`),
};

// ── Contact Messages ────────────────────────────────────
export const contactMessagesApi = {
  getAll: () => adminClient.get<ContactMessageDto[]>('/admin/contact-messages').then((r) => r.data),
  update: (id: number, data: Partial<ContactMessageDto>) =>
    adminClient.put<ContactMessageDto>(`/admin/contact-messages/${id}`, data).then((r) => r.data),
  delete: (id: number) => adminClient.delete(`/admin/contact-messages/${id}`),
};

// ── Contact form submission (public) ────────────────────
export const submitContact = async (data: ContactMessageRequest) => {
  const response = await fetch(`${API_BASE_URL}/public/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? 'Failed to send message');
  }
  return response.text();
};

// ── Reorder (Task 2) ────────────────────────────────────
export const reorderApi = {
  update: (entityType: 'projects' | 'certifications' | 'achievements' | 'education' | 'experience' | 'skills' | 'social-links', id: number, newOrder: number) =>
    adminClient.put(`/admin/reorder/${entityType}/${id}?newOrder=${newOrder}`),
};

// ── Skill Category Orders ───────────────────────────────
export interface SkillCategoryOrderDto {
  category: string;
  sortOrder: number;
}

export const skillCategoryOrdersApi = {
  getAll: () => adminClient.get<SkillCategoryOrderDto[]>('/admin/skill-category-orders').then((r) => r.data),
  update: (category: string, newOrder: number) =>
    adminClient.put(`/admin/skill-category-orders/${encodeURIComponent(category)}?newOrder=${newOrder}`),
};

// ── Resume ──────────────────────────────────────────────
export const resumeApi = {
  get: () => adminClient.get<{ filename: string; size: number; url: string }>('/admin/resume').then((r) => r.data),
  upload: (formData: FormData) => adminClient.post<string>('/admin/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data),
  delete: () => adminClient.delete<string>('/admin/resume').then((r) => r.data),
};
