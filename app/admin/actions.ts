"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  createSession,
  destroySession,
  requireAuth,
} from "@/lib/auth";

// ---------- Auth ----------

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!verifyPassword(password)) {
    redirect("/admin/login?error=invalid");
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Articles ----------

function parseReferenceLinks(raw: string): { label: string; url: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: label.trim(), url: rest.join("|").trim() };
    })
    .filter((r) => r.label && r.url);
}

async function syncTags(tagSlugs: string[]) {
  const tags = await Promise.all(
    tagSlugs.map((slug) =>
      prisma.tag.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
          name: slug
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
        },
      }),
    ),
  );
  return tags.map((t) => ({ id: t.id }));
}

function parseFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const projectUrl = String(formData.get("projectUrl") ?? "").trim() || null;
  const githubUrl = String(formData.get("githubUrl") ?? "").trim() || null;
  const referenceLinksRaw = String(formData.get("referenceLinks") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");
  const published = formData.get("published") === "on";

  const tagSlugs = tagsRaw
    .split(",")
    .map((s) => s.trim().toLowerCase().replace(/\s+/g, "-"))
    .filter(Boolean);

  return {
    title,
    slug,
    subtitle,
    content,
    coverImage,
    projectUrl,
    githubUrl,
    referenceLinks: parseReferenceLinks(referenceLinksRaw),
    tagSlugs,
    published,
  };
}

export async function createArticleAction(formData: FormData) {
  await requireAuth();
  const data = parseFormData(formData);
  const tags = await syncTags(data.tagSlugs);

  await prisma.article.create({
    data: {
      title: data.title,
      slug: data.slug,
      subtitle: data.subtitle,
      content: data.content,
      coverImage: data.coverImage,
      projectUrl: data.projectUrl,
      githubUrl: data.githubUrl,
      referenceLinks: data.referenceLinks,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
      tags: { connect: tags },
    },
  });

  revalidatePath("/articles");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateArticleAction(id: string, formData: FormData) {
  await requireAuth();
  const data = parseFormData(formData);
  const tags = await syncTags(data.tagSlugs);

  const existing = await prisma.article.findUnique({
    where: { id },
    select: { published: true, publishedAt: true },
  });

  const nowPublished = data.published && !existing?.published;

  await prisma.article.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      subtitle: data.subtitle,
      content: data.content,
      coverImage: data.coverImage,
      projectUrl: data.projectUrl,
      githubUrl: data.githubUrl,
      referenceLinks: data.referenceLinks,
      published: data.published,
      publishedAt: nowPublished
        ? new Date()
        : data.published
          ? existing?.publishedAt
          : null,
      tags: { set: tags },
    },
  });

  revalidatePath("/articles");
  revalidatePath(`/articles/${data.slug}`);
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteArticleAction(id: string) {
  await requireAuth();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/articles");
  revalidatePath("/");
  redirect("/admin");
}
