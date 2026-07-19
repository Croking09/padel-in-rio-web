import { NextResponse } from "next/server";
import { generateMatchesPdf } from "@/lib/pdf/generate-pdf";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const monthId = Number(searchParams.get("monthId"));

  const buffer = await generateMatchesPdf(monthId);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="partidos.pdf"`,
    },
  });
}
