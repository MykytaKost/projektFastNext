import { useMemo, useState } from "react";
import { Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Search } from "lucide-react";

import { Header } from "./components/Header";
import { CreatePost } from "./components/CreatePost";
import { PostCard } from "./components/PostCard";
import { Sidebar } from "./components/Sidebar";
import { ProfilePage } from "./components/ProfilePage";
import { FriendsSuggestions } from "./components/FriendsSuggestions";
import { FriendsPage, FriendRequest } from "./components/FriendsPage";
import { ErrorPage, NotFoundPage } from "./components/ErrorPage";

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
  return <AppRouter />;
}

function AppRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: "fr1",
      from: {
        id: "u5",
        name: "Tomasz Lewandowski",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        title: "Backend Developer",
      },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "fr2",
      from: {
        id: "u6",
        name: "Magdalena Zielińska",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        title: "Marketing Manager",
      },
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  ]);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      user: {
        id: "u1",
        name: "Anna Kowalska",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        title: "Senior Developer @ Tech Corp",
      },
      content:
        "Właśnie ukończyłam świetny projekt! Współpraca z zespołem była niesamowita. 🚀",
      images: [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      ],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 42,
      likedByUser: false,
      comments: [
        {
          id: "c1",
          user: {
            id: "u2",
            name: "Jan Nowak",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
          },
          content: "Gratulacje! Świetna robota!",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 5,
        },
      ],
    },
    {
      id: "2",
      user: {
        id: "u3",
        name: "Piotr Wiśniewski",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        title: "Product Designer",
      },
      content: "Nowy design system gotowy! Co myślicie o tych kolorach?",
      images: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      ],
      files: [{ name: "design-system.pdf", type: "application/pdf", url: "#" }],
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 28,
      likedByUser: true,
      comments: [],
    },
    {
      id: "3",
      user: {
        id: "u4",
        name: "Maria Lewandowska",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
        title: "Marketing Manager",
      },
      content:
        "Dzisiaj na konferencji MarketingPro 2025! Dużo inspiracji i nowych pomysłów. #marketing #konferencja",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 15,
      likedByUser: false,
      comments: [
        {
          id: "c2",
          user: {
            id: "u5",
            name: "Tomasz Zając",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
          },
          content: "Też tam jestem! Może się spotkamy?",
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
          likes: 2,
        },
      ],
    },
  ]);
  const [currentUser, setCurrentUser] = useState<User>({
    id: "current",
    name: "Jan Kowalski",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    title: "Software Engineer",
    bio: "Pasjonuję się technologią i innowacjami. Zawsze szukam nowych wyzwań!",
    location: "Warszawa, Polska",
    website: "",
  });

  const currentView: "feed" | "friends" | "profile" = location.pathname.startsWith("/friends")
    ? "friends"
    : location.pathname.startsWith("/profile")
    ? "profile"
    : "feed";

  const handleCreatePost = (
    content: string,
    images: string[],
    files: { name: string; type: string; url: string }[],
  ) => {
    const newPost: Post = {
      id: Date.now().toString(),
      user: currentUser,
      content,
      images: images.length > 0 ? images : undefined,
      files: files.length > 0 ? files : undefined,
      timestamp: new Date(),
      likes: 0,
      likedByUser: false,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              likedByUser: !post.likedByUser,
            }
          : post,
      ),
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now().toString(),
                  user: currentUser,
                  content,
                  timestamp: new Date(),
                  likes: 0,
                },
              ],
            }
          : post,
      ),
    );
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      likes: comment.likes + 1,
                    }
                  : comment,
              ),
            }
          : post,
      ),
    );
  };

  const handleEditPost = (
    postId: string,
    content: string,
    images: string[],
    files: { name: string; type: string; url: string }[],
  ) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              content,
              images: images.length > 0 ? images : undefined,
              files: files.length > 0 ? files : undefined,
            }
          : post,
      ),
    );
  };

  const handleUpdateProfile = (userData: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...userData }));
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }
    const searchLower = searchQuery.toLowerCase();
    return posts.filter((post) => {
      const contentMatch = post.content.toLowerCase().includes(searchLower);
      const authorMatch = post.user.name.toLowerCase().includes(searchLower);
      const titleMatch = post.user.title?.toLowerCase().includes(searchLower);
      return contentMatch || authorMatch || titleMatch;
    });
  }, [posts, searchQuery]);

  const allUsers = useMemo(() => {
    const userMap = new Map<string, User>();
    userMap.set(currentUser.id, currentUser);

    posts.forEach((post) => {
      userMap.set(post.user.id, post.user);
      post.comments.forEach((comment) => {
        userMap.set(comment.user.id, comment.user);
      });
    });

    friends.forEach((friend) => userMap.set(friend.id, friend));
    friendRequests.forEach((request) => userMap.set(request.from.id, request.from));

    return Array.from(userMap.values());
  }, [currentUser, friends, friendRequests, posts]);

  const resolveUser = (userId?: string | null): User | null => {
    if (!userId || userId === currentUser.id || userId === "current") {
      return currentUser;
    }
    return allUsers.find((user) => user.id === userId) ?? null;
  };

  const handleAddFriend = (userId: string) => {
    const userToAdd = allUsers.find((user) => user.id === userId);
    if (userToAdd && !friends.find((friend) => friend.id === userId)) {
      setFriends((prev) => [...prev, userToAdd]);
    }
  };

  const handleRemoveFriend = (userId: string) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== userId));
  };

  const handleAcceptRequest = (requestId: string) => {
    const request = friendRequests.find((item) => item.id === requestId);
    if (request) {
      setFriends((prev) => [...prev, request.from]);
      setFriendRequests((prev) => prev.filter((item) => item.id !== requestId));
    }
  };

  const handleRejectRequest = (requestId: string) => {
    setFriendRequests((prev) => prev.filter((item) => item.id !== requestId));
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleBackToFeed = () => {
    setSearchQuery("");
    navigate("/");
  };

  const handleViewFriends = () => {
    navigate("/friends");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigate("/");
    }
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
        onShowError={() => navigate("/error")}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              <FeedView
                currentUser={currentUser}
                searchQuery={searchQuery}
                filteredPosts={filteredPosts}
                onCreatePost={handleCreatePost}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onEditPost={handleEditPost}
                onViewProfile={handleViewProfile}
              />
            }
          />
          <Route
            path="/friends"
            element={
              <FriendsPage
                currentUser={currentUser}
                friends={friends}
                friendRequests={friendRequests}
                allUsers={allUsers}
                onAddFriend={handleAddFriend}
                onRemoveFriend={handleRemoveFriend}
                onAcceptRequest={handleAcceptRequest}
                onRejectRequest={handleRejectRequest}
                onViewProfile={handleViewProfile}
              />
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProfileRouteView
                resolveUser={resolveUser}
                currentUserId={currentUser.id}
                posts={posts}
                onLike={handleLikePost}
                onComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onEdit={handleEditPost}
                onUpdateProfile={handleUpdateProfile}
              />
            }
          />
          <Route path="/error" element={<ErrorPage onAction={handleBackToFeed} />} />
          <Route path="*" element={<NotFoundPage onAction={handleBackToFeed} />} />
        </Routes>
      </div>
    </div>
  );
}

interface FeedViewProps {
  currentUser: User;
  searchQuery: string;
  filteredPosts: Post[];
  onCreatePost: (
    content: string,
    images: string[],
    files: { name: string; type: string; url: string }[],
  ) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onEditPost: (
    postId: string,
    content: string,
    images: string[],
    files: { name: string; type: string; url: string }[],
  ) => void;
  onViewProfile: (userId: string) => void;
}

function FeedView({
  currentUser,
  searchQuery,
  filteredPosts,
  onCreatePost,
  onLikePost,
  onAddComment,
  onLikeComment,
  onEditPost,
  onViewProfile,
}: FeedViewProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <Sidebar currentUser={currentUser} onViewProfile={onViewProfile} />
      </aside>

      <main className="lg:col-span-6">
        <div className="space-y-4">
          {!searchQuery && <CreatePost onCreatePost={onCreatePost} currentUser={currentUser} />}

          {searchQuery && (
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">
                {filteredPosts.length === 0 ? (
                  <>
                    Nie znaleziono wyników dla: <span className="font-semibold text-gray-900">{searchQuery}</span>
                  </>
                ) : (
                  <>
                    Znaleziono {filteredPosts.length} {filteredPosts.length === 1 ? "wynik" : "wyników"} dla:
                    <span className="font-semibold text-gray-900"> {searchQuery}</span>
                  </>
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
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={onLikePost}
                onComment={onAddComment}
                onLikeComment={onLikeComment}
                onEdit={onEditPost}
                onViewProfile={onViewProfile}
              />
            ))
          )}
        </div>
      </main>

      <aside className="lg:col-span-3 hidden lg:block">
        <FriendsSuggestions onViewProfile={onViewProfile} />
      </aside>
    </div>
  );
}

interface ProfileRouteProps {
  resolveUser: (userId?: string | null) => User | null;
  currentUserId: string;
  posts: Post[];
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onEdit: (
    postId: string,
    content: string,
    images: string[],
    files: { name: string; type: string; url: string }[],
  ) => void;
  onUpdateProfile: (userData: Partial<User>) => void;
}

function ProfileRouteView({
  resolveUser,
  currentUserId,
  posts,
  onLike,
  onComment,
  onLikeComment,
  onEdit,
  onUpdateProfile,
}: ProfileRouteProps) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const user = resolveUser(userId);

  if (!user) {
    return (
      <ErrorPage
        title="Profil nie został znaleziony"
        description="Użytkownik, którego szukasz, może być niedostępny lub został usunięty."
        actionLabel="Powrót do listy postów"
        onAction={() => navigate("/")}
      />
    );
  }

  return (
    <ProfilePage
      user={user}
      posts={posts}
      isCurrentUser={user.id === currentUserId}
      onLike={onLike}
      onComment={onComment}
      onLikeComment={onLikeComment}
      onEdit={onEdit}
      onUpdateProfile={onUpdateProfile}
    />
  );
}
