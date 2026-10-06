import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type LinkButtonProps = ComponentProps<typeof Button> & {
  href: string;
  external?: boolean;
};

export function LinkButton({ href, external, ...props }: LinkButtonProps) {
  const anchorProps = external
    ? { href, target: "_blank", rel: "noopener noreferrer" as const }
    : { href };

  return (
    <Button
      nativeButton={false}
      render={<Link {...anchorProps} />}
      {...props}
    />
  );
}
