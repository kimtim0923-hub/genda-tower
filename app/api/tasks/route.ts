import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/tasks — 전체 태스크 조회
export async function GET() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH /api/tasks — 태스크 상태 업데이트
// Body: { id: "l2", status: "done" }
// 또는 여러 필드: { id: "l2", status: "active", note: "진행중..." }
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  // 허용 필드만 추출
  const allowed = ["status", "priority", "note", "name", "start_date", "end_date"];
  const safeUpdates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in updates) safeUpdates[key] = updates[key];
  }

  if (Object.keys(safeUpdates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  safeUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("tasks")
    .update(safeUpdates)
    .eq("id", id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, task: data?.[0] });
}

// POST /api/tasks — 여러 태스크 일괄 업데이트
// Body: [{ id: "l2", status: "done" }, { id: "l3", status: "active" }]
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Body must be an array" }, { status: 400 });
  }

  const results = [];
  for (const item of body) {
    const { id, ...updates } = item;
    if (!id) continue;

    const allowed = ["status", "priority", "note", "name", "start_date", "end_date"];
    const safeUpdates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in updates) safeUpdates[key] = updates[key];
    }
    safeUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("tasks")
      .update(safeUpdates)
      .eq("id", id)
      .select();

    results.push({ id, success: !error, data: data?.[0], error: error?.message });
  }

  return NextResponse.json({ results });
}
