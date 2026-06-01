import { NextResponse } from "next/server";
import { generateMatchesPdf } from "@/lib/pdf/generate-pdf";
import { getMonths } from "@/app/actions/ligas";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const monthId = Number(searchParams.get("monthId"));

  const allMonths = await getMonths();
  const month = allMonths.find((m) => m.id === monthId);

  if (!month) {
    return new NextResponse("Mes no encontrado", { status: 404 });
  }

  const buffer = await generateMatchesPdf(month.id, month.temporada_id);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="partidos.pdf"`,
    },
  });
}
