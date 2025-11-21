import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// GET /api/links/:code
export async function GET(request: Request, context: { params: Promise<{ code: string }> }) {
    try {
        const { params } = context;
        const resolvedParams = await params; // ✅ unwrap the Promise
        const { code } = resolvedParams;

        console.log("resolvedParams:", resolvedParams);
        console.log("code:", code);


        const link = await prisma.link.findUnique({
            where: { code },
        });

        if (!link) {
            return NextResponse.json({ error: "Code not found" }, { status: 404 });
        }

        return NextResponse.json(link);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}



// DELETE /api/links/:code
export async function DELETE(
    request: Request, context: { params: Promise<{ code: string }> }
) {
    try {

        const { params } = context;
        const resolvedParams = await params; // ✅ unwrap the Promise
        const { code } = resolvedParams;

        console.log("resolvedParams:", resolvedParams);
        console.log("code:", code);

        // const { code } = params;

        const link = await prisma.link.findUnique({
            where: { code },
        });

        if (!link) {
            return NextResponse.json({ error: "Code not found" }, { status: 404 });
        }

        await prisma.link.delete({
            where: { code },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

