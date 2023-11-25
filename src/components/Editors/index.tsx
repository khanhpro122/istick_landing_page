// Libraries
import React,{ useState }  from 'react';
import dynamic from 'next/dynamic'

// Hooks
import { useDebounce, useUpdateEffect } from '@/hooks';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
}

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

export const Editor = ({ value, onChange, placeholder, errorText}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleChange = (value: string) => {
    onChange(value)
  };

  return (
    <div className='text-editor'>
      <QuillNoSSRWrapper 
        modules={modules} 
        value={value} 
        formats={formats} 
        theme="snow" 
        placeholder={placeholder} 
        onChange={handleChange}
        onBlur={() => setIsFocused(true)}
        style={{
          border: isFocused && errorText  ? '2px solid red' : '',
        }}
      />
      {isFocused && (
        <div className="text-[red] text-[12px]">{errorText}</div>
      )}
    </div>
  );
};

export default Editor;
