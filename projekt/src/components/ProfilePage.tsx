import { useState } from 'react';
import { User, Post } from '../App';
import { Button } from './ui/button';
import { PostCard } from './PostCard';
import { MapPin, Link as LinkIcon, Calendar, Edit, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface ProfilePageProps {
  user: User;
  posts: Post[];
  isCurrentUser: boolean;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onEdit: (postId: string, content: string, images: string[], files: { name: string; type: string; url: string }[]) => void;
  onUpdateProfile: (userData: Partial<User> & { bio?: string; location?: string; website?: string }) => void;
}

export function ProfilePage({ 
  user, 
  posts, 
  isCurrentUser, 
  onLike, 
  onComment, 
  onLikeComment, 
  onEdit,
  onUpdateProfile
}: ProfilePageProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editTitle, setEditTitle] = useState(user.title || '');
  const [editBio, setEditBio] = useState('Pasjonuję się technologią i innowacjami. Zawsze szukam nowych wyzwań!');
  const [editLocation, setEditLocation] = useState('Warszawa, Polska');
  const [editWebsite, setEditWebsite] = useState('');

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: editName,
      title: editTitle,
      bio: editBio,
      location: editLocation,
      website: editWebsite
    });
    setIsEditingProfile(false);
  };

  const userPosts = posts.filter(post => post.user.id === user.id);
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="mb-4">
                <h1 className="text-2xl">{user.name}</h1>
                {user.title && (
                  <p className="text-gray-600 mt-1">{user.title}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {editLocation}
                  </span>
                  <span>532 połączeń</span>
                </div>
              </div>
            </div>
            
            {isCurrentUser && (
              <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="self-start sm:self-auto">
                    <Edit className="w-4 h-4 mr-2" />
                    Edytuj profil
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edytuj profil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Imię i nazwisko</Label>
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Stanowisko</Label>
                      <Input
                        id="title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">O mnie</Label>
                      <Textarea
                        id="bio"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Lokalizacja</Label>
                      <Input
                        id="location"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Strona internetowa</Label>
                      <Input
                        id="website"
                        value={editWebsite}
                        onChange={(e) => setEditWebsite(e.target.value)}
                        placeholder="https://"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                      Anuluj
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      Zapisz zmiany
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            {!isCurrentUser && (
              <div className="flex gap-2 self-start sm:self-auto">
                <Button>
                  Połącz
                </Button>
                <Button variant="outline">
                  Wiadomość
                </Button>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="mb-2">O mnie</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{editBio}</p>
          </div>
          
          {editWebsite && (
            <div className="mt-4 flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
              <LinkIcon className="w-4 h-4" />
              <span className="text-sm">{editWebsite}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="mb-4">Statystyki</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Wyświetlenia profilu</span>
                <span className="text-blue-600">1,247</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm text-gray-600">Posty</span>
                <span className="text-blue-600">{userPosts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Łącznie polubień</span>
                <span className="text-blue-600">{totalLikes}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="mb-4">Umiejętności</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">React</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Node.js</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Design</span>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h3 className="mb-4">Aktywność</h3>
            <div className="flex gap-4 border-b">
              <button className="pb-3 border-b-2 border-blue-600 text-blue-600">
                Posty ({userPosts.length})
              </button>
              <button className="pb-3 text-gray-600 hover:text-blue-600">
                Komentarze
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={onLike}
                  onComment={onComment}
                  onLikeComment={onLikeComment}
                  onEdit={onEdit}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Brak postów do wyświetlenia</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
