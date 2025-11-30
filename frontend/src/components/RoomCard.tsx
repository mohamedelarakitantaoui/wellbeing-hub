import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MessageCircle, Shield } from 'lucide-react';

interface RoomCardProps {
  slug: string;
  title: string;
  topic: string;
  isMinorSafe: boolean;
  messageCount?: number;
}

export function RoomCard({ slug, title, topic, isMinorSafe, messageCount }: RoomCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-3xl border border-primary-100/50 hover:border-primary-400"
      onClick={() => navigate(`/rooms/${slug}`)}
    >
      <CardHeader className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-primary-700 mb-2">
              {title}
            </CardTitle>
            <CardDescription className="mt-2 text-base text-text-secondary leading-relaxed">
              {topic}
            </CardDescription>
          </div>
          {isMinorSafe && (
            <Badge variant="secondary" className="ml-3 bg-accent-success/15 text-accent-success hover:bg-accent-success/25 border border-accent-success/30 font-semibold px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4 mr-1.5" />
              Minor Safe
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex items-center text-base text-text-muted font-medium">
          <MessageCircle className="w-5 h-5 mr-2 text-secondary-teal" />
          <span>{messageCount || 0} messages</span>
        </div>
      </CardContent>
    </Card>
  );
}
