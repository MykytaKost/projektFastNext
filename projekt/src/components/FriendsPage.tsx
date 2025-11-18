import { useState } from 'react';
import { Search, UserPlus, UserMinus, Check, X, Users as UsersIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export interface User {
  id: string;
  name: string;
  avatar: string;
  title?: string;
}

export interface FriendRequest {
  id: string;
  from: User;
  timestamp: Date;
}

interface FriendsPageProps {
  currentUser: User;
  friends: User[];
  friendRequests: FriendRequest[];
  allUsers: User[];
  onAddFriend: (userId: string) => void;
  onRemoveFriend: (userId: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onViewProfile: (userId: string) => void;
}

export function FriendsPage({
  currentUser,
  friends,
  friendRequests,
  allUsers,
  onAddFriend,
  onRemoveFriend,
  onAcceptRequest,
  onRejectRequest,
  onViewProfile
}: FriendsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const friendIds = new Set(friends.map(f => f.id));
  const pendingRequestIds = new Set(friendRequests.map(r => r.from.id));

  const filteredUsers = allUsers.filter(user => {
    if (user.id === currentUser.id) return false;
    if (!searchQuery.trim()) return false;
    
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = user.name.toLowerCase().includes(searchLower);
    const titleMatch = user.title?.toLowerCase().includes(searchLower);
    
    return nameMatch || titleMatch;
  });

  const filteredFriends = friends.filter(friend => {
    if (!searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = friend.name.toLowerCase().includes(searchLower);
    const titleMatch = friend.title?.toLowerCase().includes(searchLower);
    
    return nameMatch || titleMatch;
  });

  const getUserStatus = (userId: string) => {
    if (friendIds.has(userId)) return 'friend';
    if (pendingRequestIds.has(userId)) return 'pending';
    return 'none';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="mb-4">Znajomi</h2>
          
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Szukaj znajomych lub użytkowników..."
              className="bg-transparent border-none outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b px-6">
            <TabsTrigger value="all">
              Wszyscy znajomi ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Zaproszenia ({friendRequests.length})
            </TabsTrigger>
            <TabsTrigger value="search">
              Wyszukaj użytkowników
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-6">
            {filteredFriends.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'Nie znaleziono znajomych' : 'Nie masz jeszcze znajomych'}
                </p>
                {!searchQuery && (
                  <p className="text-sm text-gray-400 mt-2">
                    Przejdź do zakładki "Wyszukaj użytkowników" aby dodać znajomych
                  </p>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredFriends.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-14 h-14 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => onViewProfile(friend.id)}
                      />
                      <div className="flex-1">
                        <h4 
                          className="cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => onViewProfile(friend.id)}
                        >
                          {friend.name}
                        </h4>
                        {friend.title && (
                          <p className="text-sm text-gray-600">{friend.title}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => onRemoveFriend(friend.id)}
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Usuń
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="p-6">
            {friendRequests.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Brak oczekujących zaproszeń</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {friendRequests.map(request => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={request.from.avatar}
                        alt={request.from.name}
                        className="w-14 h-14 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => onViewProfile(request.from.id)}
                      />
                      <div className="flex-1">
                        <h4 
                          className="cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => onViewProfile(request.from.id)}
                        >
                          {request.from.name}
                        </h4>
                        {request.from.title && (
                          <p className="text-sm text-gray-600">{request.from.title}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(request.timestamp).toLocaleDateString('pl-PL')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        onClick={() => onAcceptRequest(request.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Zaakceptuj
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onRejectRequest(request.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Odrzuć
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="p-6">
            {!searchQuery ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Wpisz nazwę użytkownika aby wyszukać</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nie znaleziono użytkowników</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredUsers.map(user => {
                  const status = getUserStatus(user.id);
                  
                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-14 h-14 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => onViewProfile(user.id)}
                        />
                        <div className="flex-1">
                          <h4 
                            className="cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => onViewProfile(user.id)}
                          >
                            {user.name}
                          </h4>
                          {user.title && (
                            <p className="text-sm text-gray-600">{user.title}</p>
                          )}
                        </div>
                      </div>
                      {status === 'friend' ? (
                        <Button
                          variant="outline"
                          onClick={() => onRemoveFriend(user.id)}
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Usuń
                        </Button>
                      ) : status === 'pending' ? (
                        <Button variant="secondary" disabled>
                          Oczekuje
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          onClick={() => onAddFriend(user.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Dodaj
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
