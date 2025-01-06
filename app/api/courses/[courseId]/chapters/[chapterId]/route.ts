import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";


export async function DELETE (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string }}
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;
    if (!userId) {
      return new NextResponse( "", { status: 401 });
    }
    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId
      }
    })
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 404 });
    }
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      }
    })
    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (chapter.videoUrl) {
      const muxAsset = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        }
      });

      if (muxAsset) {
 
        await db.muxData.delete({
          where: {
            id: muxAsset.id,
          }
        });
      }
    }
    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId
      }
    })

    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true
      }
    })
    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false
        }
      })
    }
    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log('[CHAPTER_ID_DELETE]', error);
    return new NextResponse( "" )
  }
}




export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    const { isPublished, ...values } = await req.json();

    const { courseId, chapterId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!course) {
      return NextResponse.json({ error: "Курс не найден или нет доступа" }, { status: 404 });
    }

    const updatedChapter = await db.chapter.update({
      where: { 
        id: chapterId,
        courseId: courseId,
       },
      data: { ...values },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("[PATCH /api/courses/:courseId/:chapterId]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
