import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { QuickActionCard } from './QuickActionCard';
import { StatCard } from './StatCard';
import { EnhancedMoodPicker } from './EnhancedMoodPicker';
import { SimpleMoodChart } from './MoodInsightChart';
import { ResourceCard } from './ResourceCard';
import { ActiveSessionCard } from './ActiveSessionCard';
import {
  MessageCircle,
  Calendar,
  Users,
  TrendingUp,
  BookOpen,
  Heart,
  Shield,
  Sparkles,
  Clock,
  Award,
  Activity,
  Bell,
  CheckCircle2,
} from 'lucide-react';

/**
 * 🎨 PREMIUM WELLNESS DASHBOARD
 * 
 * A world-class, calming, role-adaptive dashboard
 * Inspired by: Notion, Headspace, Airbnb, Stripe
 * 
 * Features:
 * - Beautiful, spacious design
 * - Role-adaptive content (Student, Peer, Counselor)
 * - Mood tracking with insights
 * - Quick actions with premium cards
 * - Active session management
 * - Resources & self-help
 * - Dark mode support
 * - Smooth animations
 */

export function EnhancedDashboard() {
  const { user, loading } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006341] mx-auto mb-4"></div>
          <p className="text-[#1A1A1A] font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // User not found state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFA]">
        <div className="text-center">
          <p className="text-[#1A1A1A] font-semibold">Unable to load user information</p>
        </div>
      </div>
    );
  }

  // Mock data - replace with real API calls
  const moodData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [3, 4, 3, 5, 4, 4, 5],
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Your mental health matters. Take it one day at a time. 🌟",
      "You're stronger than you think. We're here for you. 💚",
      "Small steps lead to big changes. Keep going! ✨",
      "It's okay to ask for help. That's what we're here for. 🤗",
      "You deserve peace, care, and support. Always. 💙",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="min-h-screen bg-[#F9FAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* ========== WELCOME HEADER SECTION ========== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-[#006341] mb-2">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                {getMotivationalQuote()}
              </p>
            </div>
            
            {/* Date & Time */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-4 rounded-2xl bg-white border border-gray-200 shadow-md"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#006341]" />
                <div>
                  <p className="text-sm font-bold text-[#1A1A1A]">
                    {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ========== MOOD CHECK SECTION ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-md">
            <EnhancedMoodPicker
              selectedMood={selectedMood || undefined}
              onMoodSelect={setSelectedMood}
            />
          </div>
        </motion.div>

        {/* ========== ACTIVE SUPPORT / UPCOMING SESSIONS ========== */}
        {user?.role === 'student' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-[#006341] mb-6 flex items-center gap-2">
              <Activity className="w-7 h-7 text-[#006341]" />
              Active Support
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Example active session - replace with real data */}
              <ActiveSessionCard
                type="chat"
                title="Private Support Chat"
                subtitle="Connected with a peer supporter"
                status="active"
                supporter="Sarah Johnson"
                time="Started 15 minutes ago"
                href="/support/my-rooms"
                onJoin={() => window.location.href = '/support/my-rooms'}
              />
              
              {/* Example upcoming appointment */}
              <ActiveSessionCard
                type="appointment"
                title="Counseling Session"
                subtitle="One-on-one session"
                status="scheduled"
                supporter="Dr. Michael Chen"
                time="Tomorrow at 2:00 PM"
                href="/mybookings"
              />
            </div>
          </motion.div>
        )}

        {/* ========== QUICK ACTIONS ROW ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#006341] mb-6 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-[#006341]" />
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.role === 'student' && (
              <>
                <QuickActionCard
                  title="Start a Chat"
                  description="Connect with a peer supporter or counselor in a private, safe space"
                  icon={MessageCircle}
                  href="/triage"
                  color="primary"
                  variant="default"
                />
                
                <QuickActionCard
                  title="Book a Session"
                  description="Schedule a one-on-one counseling session at your convenience"
                  icon={Calendar}
                  href="/student/booking"
                  color="secondary"
                  variant="default"
                />
                
                <QuickActionCard
                  title="View My Sessions"
                  description="See your upcoming appointments and past sessions"
                  icon={Clock}
                  href="/mybookings"
                  color="blue"
                  variant="default"
                />
              </>
            )}
            
            {(user?.role === 'moderator' || user?.role === 'counselor') && (
              <>
                <QuickActionCard
                  title="Support Queue"
                  description="View students waiting for support and claim chat rooms"
                  icon={Users}
                  href="/supporter/queue"
                  color="purple"
                  variant="large"
                  badge="Live"
                />
                
                <QuickActionCard
                  title="My Support Chats"
                  description="Access your active support conversations"
                  icon={MessageCircle}
                  href="/support/my-rooms"
                  color="primary"
                  variant="default"
                />
                
                <QuickActionCard
                  title="Today's Schedule"
                  description="View your appointments and availability"
                  icon={Calendar}
                  href="/manage-appointments"
                  color="blue"
                  variant="default"
                />
              </>
            )}
          </div>
        </motion.div>

        {/* ========== ANALYTICS & MOOD INSIGHTS ========== */}
        {user?.role === 'student' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-[#006341] mb-6 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-[#006341]" />
              Your Wellbeing Insights
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <StatCard
                title="Weekly Average"
                value="4.2"
                subtitle="Mood Score"
                change={12}
                changeLabel="vs last week"
                icon={Heart}
                color="green"
              />
              
              <StatCard
                title="Support Sessions"
                value="3"
                subtitle="This month"
                change={0}
                changeLabel="Same as last month"
                icon={MessageCircle}
                color="blue"
              />
              
              <StatCard
                title="Wellness Streak"
                value="7 days"
                subtitle="Keep it up!"
                icon={Award}
                color="purple"
              />
            </div>
            
            {/* Mood Chart */}
            <SimpleMoodChart data={moodData} />
          </motion.div>
        )}

        {/* ========== PEER/COUNSELOR STATS ========== */}
        {(user?.role === 'moderator' || user?.role === 'counselor') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-[#006341] mb-6 flex items-center gap-2">
              <Award className="w-7 h-7 text-[#006341]" />
              Your Impact
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Active Chats"
                value="2"
                icon={MessageCircle}
                color="blue"
              />
              
              <StatCard
                title="Students Helped"
                value="24"
                subtitle="This month"
                change={8}
                changeLabel="vs last month"
                icon={Users}
                color="purple"
              />
              
              <StatCard
                title="Avg Response"
                value="< 5 min"
                icon={Clock}
                color="green"
              />
              
              <StatCard
                title="Satisfaction"
                value="4.8"
                subtitle="Out of 5.0"
                icon={Award}
                color="orange"
              />
            </div>
          </motion.div>
        )}

        {/* ========== RESOURCES & SELF-HELP SECTION ========== */}
        {user?.role === 'student' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-[#006341] mb-6 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-[#006341]" />
              Resources & Self-Help
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard
                title="5-Minute Breathing Exercise"
                description="Calm your mind with guided breathing techniques"
                type="breathing"
                duration="5 min"
                tag="Popular"
                href="/resources/breathing"
              />
              
              <ResourceCard
                title="Understanding Anxiety"
                description="Learn about anxiety and how to manage it effectively"
                type="article"
                duration="8 min read"
                href="/resources/anxiety"
              />
              
              <ResourceCard
                title="Sleep Better Tonight"
                description="Guided meditation for restful sleep"
                type="audio"
                duration="15 min"
                href="/resources/sleep"
              />
              
              <ResourceCard
                title="Stress Management Guide"
                description="Practical techniques to handle academic stress"
                type="guide"
                duration="12 min read"
                href="/resources/stress"
              />
              
              <ResourceCard
                title="Building Healthy Habits"
                description="Short video on creating sustainable wellness routines"
                type="video"
                duration="6 min"
                href="/resources/habits"
              />
              
              <ResourceCard
                title="Campus Resources"
                description="Connect with counseling services and support groups"
                type="article"
                tag="Important"
                href="/resources/campus"
              />
            </div>
          </motion.div>
        )}

        {/* ========== NOTIFICATIONS & ANNOUNCEMENTS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#006341] mb-6 flex items-center gap-2">
            <Bell className="w-7 h-7 text-[#006341]" />
            Recent Updates
          </h2>
          
          <div className="space-y-4">
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-[#EADBA8] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-[#006341]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#1A1A1A] mb-1">
                  Your session was confirmed
                </h4>
                <p className="text-sm text-gray-600 font-medium">
                  Dr. Michael Chen confirmed your appointment for tomorrow at 2:00 PM
                </p>
                <span className="text-xs text-gray-600 mt-2 inline-block">
                  2 hours ago
                </span>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-[#EADBA8] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#FFD43B]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#1A1A1A] mb-1">
                  New wellness resources available
                </h4>
                <p className="text-sm text-gray-600 font-medium">
                  Check out our new guided meditation series for stress relief
                </p>
                <span className="text-xs text-gray-600 mt-2 inline-block">
                  1 day ago
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ========== PRIVACY & SUPPORT BANNER ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="rounded-3xl bg-[#F2E8C9] border border-[#DFC98A] p-8 shadow-md">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#006341] flex items-center justify-center shrink-0 shadow-lg">
                <Shield className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  Your Privacy & Safety
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 font-medium">
                  All conversations are completely private and confidential. Only you and your assigned 
                  supporter can see your messages. We use end-to-end encryption and follow strict privacy protocols 
                  to protect your information.
                </p>
                <a
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-[#006341] font-bold hover:gap-3 transition-all"
                >
                  Learn more about our privacy policy
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========== BECOME PEER SUPPORTER CTA ========== */}
        {user?.role === 'student' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <div className="rounded-3xl bg-[#F2E8C9] border border-[#DFC98A] p-8 text-center shadow-md">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#006341] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-bold text-[#1A1A1A] mb-3">
                  Want to Make a Difference?
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed font-medium text-lg">
                  Become a trained peer supporter and help fellow students through their challenges. 
                  It's rewarding, flexible, and makes a real impact on campus.
                </p>
                <a
                  href="/become-peer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#006341] hover:bg-[#007A52] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Learn More
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
