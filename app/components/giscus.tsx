"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { siteConfig } from "@/app/config/site";

export function Giscus() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const giscusTheme = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", siteConfig.giscus.repo);
    script.setAttribute("data-repo-id", siteConfig.giscus.repoId);
    script.setAttribute("data-category", siteConfig.giscus.category);
    script.setAttribute("data-category-id", siteConfig.giscus.categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", giscusTheme);
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");

    container.appendChild(script);
  }, []);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame",
    );
    if (!iframe?.contentWindow) return;

    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      "https://giscus.app",
    );
  }, [giscusTheme]);

  return <div ref={containerRef} className="mt-4" />;
}
