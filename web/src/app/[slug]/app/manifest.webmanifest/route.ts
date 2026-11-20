import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";

function mimeFromUrl(url: string) {
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

async function iconSizes(relativePath: string) {
  try {
    const filePath = path.join(process.cwd(), "public", relativePath);
    const meta = await sharp(await readFile(filePath)).metadata();
    if (meta.width && meta.height) return `${meta.width}x${meta.height}`;
  } catch {
    // arquivo não encontrado localmente (ex: URL externa) — usa um tamanho padrão
  }
  return "512x512";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const app = await prisma.app.findUnique({ where: { slug } });

  if (!app) {
    return new Response("Not found", { status: 404 });
  }

  const iconPath = app.imageUrl ?? `/apps/${app.slug}.jpg`;
  const iconUrl = (process.env.SITE_URL ?? "") + iconPath;
  const iconType = mimeFromUrl(iconPath);
  const sizes = await iconSizes(iconPath);

  const manifest = {
    name: app.name,
    short_name: app.name,
    description: app.description,
    start_url: `/${app.slug}/app`,
    scope: `/${app.slug}/app`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: app.accentColor ?? "#111827",
    icons: [
      { src: iconUrl, sizes, type: iconType, purpose: "any" },
      { src: iconUrl, sizes, type: iconType, purpose: "maskable" },
    ],
  };

  return Response.json(manifest, {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
