"use client";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  videoUrl: z.string().url("Введите корректную ссылку на YouTube").min(1),
});

interface ChapterVideoFormProps {

    initialData: {
  
      videoUrl?: string | null;
  
    };
  
    courseId: string;
  
    chapterId: string;
  
  }

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(initialData.videoUrl || "");
  const router = useRouter();

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const onSubmit = async () => {
    try {
      formSchema.parse({ videoUrl }); // Валидация ссылки
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { videoUrl });
      toast.success("Видео успешно обновлено!");
      toggleEdit();
      router.refresh();
    } catch (error: any) {
      if (error.errors) {
        toast.error(error.errors[0].message); // Ошибка валидации
      } else {
        toast.error("Произошла ошибка при обновлении видео.");
      }
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 w-auto">
      <div className="font-medium flex items-center justify-between">
        Course Video
                <Button onClick={toggleEdit} variant="ghost" className="flex items-center  whitespace-normal">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2'/>
                            Add video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                        <Pencil  className='h-4 w-4 mr-2'/>
                        Edit video
                        </>
                    )}
                </Button>
      </div>

      {!isEditing && initialData.videoUrl ? (
        <iframe
          className="w-full aspect-video mt-2"
          src={`https://www.youtube.com/embed/${new URL(initialData.videoUrl).searchParams.get(
            "v"
          )}`}
          allowFullScreen
        />
      ) : (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          {!initialData.videoUrl ? (
            <Video className="h-10 w-10 text-slate-500" />
          ) : (
            <div className='flex justify-center '>
                <Video/>
                <div className='ml-2'>Video not provided</div>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div>
          <input
            type="text"
            className="border w-full p-2 rounded"
            placeholder="Input YouTube video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <Button onClick={onSubmit} className="mt-2">
            Save Video
          </Button>
        </div>
      )}
    </div>
  );
};
