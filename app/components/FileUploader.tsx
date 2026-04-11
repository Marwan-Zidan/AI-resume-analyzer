import { on } from 'events';
import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import {formatSize} from '~/lib/utils'
interface fileUploaderProps{
  onFileSelect?: (file: File | null) => void;
}
const FileUploader = ({onFileSelect}:fileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0] || null;
    onFileSelect?.(file);
  }, [onFileSelect]);
  const {getRootProps, getInputProps, isDragActive , acceptedFiles} = useDropzone({onDrop, multiple: false,
  accept: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc', '.docx']
  }, maxSize: 20 * 1024 * 1024
});
const file = acceptedFiles[0] || null;
  return (
    <div className='w-full gradient-border'>
      <div {...getRootProps()}>
      <input {...getInputProps()} />
    <div className='space-y-4 cursor-pointer'>
      <div className='mx-auto  w-16  h-16 flex items-center justify-center'>
        <img src="../../public/icons/info.svg" alt="upload"className='size-20 ' />
      </div>
      {file?(<div className='text-center'>
        <p className='text-lg text-gray-700 font-medium truncate'>{file.name}</p>
        <p className='text-sm text-gray-500'>{formatSize(file.size)}</p>
      </div>):(
        <div>
            <p className='text-lg text-gray-500 '>
              <span className='font-semibold'>
                Click or upload
              </span>or drag and drop 
            </p>
            <p className='text-lg text-gray-500 '>
              PDF(max 20 MB) PDF, DOC, DOCX
            </p>
      </div>)}
    </div>
    </div>
    </div>
  )
}

export default FileUploader
