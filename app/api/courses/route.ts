import { auth }  from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json(course);
} catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}







// import { PrismaClient } from "@prisma/client";

// const db = new PrismaClient();

// export async function POST() {
//   const course = await db.course.create({
//     data: {
//       title: "Test Title",
//       userId: "static_user_id",
//     },
//   });

//   console.log("Created course in database:", course);
//   return course;
// }
