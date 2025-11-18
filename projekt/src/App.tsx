import { useState } from 'react';
import { Header } from './components/Header';
import { CreatePost } from './components/CreatePost';
import { PostCard } from './components/PostCard';
import { Sidebar } from './components/Sidebar';
import { ProfilePage } from './components/ProfilePage';
import { FriendsSuggestions } from './components/FriendsSuggestions';
import { FriendsPage, FriendRequest } from './components/FriendsPage';
import { Search } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  title?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
  likes: number;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  images?: string[];
  files?: { name: string; type: string; url: string }[];
  timestamp: Date;
  likes: number;
  likedByUser: boolean;
  comments: Comment[];
}

export default function App() {
  const [currentView, setCurrentView] = useState<'feed' | 'profile' | 'friends'>('feed');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: 'fr1',
      from: {
        id: 'u5',
        name: 'Tomasz Lewandowski',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        title: 'Backend Developer'
      },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'fr2',
      from: {
        id: 'u6',
        name: 'Magdalena Zielińska',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        title: 'Marketing Manager'
      },
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
    }
  ]);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: {
        id: 'u1',
        name: 'Anna Kowalska',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        title: 'Senior Developer @ Tech Corp'
      },
      content: 'Właśnie ukończyłam świetny projekt! Współpraca z zespołem była niesamowita. 🚀',
      images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop'],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 42,
      likedByUser: false,
      comments: [
        {
          id: 'c1',
          user: {
            id: 'u2',
            name: 'Jan Nowak',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
          },
          content: 'Gratulacje! Świetna robota!',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 5
        }
      ]
    },
    {
      id: '2',
      user: {
        id: 'u3',
        name: 'Piotr Wiśniewski',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        title: 'Product Designer'
      },
      content: 'Nowy design system gotowy! Co myślicie o tych kolorach?',
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'],
      files: [
        { name: 'design-system.pdf', type: 'application/pdf', url: '#' }
      ],
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 28,
      likedByUser: true,
      comments: []
    },
    {
      id: '3',
      user: {
        id: 'u4',
        name: 'Maria Lewandowska',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        title: 'Marketing Manager'
      },
      content: 'Dzisiaj na konferencji MarketingPro 2025! Dużo inspiracji i nowych pomysłów. #marketing #konferencja',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 15,
      likedByUser: false,
      comments: [
        {
          id: 'c2',
          user: {
            id: 'u5',
            name: 'Tomasz Zając',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
          },
          content: 'Też tam jestem! Może się spotkamy?',
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
          likes: 2
        }
      ]
    }
  ]);

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'current',
    name: 'Jan Kowalski',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    title: 'Software Engineer',
    bio: 'Pasjonuję się technologią i innowacjami. Zawsze szukam nowych wyzwań!',
    location: 'Warszawa, Polska',
    website: ''
  });

  const handleCreatePost = (content: string, images: string[], files: { name: string; type: string; url: string }[]) => {
    const newPost: Post = {
      id: Date.now().toString(),
      user: currentUser,
      content,
      images: images.length > 0 ? images : undefined,
      files: files.length > 0 ? files : undefined,
      timestamp: new Date(),
      likes: 0,
      likedByUser: false,
      comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
          likedByUser: !post.likedByUser
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, content: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          user: currentUser,
          content,
          timestamp: new Date(),
          likes: 0
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: comment.likes + 1
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));
  };

  const handleEditPost = (postId: string, content: string, images: string[], files: { name: string; type: string; url: string }[]) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          content,
          images: images.length > 0 ? images : undefined,
          files: files.length > 0 ? files : undefined
        };
      }
      return post;
    }));
  };

  const handleViewProfile = (userId: string) => {
    setViewingUserId(userId);
    setCurrentView('profile');
  };

  const handleBackToFeed = () => {
    setCurrentView('feed');
    setViewingUserId(null);
  };

  const handleViewFriends = () => {
    setCurrentView('friends');
  };

  const handleUpdateProfile = (userData: Partial<User>) => {
    setCurrentUser({ ...currentUser, ...userData });
  };

  const getViewingUser = (): User => {
    if (viewingUserId === currentUser.id || viewingUserId === 'current') {
      return currentUser;
    }
    const post = posts.find(p => p.user.id === viewingUserId);
    return post?.user || currentUser;
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('feed');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const contentMatch = post.content.toLowerCase().includes(searchLower);
    const authorMatch = post.user.name.toLowerCase().includes(searchLower);
    const titleMatch = post.user.title?.toLowerCase().includes(searchLower);
    
    return contentMatch || authorMatch || titleMatch;
  });

  const getAllUsers = (): User[] => {
    const userMap = new Map<string, User>();
    
    posts.forEach(post => {
      if (!userMap.has(post.user.id)) {
        userMap.set(post.user.id, post.user);
      }
      post.comments.forEach(comment => {
        if (!userMap.has(comment.user.id)) {
          userMap.set(comment.user.id, comment.user);
        }
      });
    });

    friendRequests.forEach(request => {
      if (!userMap.has(request.from.id)) {
        userMap.set(request.from.id, request.from);
      }
    });
    
    return Array.from(userMap.values());
  };

  const handleAddFriend = (userId: string) => {
    const allUsers = getAllUsers();
    const userToAdd = allUsers.find(u => u.id === userId);
    if (userToAdd && !friends.find(f => f.id === userId)) {
      setFriends([...friends, userToAdd]);
    }
  };

  const handleRemoveFriend = (userId: string) => {
    setFriends(friends.filter(f => f.id !== userId));
  };

  const handleAcceptRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      setFriends([...friends, request.from]);
      setFriendRequests(friendRequests.filter(r => r.id !== requestId));
    }
  };

  const handleRejectRequest = (requestId: string) => {
    setFriendRequests(friendRequests.filter(r => r.id !== requestId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser} 
        onViewProfile={handleViewProfile}
        onBackToFeed={handleBackToFeed}
        onViewFriends={handleViewFriends}
        currentView={currentView}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        pendingRequestsCount={friendRequests.length}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'feed' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-3">
              <Sidebar 
                currentUser={currentUser} 
                onViewProfile={handleViewProfile}
              />
            </aside>
            
            <main className="lg:col-span-6">
              <div className="space-y-4">
                {!searchQuery && (
                  <CreatePost onCreatePost={handleCreatePost} currentUser={currentUser} />
                )}
                
                {searchQuery && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-600">
                      {filteredPosts.length === 0 ? (
                        <>Nie znaleziono wyników dla: <span className="font-semibold text-gray-900">{searchQuery}</span></>
                      ) : (
                        <>Znaleziono {filteredPosts.length} {filteredPosts.length === 1 ? 'wynik' : 'wyników'} dla: <span className="font-semibold text-gray-900">{searchQuery}</span></>
                      )}
                    </p>
                  </div>
                )}
                
                {filteredPosts.length === 0 && searchQuery ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Spróbuj użyć innych słów kluczowych</p>
                  </div>
                ) : (
                  filteredPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLikePost}
                      onComment={handleAddComment}
                      onLikeComment={handleLikeComment}
                      onEdit={handleEditPost}
                      onViewProfile={handleViewProfile}
                    />
                  ))
                )}
              </div>
            </main>
            
            <aside className="lg:col-span-3 hidden lg:block">
              <FriendsSuggestions onViewProfile={handleViewProfile} />
            </aside>
          </div>
        ) : currentView === 'friends' ? (
          <FriendsPage
            currentUser={currentUser}
            friends={friends}
            friendRequests={friendRequests}
            allUsers={getAllUsers()}
            onAddFriend={handleAddFriend}
            onRemoveFriend={handleRemoveFriend}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onViewProfile={handleViewProfile}
          />
        ) : (
          <ProfilePage
            user={getViewingUser()}
            posts={posts}
            isCurrentUser={viewingUserId === currentUser.id || viewingUserId === 'current'}
            onLike={handleLikePost}
            onComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onEdit={handleEditPost}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </div>
    </div>
  );
}