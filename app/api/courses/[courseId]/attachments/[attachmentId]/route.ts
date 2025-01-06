import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; attachmentId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Await the params
        const { courseId, attachmentId } = await params;

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.delete({
            where: {
                courseId: courseId,
                id: attachmentId,
            },
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.error("ATTACHMENT_ID_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
