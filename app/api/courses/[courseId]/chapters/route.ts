import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
export async function POST(
    req: Request,
    {params}: {params: {courseId: string}}
) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();
        const { courseId } = await params;
        if (!userId) {
            return new NextResponse('Unauthorized', {status: 401});
        }
        const courseOwner = await db.course.findFirst({
            where: {
                id: courseId,
                userId
            }
        });

        if (!courseOwner) {
            return new NextResponse('Unauthorized', {status: 401});
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId
            },
            orderBy: {
                position: 'desc'
            }
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: courseId,
                position: newPosition
            }
        });

        return NextResponse.json(chapter)
    } catch (error) {
        console.error("[CHAPTERS]",error);
    }
}