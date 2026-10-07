"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ArticleFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  initial?: {
    title: string;
    slug: string;
    subtitle: string;
    content: string;
    coverImage: string;
    projectUrl: string;
    githubUrl: string;
    referenceLinks: string;
    tags: string;
    published: boolean;
  };
  submitLabel: string;
};

const empty: NonNullable<ArticleFormProps["initial"]> = {
  title: "",
  slug: "",
  subtitle: "",
  content: "",
  coverImage: "",
  projectUrl: "",
  githubUrl: "",
  referenceLinks: "",
  tags: "",
  published: false,
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ArticleForm({
  action,
  initial,
  submitLabel,
}: ArticleFormProps) {
  const start = initial ?? empty;
  const [title, setTitle] = useState(start.title);
  const [slug, setSlug] = useState(start.slug);
  const [slugLocked, setSlugLocked] = useState(!!start.slug);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugLocked) setSlug(slugify(value));
  }

  return (
    <form action={action} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Field label="Title" htmlFor="title">
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field
            label="Slug"
            htmlFor="slug"
            hint="URL path. Auto-generated from title, edit if you need to."
          >
            <input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugLocked(true);
              }}
              className={inputClass}
            />
          </Field>

          <Field label="Subtitle" htmlFor="subtitle">
            <input
              id="subtitle"
              name="subtitle"
              defaultValue={start.subtitle}
              className={inputClass}
            />
          </Field>

          <Field label="Content (Markdown)" htmlFor="content">
            <textarea
              id="content"
              name="content"
              required
              rows={24}
              defaultValue={start.content}
              className={`${inputClass} font-mono text-xs leading-relaxed`}
            />
          </Field>
        </div>

        <div className="space-y-6">
          <Field
            label="Tags"
            htmlFor="tags"
            hint="Comma-separated. e.g. nextjs, prisma, career"
          >
            <input
              id="tags"
              name="tags"
              defaultValue={start.tags}
              className={inputClass}
            />
          </Field>

          <Field label="Cover image URL" htmlFor="coverImage">
            <input
              id="coverImage"
              name="coverImage"
              type="url"
              defaultValue={start.coverImage}
              className={inputClass}
            />
          </Field>

          <Field label="Project URL" htmlFor="projectUrl">
            <input
              id="projectUrl"
              name="projectUrl"
              type="url"
              defaultValue={start.projectUrl}
              className={inputClass}
            />
          </Field>

          <Field label="GitHub URL" htmlFor="githubUrl">
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              defaultValue={start.githubUrl}
              className={inputClass}
            />
          </Field>

          <Field
            label="References"
            htmlFor="referenceLinks"
            hint="One per line. Format: Label | https://url"
          >
            <textarea
              id="referenceLinks"
              name="referenceLinks"
              rows={5}
              defaultValue={start.referenceLinks}
              className={`${inputClass} font-mono text-xs`}
            />
          </Field>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={start.published}
              className="h-4 w-4 rounded border-input"
            />
            Published
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t pt-6">
        <Button type="submit">{submitLabel}</Button>
        <Badge variant="outline">
          {start.published ? "Currently live" : "Currently draft"}
        </Badge>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
