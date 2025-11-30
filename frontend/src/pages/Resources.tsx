import { Heart, Brain, Moon, Wind, Music } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  duration?: string;
  icon: React.ElementType;
  type: 'exercise' | 'article' | 'audio' | 'video';
}

const resources: Resource[] = [
  {
    id: '1',
    title: '5-Minute Breathing Exercise',
    description: 'Calm your mind and reduce anxiety with guided breathing',
    category: 'Mindfulness',
    duration: '5 min',
    icon: Wind,
    type: 'exercise',
  },
  {
    id: '2',
    title: 'Better Sleep Guide',
    description: 'Tips for improving sleep quality during stressful times',
    category: 'Sleep',
    duration: '3 min read',
    icon: Moon,
    type: 'article',
  },
  {
    id: '3',
    title: 'Gratitude Journal',
    description: 'Daily practice to focus on positive moments',
    category: 'Wellness',
    icon: Heart,
    type: 'exercise',
  },
  {
    id: '4',
    title: 'Managing Exam Stress',
    description: 'Evidence-based strategies for academic pressure',
    category: 'Academic',
    duration: '8 min read',
    icon: Brain,
    type: 'article',
  },
  {
    id: '5',
    title: 'Relaxing Sounds',
    description: 'Nature sounds and ambient music for calm',
    category: 'Mindfulness',
    duration: '15 min',
    icon: Music,
    type: 'audio',
  },
  {
    id: '6',
    title: 'Understanding Anxiety',
    description: 'Learn what anxiety is and how to manage it',
    category: 'Mental Health',
    duration: '5 min read',
    icon: Brain,
    type: 'article',
  },
];

export function Resources() {
  const categories = Array.from(new Set(resources.map(r => r.category)));

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Resources</h1>
          <p className="text-text-secondary">
            Self-care exercises and helpful information
          </p>
        </div>

        {/* Featured Resource */}
        <div className="card p-6 bg-primary text-white">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Wind className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Featured</span>
              <h2 className="text-xl font-bold mt-2 mb-2">Quick Calm: 5-Minute Breathing</h2>
              <p className="text-primary-light mb-4">
                Feeling overwhelmed? Take 5 minutes to reset with guided breathing.
              </p>
              <button className="bg-white text-primary px-6 py-2 rounded-full font-semibold hover:bg-bg-hover transition-colors">
                Start Now
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-primary text-white rounded-full font-medium whitespace-nowrap">
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-white text-fg-primary rounded-full font-medium whitespace-nowrap hover:bg-bg-hover transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {/* Emergency Support */}
        <div className="card p-6 bg-danger/5 border border-danger/20">
          <h3 className="text-lg font-semibold text-danger mb-2 flex items-center gap-2">
            🚨 Need Immediate Help?
          </h3>
          <p className="text-fg-secondary mb-4">
            If you're in crisis or need urgent support, please reach out immediately.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-fg-primary font-medium">Emergency Services</span>
              <span className="text-danger font-bold">999</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-fg-primary font-medium">AUI Crisis Line</span>
              <span className="text-danger font-bold">+212 5XX-XXXXX</span>
            </div>
          </div>
        </div>

        {/* Wellness Tips */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">💡 Daily Wellness Tips</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-fg-secondary">Take regular breaks while studying - your brain needs rest</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-fg-secondary">Connect with friends, even a quick chat can boost your mood</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-fg-secondary">Physical activity helps reduce stress - even a short walk counts</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl">•</span>
              <span className="text-fg-secondary">Maintain a consistent sleep schedule, especially during exams</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const typeColors = {
    exercise: 'bg-success/10 text-success',
    article: 'bg-primary/10 text-primary',
    audio: 'bg-accent/10 text-accent',
    video: 'bg-warning/10 text-warning',
  };

  return (
    <button className="card p-5 text-left hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
          <resource.icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[resource.type]}`}>
              {resource.type}
            </span>
            {resource.duration && (
              <span className="text-xs text-fg-muted">• {resource.duration}</span>
            )}
          </div>
          <h3 className="font-semibold text-text mb-1">{resource.title}</h3>
          <p className="text-sm text-fg-secondary mb-2">{resource.description}</p>
          <span className="text-xs text-primary font-medium">Start →</span>
        </div>
      </div>
    </button>
  );
}
