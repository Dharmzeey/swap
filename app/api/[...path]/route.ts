import { NextRequest, NextResponse } from "next/server";

const DJANGO_URL = process.env.DJANGO_URL ?? "http://localhost:8000";

type Context = { params: Promise<{ path: string[] }> };

function buildDjangoUrl(segments: string[], search: string): string {
  // Filter empty strings that appear when the client URL has a trailing slash
  // e.g. path = ['models', '1', ''] → ['models', '1']
  const clean = segments.filter((s) => s !== "");
  return `${DJANGO_URL}/api/${clean.join("/")}/` + (search ?? "");
}

async function proxy(djangoUrl: string, init?: RequestInit): Promise<NextResponse> {
  let res: Response;
  try {
    res = await fetch(djangoUrl, { ...init, cache: "no-store" });
  } catch (err) {
    console.error("[proxy] Django unreachable:", djangoUrl, err);
    return NextResponse.json(
      { error: "Upstream service unavailable" },
      { status: 503 }
    );
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => "");
    console.error("[proxy] Non-JSON response from Django:", res.status, text.slice(0, 200));
    return NextResponse.json(
      { error: "Upstream returned non-JSON", status: res.status },
      { status: 502 }
    );
  }

  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest, ctx: Context) {
  const { path } = await ctx.params;
  const djangoUrl = buildDjangoUrl(path, req.nextUrl.search);
  return proxy(djangoUrl, {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest, ctx: Context) {
  const { path } = await ctx.params;
  const djangoUrl = buildDjangoUrl(path, req.nextUrl.search);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  return proxy(djangoUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
