import { User } from '../App';
import { Bookmark, Users, Calendar } from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  onViewProfile: (userId: string) => void;
}

export function Sidebar({ currentUser, onViewProfile }: SidebarProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onViewProfile(currentUser.id)}>
        <div className="h-16 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="px-4 pb-4 -mt-8">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full border-4 border-white"
          />
          <h3 className="mt-2">{currentUser.name}</h3>
          {currentUser.title && (
            <p className="text-sm text-gray-600 mt-1">{currentUser.title}</p>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Wyświetlenia profilu</span>
              <span className="text-blue-600">247</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Połączenia</span>
              <span className="text-blue-600">532</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-3">
          <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 w-full transition-colors">
            <Bookmark className="w-5 h-5" />
            <span className="text-sm">Zapisane posty</span>
          </button>
          <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 w-full transition-colors">
            <Users className="w-5 h-5" />
            <span className="text-sm">Moje grupy</span>
          </button>
          <button className="flex items-center gap-3 text-gray-700 hover:text-blue-600 w-full transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Wydarzenia</span>
          </button>
        </div>
      </div>
    </div>
  );
}
