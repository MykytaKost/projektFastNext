import { UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  title: string;
  mutualFriends: number;
}

interface FriendsSuggestionsProps {
  onViewProfile: (userId: string) => void;
}

export function FriendsSuggestions({ onViewProfile }: FriendsSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Friend[]>([
    {
      id: 'f1',
      name: 'Katarzyna Nowak',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
      title: 'UX Designer @ Creative Studio',
      mutualFriends: 8
    },
    {
      id: 'f2',
      name: 'Michał Kowalczyk',
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop',
      title: 'Frontend Developer',
      mutualFriends: 12
    },
    {
      id: 'f3',
      name: 'Aleksandra Wojciechowska',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      title: 'Product Manager @ TechCorp',
      mutualFriends: 5
    },
    {
      id: 'f4',
      name: 'Paweł Dąbrowski',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      title: 'DevOps Engineer',
      mutualFriends: 15
    }
  ]);

  const handleConnect = (friendId: string) => {
    setSuggestions(suggestions.filter(f => f.id !== friendId));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3>Sugestie znajomych</h3>
      </div>
      
      <div className="space-y-4">
        {suggestions.map(friend => (
          <div key={friend.id} className="flex items-start gap-3">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onViewProfile(friend.id)}
            />
            <div className="flex-1 min-w-0">
              <h4 
                className="text-sm cursor-pointer hover:text-blue-600 transition-colors truncate"
                onClick={() => onViewProfile(friend.id)}
              >
                {friend.name}
              </h4>
              <p className="text-xs text-gray-600 truncate">{friend.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {friend.mutualFriends} wspólnych znajomych
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => handleConnect(friend.id)}
              >
                <UserPlus className="w-3 h-3 mr-1" />
                Połącz
              </Button>
            </div>
          </div>
        ))}
        
        {suggestions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Brak nowych sugestii
          </p>
        )}
      </div>
    </div>
  );
}
