export const siteConfig = {
  name: "Zeinab",
  title: "Zeinab — Full-stack developer",
  description:
    "Notes, essays, and deep-dives on full-stack development by Zeinab.",
  url: "https://coding-with-zeinab.vercel.app", // update this later
  author: {
    name: "Zeinab",
    role: "Full-stack Developer",
    bio: "I build web applications end-to-end and write about what I learn along the way.",
    avatar: "/my-avatar.jpg", // put a photo in public/avatar.jpg
    email: "zeinab0sayyadi@gmail.com",
    github: "https://github.com/zeinabsayyadi",
    linkedin: "https://linkedin.com/in/zeinab-sayyadi",
    location: "Remote",
  },
  giscus: {
    repo: "zeinabsayyadi/coding-with-zeinab" as `${string}/${string}`,
    repoId: "R_kgDOU99nSA",
    category: "comments",
    categoryId: "DIC_kwDOU99nSM4DHMTz",
  },
} as const;
