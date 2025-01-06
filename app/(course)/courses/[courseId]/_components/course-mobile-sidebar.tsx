import { Menu } from 'lucide-react'
import { Chapter, Course, UserProgress } from '@prisma/client'

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from '@/components/ui/sheet'

import { CourseSidebar } from './course-sidebar'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface CourseMobileSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

export const CourseMobileSidebar = ({
    course,
    progressCount,
}: CourseMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-4 bg-white w-72">
                <SheetTitle>
                    <VisuallyHidden>Course Sidebar</VisuallyHidden>
                </SheetTitle>
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </SheetContent>
        </Sheet>
    );
};
