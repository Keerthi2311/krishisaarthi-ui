import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<void>;
  imageFile: File | null;
  loading?: boolean;
}

const ImageUpload = ({ onImageUpload, imageFile, loading = false }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onImageUpload(file);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Upload className="w-5 h-5 mr-2 text-blue-600" />
          Upload Crop Image
        </h2>
      </Card.Header>

      <Card.Content>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {imageFile ? (
            <div className="space-y-4">
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Uploaded crop"
                width={300}
                height={200}
                className="mx-auto max-h-48 rounded-lg object-contain"
              />
              <p className="text-sm text-gray-600">{imageFile.name}</p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  loading={loading}
                >
                  Choose Image
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Upload a clear photo of your crop or affected area
                </p>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </Card.Content>
    </Card>
  );
};

export default ImageUpload;
