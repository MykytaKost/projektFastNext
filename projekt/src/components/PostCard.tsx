import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, FileText, Download, Edit2, X, Trash2, Image } from 'lucide-react';
import { Post } from '../App';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onEdit: (postId: string, content: string, images: string[], files: { name: string; type: string; url: string }[]) => void;
  onViewProfile?: (userId: string) => void;
}

export function PostCard({ post, onLike, onComment, onLikeComment, onEdit, onViewProfile }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImages, setEditImages] = useState<string[]>(post.images || []);
  const [editFiles, setEditFiles] = useState<{ name: string; type: string; url: string }[]>(post.files || []);

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleEdit = () => {
    onEdit(post.id, editContent, editImages, editFiles);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setEditImages(post.images || []);
    setEditFiles(post.files || []);
    setIsEditing(false);
  };

  const handleAddImage = () => {
    const imageUrl = prompt('Wprowadź URL obrazu:');
    if (imageUrl) {
      setEditImages([...editImages, imageUrl]);
    }
  };

  const handleAddFile = () => {
    const fileName = prompt('Wprowadź nazwę pliku:');
    if (fileName) {
      setEditFiles([...editFiles, {
        name: fileName,
        type: 'application/pdf',
        url: '#'
      }]);
    }
  };

  const removeImage = (index: number) => {
    setEditImages(editImages.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setEditFiles(editFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onViewProfile?.(post.user.id)}
            />
            <div>
              <h4 
                className="cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onViewProfile?.(post.user.id)}
              >
                {post.user.name}
              </h4>
              {post.user.title && (
                <p className="text-sm text-gray-600">{post.user.title}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(post.timestamp, { addSuffix: true, locale: pl })}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edytuj
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(post.id, '', [], [])}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {isEditing ? (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="resize-none min-h-[40px] mt-3"
          />
        ) : (
          <div className="mt-3">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
        )}
      </div>
      
      {isEditing && editImages.length > 0 && (
        <div className="px-4 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {editImages.map((img, index) => (
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
        </div>
      )}
      
      {isEditing && editFiles.length > 0 && (
        <div className="px-4 pb-2 space-y-2">
          {editFiles.map((file, index) => (
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
      
      {isEditing && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
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
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
              >
                Anuluj
              </Button>
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={!editContent.trim() && editImages.length === 0 && editFiles.length === 0}
              >
                Zapisz
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {!isEditing && post.images && post.images.length > 0 && (
        <div className={`grid ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-1`}>
          {post.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Post image ${index + 1}`}
              className="w-full h-80 object-cover"
            />
          ))}
        </div>
      )}
      
      {!isEditing && post.files && post.files.length > 0 && (
        <div className="px-4 pb-2 space-y-2">
          {post.files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">PDF Document</p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <button className="hover:underline">
            {post.likes} {post.likes === 1 ? 'polubienie' : 'polubień'}
          </button>
          <button
            className="hover:underline"
            onClick={() => setShowComments(!showComments)}
          >
            {post.comments.length} {post.comments.length === 1 ? 'komentarz' : 'komentarzy'}
          </button>
        </div>
      </div>
      
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            onClick={() => onLike(post.id)}
            className={post.likedByUser ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'}
          >
            <Heart className={`w-5 h-5 mr-2 ${post.likedByUser ? 'fill-current' : ''}`} />
            Lubię to
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowComments(!showComments)}
            className="text-gray-600 hover:text-blue-600"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Komentuj
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
            <Share2 className="w-5 h-5 mr-2" />
            Udostępnij
          </Button>
        </div>
      </div>
      
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="mt-4 space-y-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex gap-2">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="text-sm">{comment.user.name}</p>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 px-2">
                    <button
                      onClick={() => onLikeComment(post.id, comment.id)}
                      className="text-xs text-gray-600 hover:text-red-500"
                    >
                      Lubię to {comment.likes > 0 && `(${comment.likes})`}
                    </button>
                    <button className="text-xs text-gray-600 hover:text-blue-600">
                      Odpowiedz
                    </button>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(comment.timestamp, { addSuffix: true, locale: pl })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2">
            <img
              src={post.user.avatar}
              alt="Your avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 flex gap-2">
              <Textarea
                placeholder="Napisz komentarz..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="resize-none min-h-[40px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
              />
              <Button onClick={handleComment} disabled={!commentText.trim()}>
                Wyślij
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}