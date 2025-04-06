import { NextResponse } from "next/server";
import { google } from "googleapis";

// テスト用の認証情報・スプレッドシートID（ハードコード）
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n") || "";

const auth = new google.auth.JWT(
  SERVICE_ACCOUNT_EMAIL,
  undefined,
  PRIVATE_KEY,
  ["https://www.googleapis.com/auth/spreadsheets"]
);
const sheets = google.sheets({ version: "v4", auth });

/**
 * ヘルパー：シート「work05_sche」の全データ（2次元配列）を取得する
 */
async function getEventsData(): Promise<string[][]> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "work05_sche", // シート全体
  });
  return res.data.values || [];
}

/**
 * ヘルパー：ヘッダー配列内で指定キーのインデックスを返す
 */
function getHeaderIndex(headers: string[], key: string): number {
  return headers.indexOf(key);
}

/**
 * GET: イベントを取得する
 */
export async function GET(req: Request) {
  try {
    const data = await getEventsData();
    if (data.length < 2) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }
    const headers = data[0];
    const rows = data.slice(1);
    const events = rows.map((row) => ({
      id: row[getHeaderIndex(headers, "id")],
      title: row[getHeaderIndex(headers, "title")],
      day: row[getHeaderIndex(headers, "day")],
      h1: row[getHeaderIndex(headers, "h1")],
      m1: row[getHeaderIndex(headers, "m1")],
      h2: row[getHeaderIndex(headers, "h2")],
      m2: row[getHeaderIndex(headers, "m2")],
      category: row[getHeaderIndex(headers, "category")],
    }));
    return NextResponse.json(events);
  } catch (error: unknown) {
    console.error("GET /api/event error:", error);
    return NextResponse.json(
      { error: "Failed to fetch work05_sche" },
      { status: 500 }
    );
  }
}

/**
 * POST: イベントを追加する
 */
export async function POST(req: Request) {
  try {

    const body = await req.json();
    const { title, day, h1, m1, h2, m2, category } = body;
    const id = new Date().toISOString();
    if (!title || !day || !h1 || !m1 || !h2 || !m2 || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const data = await getEventsData();
    const headers = data[0];
    const newRow = [id, title, day, h1, m1, h2, m2, category];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "work05_sche",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [newRow] },
    });
    return NextResponse.json({ message: "Event added successfully" });
  } catch (error: unknown) {
    console.error("POST /api/event error:", error);
    return NextResponse.json(
      { error: "Failed to add event" },
      { status: 500 }
    );
  }
}

/**
 * PUT: イベントを更新する
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, day, h1, m1, h2, m2, category } = body;
    if (!id || !title || !day || !h1 || !m1 || !h2 || !m2 || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const data = await getEventsData();
    if (data.length < 2) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }
    const headers = data[0];
    const rows = data.slice(1);
    const eventRowIndex = rows.findIndex(
      (row) => row[getHeaderIndex(headers, "id")] === id
    );
    if (eventRowIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 更新対象行のフィールド更新
    const titleIndex = getHeaderIndex(headers, "title");
    const dayIndex = getHeaderIndex(headers, "day");
    const h1Index = getHeaderIndex(headers, "h1");
    const m1Index = getHeaderIndex(headers, "m1");
    const h2Index = getHeaderIndex(headers, "h2");
    const m2Index = getHeaderIndex(headers, "m2");
    const categoryIndex = getHeaderIndex(headers, "category");

    rows[eventRowIndex][titleIndex] = title;
    rows[eventRowIndex][dayIndex] = day;
    rows[eventRowIndex][h1Index] = h1;
    rows[eventRowIndex][m1Index] = m1;
    rows[eventRowIndex][h2Index] = h2;
    rows[eventRowIndex][m2Index] = m2;
    rows[eventRowIndex][categoryIndex] = category;

    // シート上の実際の行番号は、ヘッダー行を含めて eventRowIndex + 2
    const sheetRowNumber = eventRowIndex + 2;
    const range = `work05_sche!A${sheetRowNumber}:H${sheetRowNumber}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [rows[eventRowIndex]] },
    });

    return NextResponse.json({ message: "Event updated successfully" });
  } catch (error: unknown) {
    console.error("PUT /api/event error:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: イベントを削除する
 */
export async function DELETE(req: Request) {
  try {
    const id = req.url.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }
    const data = await getEventsData();
    if (data.length < 2) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }
    const headers = data[0];
    const rows = data.slice(1);
    const eventRowIndex = rows.findIndex(
      (row) => row[getHeaderIndex(headers, "id")] === id
    );
    if (eventRowIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // シート上の実際の行番号は、ヘッダー行を含めて eventRowIndex + 2
    const sheetRowNumber = eventRowIndex + 2;
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `work05_sche!A${sheetRowNumber}:H${sheetRowNumber}`,
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE /api/event error:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}