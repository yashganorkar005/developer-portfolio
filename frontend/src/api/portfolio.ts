import apiClient from './client';
import type { ContactFormData, Project, Skill, Experience, Education, Certification, Achievement, SocialLink, Profile } from '../types';

// ── Projects ─────────────────────────────────────────────────
export const projectsApi = {
  getAll: () => apiClient.get<Project[]>('/public/projects'),
  getFeatured: () => apiClient.get<Project[]>('/public/projects/featured'),
  getById: (id: number) => apiClient.get<Project>(`/public/projects/${id}`),
};

// ── Skills ────────────────────────────────────────────────────
export const skillsApi = {
  getAll: () => apiClient.get<Skill[]>('/public/skills'),
  getByCategory: (category: string) =>
    apiClient.get<Skill[]>(`/public/skills?category=${category}`),
};

// ── Experience ────────────────────────────────────────────────
export const experienceApi = {
  getAll: () => apiClient.get<Experience[]>('/public/experience'),
};

// ── Contact ───────────────────────────────────────────────────
export const certificationsApi = {
  getAll: () => apiClient.get<Certification[]>('/public/certifications'),
};

export const achievementsApi = {
  getAll: () => apiClient.get<Achievement[]>('/public/achievements'),
};

export const educationApi = {
  getAll: () => apiClient.get<Education[]>('/public/education'),
};

export const socialLinksApi = {
  getAll: () => apiClient.get<SocialLink[]>('/public/social-links'),
};

export const profileApi = {
  get: () => apiClient.get<Profile>('/public/profile'),
};

export const siteInfoApi = {
  get: () => apiClient.get('/public/site-info'),
};

export const contactApi = {
  send: (data: ContactFormData) => apiClient.post('/public/contact', data),
};
