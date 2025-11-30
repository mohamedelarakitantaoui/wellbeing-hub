import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

const topicOptions: Array<{ id: 'stress' | 'sleep' | 'anxiety' | 'academic' | 'relationship' | 'family' | 'health' | 'other'; label: string; emoji: string; description: string }> = [
  { id: 'stress', label: 'Stress', emoji: '😰', description: 'Feeling overwhelmed or pressured' },
  { id: 'sleep', label: 'Sleep Issues', emoji: '😴', description: 'Trouble sleeping or staying asleep' },
  { id: 'anxiety', label: 'Anxiety', emoji: '💭', description: 'Worried, nervous, or restless feelings' },
  { id: 'academic', label: 'Academic', emoji: '📚', description: 'School work or study challenges' },
  { id: 'relationship', label: 'Relationships', emoji: '💑', description: 'Friends, dating, or social issues' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧', description: 'Family dynamics or concerns' },
  { id: 'health', label: 'Health', emoji: '🏥', description: 'Physical or mental health concerns' },
  { id: 'other', label: 'Other', emoji: '💬', description: 'Something else on your mind' },
];

/**
 * 💬 Enhanced Chat Start - Calm Onboarding Flow
 * Inspired by Wysa, Headspace onboarding
 */
export function ChatStart() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'topic' | 'mood' | 'urgency' | 'message' | 'creating'>('topic');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [moodScore, setMoodScore] = useState<number>(5);
  const [selectedUrgency, setSelectedUrgency] = useState<'low' | 'medium' | 'high' | 'crisis'>('medium');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setError('');
  };

  const handleContinueFromTopic = () => {
    if (selectedTopic) {
      setStep('mood');
    }
  };

  const handleContinueFromMood = () => {
    setStep('urgency');
  };

  const handleContinueFromUrgency = () => {
    setStep('message');
  };

  const handleStartChat = async () => {
    if (!selectedTopic) return;
    
    setStep('creating');
    setError('');

    try {
      const { room } = await api.requestSupport({
        topic: selectedTopic as any,
        urgency: selectedUrgency,
        initialMessage: message.trim() || undefined,
      });

      // Navigate to the support room
      navigate(`/support/${room.id}`);
    } catch (err: any) {
      console.error('Failed to create support request:', err);
      setError(err.message || 'Failed to create support request. Please try again.');
      setStep('message');
    }
  };

  const goBack = () => {
    if (step === 'mood') setStep('topic');
    else if (step === 'urgency') setStep('mood');
    else if (step === 'message') setStep('urgency');
  };

  const getMoodEmoji = (score: number) => {
    if (score <= 2) return '😢';
    if (score <= 4) return '😕';
    if (score <= 6) return '😐';
    if (score <= 8) return '🙂';
    return '😊';
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-bg-white via-bg to-bg-subtle flex items-center justify-center px-4 pb-20 md:pb-8 py-8">
      <div className="w-full max-w-2xl">
        
        {/* Progress indicator */}
        {step !== 'creating' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-fg-secondary">
                Step {step === 'topic' ? 1 : step === 'mood' ? 2 : step === 'urgency' ? 3 : 4} of 4
              </span>
              {step !== 'topic' && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-linear-to-r from-primary to-accent transition-all duration-500 ease-out"
                style={{ 
                  width: step === 'topic' ? '25%' : step === 'mood' ? '50%' : step === 'urgency' ? '75%' : '100%' 
                }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Choose Topic */}
        {step === 'topic' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-fg mb-4">
                What's on your mind?
              </h1>
              <p className="text-lg text-fg-secondary">
                Choose what you'd like to talk about today
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {topicOptions.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className={`
                    group relative p-5 rounded-2xl text-left transition-all duration-200
                    ${selectedTopic === topic.id
                      ? 'bg-primary text-white shadow-xl scale-[1.02] ring-2 ring-primary ring-offset-2'
                      : 'bg-white hover:bg-bg-hover shadow-md hover:shadow-lg hover:scale-[1.01]'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl shrink-0">{topic.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-lg mb-1 ${
                        selectedTopic === topic.id ? 'text-white' : 'text-fg'
                      }`}>
                        {topic.label}
                      </div>
                      <p className={`text-sm ${
                        selectedTopic === topic.id ? 'text-white/90' : 'text-fg-secondary'
                      }`}>
                        {topic.description}
                      </p>
                    </div>
                    {selectedTopic === topic.id && (
                      <div className="text-2xl shrink-0">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleContinueFromTopic}
              disabled={!selectedTopic}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continue
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Step 2: Mood Score (1-10) */}
        {step === 'mood' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-bounce-in">{getMoodEmoji(moodScore)}</div>
              <h1 className="text-4xl font-bold text-fg mb-4">
                How are you feeling?
              </h1>
              <p className="text-lg text-fg-secondary">
                Rate your current mood on a scale of 1-10
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="mb-8">
                <div className="flex justify-between items-baseline text-sm text-fg-secondary mb-4">
                  <span>Very low</span>
                  <span className="text-5xl font-bold text-primary animate-scale-in">
                    {moodScore}
                  </span>
                  <span>Excellent</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodScore}
                  onChange={(e) => setMoodScore(Number(e.target.value))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      #EF4444 0%, 
                      #F59E0B ${(moodScore - 1) * 11.11}%, 
                      #10B981 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-fg-muted mt-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMoodScore(num)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        moodScore === num 
                          ? 'bg-primary text-white font-bold scale-110' 
                          : 'hover:bg-bg-hover'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleContinueFromMood}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
            >
              Continue
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Step 3: Choose Urgency */}
        {step === 'urgency' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-fg mb-4">
                How urgent is this?
              </h1>
              <p className="text-lg text-fg-secondary">
                This helps us prioritize and connect you faster
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <button
                onClick={() => setSelectedUrgency('low')}
                className={`
                  w-full p-6 rounded-2xl text-left transition-all duration-200
                  ${selectedUrgency === 'low'
                    ? 'bg-green-500 text-white shadow-xl scale-[1.02] ring-2 ring-green-500 ring-offset-2'
                    : 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl shrink-0">🟢</div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-xl mb-1 ${
                      selectedUrgency === 'low' ? 'text-white' : 'text-fg'
                    }`}>
                      Low - I can wait
                    </h3>
                    <p className={`text-sm ${
                      selectedUrgency === 'low' ? 'text-white/90' : 'text-fg-secondary'
                    }`}>
                      Non-urgent support, I'm okay for now
                    </p>
                  </div>
                  {selectedUrgency === 'low' && (
                    <div className="text-3xl shrink-0">✓</div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedUrgency('medium')}
                className={`
                  w-full p-6 rounded-2xl text-left transition-all duration-200
                  ${selectedUrgency === 'medium'
                    ? 'bg-yellow-500 text-white shadow-xl scale-[1.02] ring-2 ring-yellow-500 ring-offset-2'
                    : 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl shrink-0">🟡</div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-xl mb-1 ${
                      selectedUrgency === 'medium' ? 'text-white' : 'text-fg'
                    }`}>
                      Medium - Important
                    </h3>
                    <p className={`text-sm ${
                      selectedUrgency === 'medium' ? 'text-white/90' : 'text-fg-secondary'
                    }`}>
                      I'd like to talk soon, within a few hours
                    </p>
                  </div>
                  {selectedUrgency === 'medium' && (
                    <div className="text-3xl shrink-0">✓</div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedUrgency('high')}
                className={`
                  w-full p-6 rounded-2xl text-left transition-all duration-200
                  ${selectedUrgency === 'high'
                    ? 'bg-orange-500 text-white shadow-xl scale-[1.02] ring-2 ring-orange-500 ring-offset-2'
                    : 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl shrink-0">🟠</div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-xl mb-1 ${
                      selectedUrgency === 'high' ? 'text-white' : 'text-fg'
                    }`}>
                      High - Urgent
                    </h3>
                    <p className={`text-sm ${
                      selectedUrgency === 'high' ? 'text-white/90' : 'text-fg-secondary'
                    }`}>
                      I need help soon, feeling distressed
                    </p>
                  </div>
                  {selectedUrgency === 'high' && (
                    <div className="text-3xl shrink-0">✓</div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedUrgency('crisis')}
                className={`
                  w-full p-6 rounded-2xl text-left transition-all duration-200 border-2
                  ${selectedUrgency === 'crisis'
                    ? 'bg-red-600 text-white shadow-2xl scale-[1.02] ring-2 ring-red-600 ring-offset-2 border-red-600'
                    : 'bg-white hover:bg-red-50 shadow-md hover:shadow-lg border-red-200'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl shrink-0">🔴</div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-xl mb-1 ${
                      selectedUrgency === 'crisis' ? 'text-white' : 'text-red-600'
                    }`}>
                      Crisis - Immediate Help
                    </h3>
                    <p className={`text-sm ${
                      selectedUrgency === 'crisis' ? 'text-white/90' : 'text-red-600'
                    }`}>
                      I need immediate support right now
                    </p>
                  </div>
                  {selectedUrgency === 'crisis' && (
                    <div className="text-3xl shrink-0">✓</div>
                  )}
                </div>
              </button>
            </div>

            <button
              onClick={handleContinueFromUrgency}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
            >
              Continue
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Step 4: Optional Message */}
        {step === 'message' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-fg mb-4">
                Share what's on your mind
              </h1>
              <p className="text-lg text-fg-secondary">
                This helps your supporter understand how to best help you (optional)
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl animate-shake">
                {error}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's been on your mind? Feel free to share as much or as little as you'd like..."
                className="w-full min-h-[180px] p-4 border border-border-light rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary resize-none text-fg placeholder:text-fg-muted transition-all"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-fg-muted">
                  Everything you share is private and confidential
                </span>
                <span className={`text-sm font-medium ${
                  message.length > 900 ? 'text-accent-warning' : 'text-fg-secondary'
                }`}>
                  {message.length}/1000
                </span>
              </div>
            </div>

            <button
              onClick={handleStartChat}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
            >
              {message.trim() ? 'Send & Start Chat' : 'Start Chat'}
              <ChevronRight className="w-6 h-6" />
            </button>

            <button
              onClick={handleStartChat}
              className="w-full mt-3 text-fg-secondary hover:text-primary text-sm transition-colors"
            >
              Skip this step →
            </button>
          </div>
        )}

        {/* Step 5: Creating Support Request */}
        {step === 'creating' && (
          <div className="animate-scale-in text-center">
            <div className="bg-white rounded-3xl p-12 shadow-2xl">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <Loader2 className="w-20 h-20 text-primary animate-spin" />
              </div>
              <h1 className="text-3xl font-bold text-fg mb-4">
                Connecting you to support...
              </h1>
              <p className="text-lg text-fg-secondary mb-8 max-w-md mx-auto leading-relaxed">
                We're setting up your private 1-to-1 support session. You'll be connected shortly.
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>

            {/* Reassurance message */}
            <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20">
              <p className="text-sm text-fg-secondary text-center leading-relaxed">
                <strong className="text-primary">Remember:</strong> All conversations are completely private and confidential. 
                Only you and your supporter can see your messages.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
