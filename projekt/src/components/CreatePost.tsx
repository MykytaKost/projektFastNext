import { useState } from 'react';
import { Image, FileText, Smile, X } from 'lucide-react';
import { User } from '../App';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface CreatePostProps {
  onCreatePost: (content: string, images: string[], files: { name: string; type: string; url: string }[]) => void;
  currentUser: User;
}

export function CreatePost({ onCreatePost, currentUser }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<{ name: string; type: string; url: string }[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (content.trim() || images.length > 0 || files.length > 0) {
      onCreatePost(content, images, files);
      setContent('');
      setImages([]);
      setFiles([]);
      setIsExpanded(false);
    }
  };

  const handleAddImage = () => {
    const imageUrl = prompt('Wprowadź URL obrazu:');
    if (imageUrl) {
      setImages([...images, imageUrl]);
    }
  };

  const handleAddFile = () => {
    const fileName = prompt('Wprowadź nazwę pliku:');
    if (fileName) {
      setFiles([...files, {
        name: fileName,
        type: 'application/pdf',
        url: '#'
      }]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <Textarea
            placeholder="O czym chcesz napisać?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="resize-none min-h-[60px]"
          />
          
          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm flex-1">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {isExpanded && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddImage}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <Image className="w-5 h-5 mr-1" />
                  Zdjęcie
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddFile}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <FileText className="w-5 h-5 mr-1" />
                  Plik
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-blue-600"
                >
                  <Smile className="w-5 h-5 mr-1" />
                  Emoji
                </Button>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() && images.length === 0 && files.length === 0}
              >
                Opublikuj
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
