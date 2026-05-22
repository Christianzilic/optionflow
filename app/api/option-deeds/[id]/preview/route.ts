import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateOptionDeedPdf } from "@/deeds/generators/generateOptionDeed";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const deed = await prisma.optionDeed.findUnique({ where: { id } });
  if (!deed) return new NextResponse("Not found", { status: 404 });

  const pdfBuffer = await generateOptionDeedPdf(id);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="option-deed-${id}.pdf"`,
    },
  });
}
