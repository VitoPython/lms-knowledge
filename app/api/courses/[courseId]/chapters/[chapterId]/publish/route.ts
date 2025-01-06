import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {

        const { userId } = await auth()
        const { courseId, chapterId } = await params;
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })

        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })
        if (!ownCourse) {
            return new NextResponse('Unauthorized', { status: 404 })
        }
        
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId
            }
        })

        
        if (!chapter  || !chapter.videoUrl || !chapter.description || !chapter.title) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const publishedChapter = await db.chapter.update({
            where : {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: true
            }
        })
        return NextResponse.json(publishedChapter)
    } catch(error) {
        console.log('[CHAPTER_PUBLISH] Error:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
    
