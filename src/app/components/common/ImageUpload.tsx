// src/app/components/common/ImageUpload.tsx
'use client';

import { api } from '@/app/lib/api/fetch';

interface ImageUploadProps {
  uploaded: (url: string) => void;
}

interface UploadResponse {
  url: string;
}

export default function ImageUpload({ uploaded }: ImageUploadProps) {
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    
    const formData = new FormData();
    formData.append('image', files[0]);

    try {
      const data = await api.post<UploadResponse, FormData>('/upload', formData);
      uploaded(data.url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <label className="btn btn-primary">
      Upload
      <input 
        type="file" 
        hidden 
        onChange={e => upload(e.target.files)}
      />
    </label>
  );
}