import { auth } from "@clerk/nextjs/server"
import { NextResponse } from 'next/server';
import { db } from "@/lib/db"
import { isTeacher } from "@/lib/teacher";

export async function DELETE (
    req: Request,
    { params }: { params: { courseId: string}}
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
       
        if (!userId || !isTeacher(userId)) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })
        if (!course) {
            return new NextResponse('Not Found', { status: 404 });
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: courseId
            }
        })
        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log('[COURSE_ID]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}





export async function PATCH (
    req: Request,
    { params } : { params: { courseId: string } }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
        const values = await req.json();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values
            }
        })
        return  NextResponse.json(course);
    } catch ( error ){
        console.log('[COURSE_ID]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}