import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Heart, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { MoodPicker } from '../../components/MoodPicker';
import { api } from '../../lib/api';

interface MoodEntry {
  date: string;
  moodScore: number;
  note?: string;
}

export function StudentProgress() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<7 | 30>(7);
  const [todayMood, setTodayMood] = useState<number>();
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMoodHistory();
  }, [timeRange]);

  const fetchMoodHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMoodHistory(timeRange);
      setMoodHistory(data.moods || []);
    } catch (err: any) {
      console.error('Failed to fetch mood history:', err);
      setError('Failed to load mood history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSave = async () => {
    if (!todayMood) return;

    try {
      setSaving(true);
      await api.saveMood(todayMood);
      setSuccessMessage('Mood saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh history
      await fetchMoodHistory();
      setTodayMood(undefined);
    } catch (err: any) {
      console.error('Failed to save mood:', err);
      setError('Failed to save mood. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const averageMood = moodHistory.length > 0
    ? moodHistory.reduce((acc, entry) => acc + entry.moodScore, 0) / moodHistory.length
    : 0;
  
  const trend = moodHistory.length >= 2
    ? moodHistory[moodHistory.length - 1].moodScore > moodHistory[0].moodScore 
      ? 'up' 
      : moodHistory[moodHistory.length - 1].moodScore < moodHistory[0].moodScore 
      ? 'down' 
      : 'stable'
    : 'stable';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Progress</h1>
        <p className="text-gray-600">
          Track your mood and wellbeing journey
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800 font-medium text-center">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Log Today's Mood */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          How are you feeling today?
        </h2>
        <MoodPicker onMoodSelect={setTodayMood} selectedMood={todayMood} />
        {todayMood && (
          <button
            onClick={handleMoodSave}
            disabled={saving}
            className="btn-primary mt-4 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Today\'s Mood'
            )}
          </button>
        )}
      </section>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimeRange(7)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeRange === 7
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Last 7 Days
        </button>
        <button
          onClick={() => setTimeRange(30)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeRange === 30
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Last 30 Days
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-gray-500 mt-4">Loading your progress...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Average Mood</div>
              <div className="text-3xl font-bold text-blue-600">{averageMood.toFixed(1)}</div>
              <div className="text-xs text-gray-500 mt-1">out of 5</div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Trend</div>
              <div className="flex items-center gap-2">
                {trend === 'up' && (
                  <>
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <span className="text-xl font-bold text-green-600">Improving</span>
                  </>
                )}
                {trend === 'down' && (
                  <>
                    <TrendingDown className="w-6 h-6 text-red-600" />
                    <span className="text-xl font-bold text-red-600">Declining</span>
                  </>
                )}
                {trend === 'stable' && (
                  <>
                    <Minus className="w-6 h-6 text-yellow-600" />
                    <span className="text-xl font-bold text-yellow-600">Stable</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mood Timeline */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mood Timeline</h2>
            {moodHistory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No mood data yet. Start tracking your mood to see your progress!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {moodHistory.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-xs text-gray-500 w-20">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 h-6 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            entry.moodScore === 5 ? 'bg-green-500' :
                            entry.moodScore === 4 ? 'bg-blue-500' :
                            entry.moodScore === 3 ? 'bg-yellow-500' :
                            entry.moodScore === 2 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${entry.moodScore * 20}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium text-gray-900 w-8 text-right">
                        {entry.moodScore}/5
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Insights */}
          {moodHistory.length > 0 && (
            <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Insights</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• You've logged {moodHistory.length} mood entries in the last {timeRange} days</li>
                {averageMood >= 4 && <li>• You're doing great! Keep up the positive momentum</li>}
                {averageMood < 3 && <li>• Consider reaching out to a counselor for support</li>}
                {trend === 'up' && <li>• Your mood is trending upward - great progress!</li>}
              </ul>
            </section>
          )}

          {/* Self-Care Reminder */}
          <section className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">🌟 Self-Care Tips</h3>
            <ul className="space-y-2 text-sm text-purple-800">
              <li>• Take 5 minutes for deep breathing exercises</li>
              <li>• Stay connected with friends and family</li>
              <li>• Get enough sleep and maintain a regular schedule</li>
              <li>• Engage in activities you enjoy</li>
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
