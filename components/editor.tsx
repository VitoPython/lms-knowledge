"use client"

import dynamic from "next/dynamic";
import { useMemo } from "react";
import 'react-quill-new/dist/quill.snow.css';

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

export const Editor = ({
    onChange,
    value,
}: EditorProps) => {
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill-new"), { ssr: false }), []);
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{'code-block': true}],
        ['clean']                                         // remove formatting button
      ];
    const modules = {
        toolbar: toolbarOptions
      }

      const formats = [
        'font','size',
        'bold','italic','underline','strike',
        'color','background',
        'script',
        'header','blockquote','code-block',
        'indent','list',
        'direction','align',
        'link','image','video','formula',
        'code-block',
      ]
    return (
        <div className='bg-white'>
            <ReactQuill 
                theme='snow'
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
            />
        </div>
    )
}