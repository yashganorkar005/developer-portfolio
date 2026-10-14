-- ─────────────────────────────────────────────────────────────
-- V2: Seed data — clearly-labelled sample content.
-- Replace all [PLACEHOLDER] values with real data.
-- ─────────────────────────────────────────────────────────────

-- Profile (single row)
INSERT INTO profile (name, tagline, bio, email, location, is_available, created_at, updated_at)
VALUES (
    '[Your Full Name]',
    'Full-Stack Developer — React · TypeScript · Java Spring Boot',
    'I am a software developer with a focus on building reliable backend systems and clean, responsive frontends. I care about code quality, developer experience, and shipping software that solves real problems.',
    'hello@example.com',
    '[Your City, Country]',
    1,
    NOW(6), NOW(6)
);

-- Social links
INSERT INTO social_links (platform, url, icon_name, sort_order, published, created_at, updated_at) VALUES
('GitHub',   'https://github.com/[username]',         'github',   1, 1, NOW(6), NOW(6)),
('LinkedIn', 'https://linkedin.com/in/[username]',    'linkedin', 2, 1, NOW(6), NOW(6)),
('Twitter',  'https://twitter.com/[username]',        'twitter',  3, 1, NOW(6), NOW(6));

-- Skills
INSERT INTO skills (name, category, proficiency, sort_order, published, created_at, updated_at) VALUES
('React',          'Frontend', 90, 1, 1, NOW(6), NOW(6)),
('TypeScript',     'Frontend', 88, 2, 1, NOW(6), NOW(6)),
('Tailwind CSS',   'Frontend', 85, 3, 1, NOW(6), NOW(6)),
('Java',           'Backend',  88, 1, 1, NOW(6), NOW(6)),
('Spring Boot',    'Backend',  85, 2, 1, NOW(6), NOW(6)),
('REST APIs',      'Backend',  90, 3, 1, NOW(6), NOW(6)),
('MySQL',          'Database', 82, 1, 1, NOW(6), NOW(6)),
('Hibernate/JPA',  'Database', 80, 2, 1, NOW(6), NOW(6)),
('Docker',         'DevOps',   70, 1, 1, NOW(6), NOW(6)),
('Git',            'DevOps',   88, 2, 1, NOW(6), NOW(6));

-- Projects
INSERT INTO projects (title, description, category, tech_stack, featured, published, sort_order, created_at, updated_at) VALUES
(
    '[Project Name 1]',
    'Replace this with a real description of your project, what it does, and the problems it solves.',
    'Full-Stack',
    'React,TypeScript,Spring Boot,MySQL',
    1, 1, 1, NOW(6), NOW(6)
),
(
    '[Project Name 2]',
    'Replace this with a real description of your second project.',
    'Backend',
    'Java,Spring Boot,PostgreSQL,Docker',
    1, 1, 2, NOW(6), NOW(6)
),
(
    'Developer Portfolio',
    'This portfolio site, built with React, TypeScript, Three.js, and Java Spring Boot.',
    'Full-Stack',
    'React,Three.js,TypeScript,Spring Boot,Framer Motion',
    1, 1, 3, NOW(6), NOW(6)
);

-- Experience
INSERT INTO experience (company, role, start_date, current_role, description, tech_stack, sort_order, published, created_at, updated_at) VALUES
(
    '[Company Name]',
    'Full-Stack Developer',
    '2023-06-01',
    1,
    'Replace with your actual job description and key achievements.',
    'React,TypeScript,Spring Boot,MySQL',
    1, 1, NOW(6), NOW(6)
),
(
    '[Previous Company]',
    'Junior Software Developer',
    '2022-01-01',
    0,
    'Replace with your actual job description.',
    'React,Java,PostgreSQL',
    2, 1, NOW(6), NOW(6)
);

-- Education
INSERT INTO education (institution, degree, field, start_date, end_date, description, sort_order, published, created_at, updated_at) VALUES
(
    '[University Name]',
    'Bachelor of Science',
    'Computer Science',
    '2018-09-01',
    '2022-06-01',
    'Replace with your actual course and final-year project details.',
    1, 1, NOW(6), NOW(6)
);

-- Certifications
INSERT INTO certifications (name, issuer, issue_date, sort_order, published, created_at, updated_at) VALUES
('[Certification Name]',     '[Issuing Body]',          '2023-09-01', 1, 1, NOW(6), NOW(6)),
('[Another Certification]',  '[Another Issuing Body]',  '2024-03-01', 2, 1, NOW(6), NOW(6));

-- Achievements
INSERT INTO achievements (title, description, date, sort_order, published, created_at, updated_at) VALUES
('[Achievement Title]', 'Replace with a real achievement — e.g. open-source contribution, hackathon result, or publication.', '2024-01', 1, 1, NOW(6), NOW(6));
