import { useState } from 'react';
import { MoodPicker } from '../components/MoodPicker';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: number;
  note?: string;
}

const mockData: MoodEntry[] = [
  { date: '2025-11-09', mood: 3, note: 'Okay day' },
  { date: '2025-11-10', mood: 2, note: 'Stressed about exams' },
  { date: '2025-11-11', mood: 2 },
  { date: '2025-11-12', mood: 4, note: 'Talked to supporter, felt better' },
  { date: '2025-11-13', mood: 3 },
  { date: '2025-11-14', mood: 4 },
  { date: '2025-11-15', mood: 3 },
];

export function Progress() {
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
  const [todayMood, setTodayMood] = useState<number>();

  const data = timeRange === '7' ? mockData : mockData; // TODO: Load different ranges
  const averageMood = data.reduce((acc, entry) => acc + entry.mood, 0) / data.length;
  const trend = data[data.length - 1].mood > data[0].mood ? 'up' : 
                data[data.length - 1].mood < data[0].mood ? 'down' : 'stable';

  const handleMoodSave = () => {
    if (todayMood) {
      // TODO: Save to backend
      alert('Mood saved!');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">My Progress</h1>
          <p className="text-text-secondary">
            Track your mood and wellbeing journey
          </p>
        </div>

        {/* Log Today's Mood */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">How are you feeling today?</h2>
          <MoodPicker onMoodSelect={setTodayMood} selectedMood={todayMood} />
          {todayMood && (
            <button
              onClick={handleMoodSave}
              className="btn-primary mt-4 w-full"
            >
              Save Today's Mood
            </button>
          )}
        </section>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('7')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === '7'
                ? 'bg-primary text-white'
                : 'bg-white text-fg-primary hover:bg-bg-hover'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === '30'
                ? 'bg-primary text-white'
                : 'bg-white text-fg-primary hover:bg-bg-hover'
            }`}
          >
            Last 30 Days
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="text-sm text-text-secondary mb-1">Average Mood</div>
            <div className="text-3xl font-bold text-primary">{averageMood.toFixed(1)}</div>
          </div>
          
          <div className="card p-5">
            <div className="text-sm text-text-secondary mb-1">Trend</div>
            <div className="flex items-center gap-2">
              {trend === 'up' && (
                <>
                  <TrendingUp className="w-6 h-6 text-success" />
                  <span className="text-xl font-bold text-success">Improving</span>
                </>
              )}
              {trend === 'down' && (
                <>
                  <TrendingDown className="w-6 h-6 text-danger" />
                  <span className="text-xl font-bold text-danger">Declining</span>
                </>
              )}
              {trend === 'stable' && (
                <>
                  <Minus className="w-6 h-6 text-warning" />
                  <span className="text-xl font-bold text-warning">Stable</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mood Chart (Simple Bar Chart) */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Mood Timeline</h2>
          <div className="space-y-3">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="text-xs text-fg-secondary w-20">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-subtle h-6 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        entry.mood === 5 ? 'bg-mood-5' :
                        entry.mood === 4 ? 'bg-mood-4' :
                        entry.mood === 3 ? 'bg-mood-3' :
                        entry.mood === 2 ? 'bg-mood-2' :
                        'bg-mood-1'
                      }`}
                      style={{ width: `${entry.mood * 20}%` }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-fg-primary w-8 text-right">
                    {entry.mood}/5
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insights */}
        <section className="card p-6 bg-primary/5 border border-primary/20">
          <h3 className="text-lg font-semibold text-text mb-3">💡 Insights</h3>
          <ul className="space-y-2 text-sm text-fg-secondary">
            <li>• You've been most active on weekdays</li>
            <li>• Your mood improved after talking to supporters</li>
            <li>• Consider trying the breathing exercise when feeling stressed</li>
          </ul>
        </section>

        {/* Quick Resources */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-text">Self-Care Exercises</h2>
          <div className="grid gap-3">
            <ResourceCard
              emoji="🧘"
              title="5-Minute Breathing"
              description="Calm your mind with guided breathing"
            />
            <ResourceCard
              emoji="📝"
              title="Gratitude Journal"
              description="Write down 3 things you're grateful for"
            />
            <ResourceCard
              emoji="🎵"
              title="Relaxing Sounds"
              description="Nature sounds and ambient music"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ResourceCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <button className="card p-4 text-left hover:shadow-md transition-all group">
      <div className="flex items-center gap-3">
        <div className="text-3xl">{emoji}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-text">{title}</h3>
          <p className="text-sm text-fg-secondary">{description}</p>
        </div>
        <div className="text-fg-muted group-hover:text-primary transition-colors">→</div>
      </div>
    </button>
  );
}
