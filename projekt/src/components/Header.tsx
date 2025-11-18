import { Home, MessageSquare, Bell, Search, X, Users } from 'lucide-react';
import { User } from '../App';

interface HeaderProps {
  currentUser: User;
  onViewProfile: (userId: string) => void;
  onBackToFeed: () => void;
  onViewFriends: () => void;
  currentView: 'feed' | 'profile' | 'friends';
  searchQuery: string;
  onSearchChange: (query: string) => void;
  pendingRequestsCount?: number;
}

export function Header({ currentUser, onViewProfile, onBackToFeed, onViewFriends, currentView, searchQuery, onSearchChange, pendingRequestsCount = 0 }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-blue-600 cursor-pointer" onClick={onBackToFeed}>SocialHub</h1>
            
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 max-w-xs flex-1 relative">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Szukaj postów..."
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <button 
              onClick={onBackToFeed}
              className={`flex flex-col items-center px-4 py-2 transition-colors ${
                currentView === 'feed' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1 hidden sm:block">Strona główna</span>
            </button>
            <button 
              onClick={onViewFriends}
              className={`flex flex-col items-center px-4 py-2 transition-colors relative ${
                currentView === 'friends' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Users className="w-5 h-5" />
              {pendingRequestsCount > 0 && (
                <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
              <span className="text-xs mt-1 hidden sm:block">Znajomi</span>
            </button>
            <button className="flex flex-col items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs mt-1 hidden sm:block">Wiadomości</span>
            </button>
            <button className="flex flex-col items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-xs mt-1 hidden sm:block">Powiadomienia</span>
            </button>
            
            <div className="ml-2 pl-2 border-l border-gray-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onViewProfile(currentUser.id)}
              />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
