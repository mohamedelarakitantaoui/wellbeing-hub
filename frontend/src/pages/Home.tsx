import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MoodPicker } from '../components/MoodPicker';
import { QuickActionButton } from '../components/QuickActionButton';
import { 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  BookOpen,
  Heart,
  Users
} from 'lucide-react';

export function Home() {
  const { user } = useAuth();
  const [todayMood, setTodayMood] = useState<number>();
  const isStudent = user?.role === 'student';
  const isPeerSupporter = user?.role === 'moderator'; // peer supporters use moderator role
  const isCounselor = user?.role === 'counselor' || user?.role === 'admin';

  const handleMoodSelect = (mood: number) => {
    setTodayMood(mood);
    // TODO: Save mood to backend
    console.log('Mood selected:', mood);
  };

  const firstName = user?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <section className="animate-fade-in-up">
          <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">
            Hi, {firstName} 👋
          </h1>
          <p className="text-text-secondary">How are you feeling today?</p>
          
          <div className="mt-4 p-6 bg-white rounded-2xl shadow-sm">
            <MoodPicker onMoodSelect={handleMoodSelect} selectedMood={todayMood} />
          </div>
        </section>

        {/* Primary CTA - Student View */}
        {isStudent && (
          <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-primary rounded-2xl p-8 text-white text-center shadow-lg">
              <Heart className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Need to talk?</h2>
              <p className="text-primary-light mb-6">
                Connect with a trained supporter in a safe, private space
              </p>
              <QuickActionButton
                icon={MessageCircle}
                label="I need to talk now"
                to="/triage"
                variant="outline"
                size="lg"
              />
            </div>
          </section>
        )}

        {/* Peer Supporter Status */}
        {isPeerSupporter && (
          <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-accent/10 border-2 border-accent rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-accent-dark" />
                  <h2 className="text-lg font-semibold text-text">Peer Supporter</h2>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-text-secondary">Available</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-success rounded-full peer transition-all"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                </label>
              </div>
              <QuickActionButton
                icon={MessageCircle}
                label="View Support Requests"
                to="/supporter/queue"
                variant="secondary"
              />
            </div>
          </section>
        )}

        {/* Counselor Dashboard Link */}
        {isCounselor && (
          <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-primary/10 border-2 border-primary rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-text mb-4">Counselor Dashboard</h2>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionButton
                  icon={MessageCircle}
                  label="Active Chats"
                  to="/support/my-rooms"
                  variant="secondary"
                />
                <QuickActionButton
                  icon={Users}
                  label="Support Queue"
                  to="/supporter/queue"
                  variant="secondary"
                />
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        {isStudent && (
          <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-semibold text-text mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <ActionCard
                icon={MessageCircle}
                title="My Chats"
                description="View conversations"
                to="/support/my-rooms"
              />
              <ActionCard
                icon={Calendar}
                title="Book Session"
                description="Schedule with counselor"
                to="/booking"
              />
              <ActionCard
                icon={TrendingUp}
                title="My Progress"
                description="View mood history"
                to="/progress"
              />
              <ActionCard
                icon={BookOpen}
                title="Resources"
                description="Self-care exercises"
                to="/resources"
              />
            </div>
          </section>
        )}

        {/* Privacy Banner */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-accent-dark mb-1 flex items-center gap-2">
              🔒 Your Privacy Matters
            </h3>
            <p className="text-xs text-text-secondary">
              All conversations are completely confidential. Only you and your assigned supporter can see your messages.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
}

function ActionCard({ icon: Icon, title, description, to }: ActionCardProps) {
  return (
    <a
      href={to}
      className="card p-4 hover:shadow-md transition-all group"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-semibold text-text text-sm mb-1">{title}</h3>
      <p className="text-xs text-text-secondary">{description}</p>
    </a>
  );
}
