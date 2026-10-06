export const siteConfig = {
  name: "Zeinab",
  title: "Zeinab — Full-stack developer",
  description:
    "Notes, essays, and deep-dives on full-stack development by Zeinab.",
  url: "https://your-domain.com", // update this later
  author: {
    name: "Zeinab",
    role: "Full-stack Developer",
    bio: "I build web applications end-to-end and write about what I learn along the way.",
    avatar: "/my-avatar.jpg", // put a photo in public/avatar.jpg
    email: "you@example.com",
    github: "https://github.com/your-username",
    linkedin: "https://linkedin.com/in/your-username",
    location: "Remote",
  },
  giscus: {
    repo: "zeinabsayyadi/coding-with-zeinab" as `${string}/${string}`,
    repoId: "R_kgDOU99nSA",
    category: "comments",
    categoryId: "DIC_kwDOU99nSM4DHMTz",
  },
} as const;
