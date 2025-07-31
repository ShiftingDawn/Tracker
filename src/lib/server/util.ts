import type { ResizeOptions } from "sharp";
import type sharp from "sharp";
import type { RequestEvent } from "../../routes/$types";
import type { ServerLoadEvent } from "@sveltejs/kit";

export function getError(holder: unknown): string | undefined {
  if (holder === null || holder === undefined) {
    return undefined;
  }
  if (typeof holder === "string") {
    return holder as string;
  }
  if (Array.isArray(holder) && holder.length > 0) {
    return holder[0] as string;
  }
  if (typeof holder === "object" && "errors" in holder) {
    return getError(holder.errors);
  }
  return undefined;
}

export function isImage(file: Blob): boolean {
  const t = file.type;
  return t === "image/png" || t === "image/jpeg" || t === "image/webp";
}

export async function getScaledSizes(size: number, img: ReturnType<typeof sharp>): Promise<ResizeOptions> {
  const meta = await img.metadata();
  const scale = Math.min(size / meta.width, size / meta.height);
  return {
    width: Math.floor(meta.width * scale),
    height: Math.floor(meta.height * scale),
  };
}

export async function addBreadcrumb<T extends object>(input: T, event: ServerLoadEvent, name: string, href: string) {
  const parent = await event.parent();
  return { ...input, breadcrumbs: parent.breadcrumbs.concat({name, href,}), };
}
