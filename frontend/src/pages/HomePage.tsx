import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { CertificationsSection } from '../components/sections/CertificationsSection';
import { AchievementsSection } from '../components/sections/AchievementsSection';
import { ResumeSection } from '../components/sections/ResumeSection';
import { ContactSection } from '../components/sections/ContactSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <AchievementsSection />
      <CertificationsSection />
      <ResumeSection />
      <ContactSection />
    </>
  );
}
