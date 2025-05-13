
import React, { useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  dir?: 'ltr' | 'rtl';
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  dir = 'ltr', 
  placeholder 
}) => {
  // Configure Quill modules
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  }), []);

  // Configure Quill formats
  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor" dir={dir}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || (dir === 'rtl' ? 'اكتب هنا...' : 'Write something...')}
        className={`min-h-[400px] ${dir === 'rtl' ? 'text-right font-amiri' : 'text-left font-serif'}`}
      />
    </div>
  );
};

export default RichTextEditor;
