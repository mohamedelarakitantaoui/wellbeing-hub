import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Label } from '../components/ui/label';
import { api } from '../lib/api';

// Define the schema for form validation
const triageFormSchema = z.object({
  topic: z.string().min(1, 'Please select a topic'),
  moodScore: z.number().min(1).max(5),
  urgency: z.enum(['low', 'medium', 'high'], {
    message: 'Please select urgency level',
  }),
  message: z.string().optional(),
});

type TriageFormData = z.infer<typeof triageFormSchema>;

// Topic options
const TOPICS = [
  { value: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { value: 'stress', label: 'Stress', emoji: '😫' },
  { value: 'sleep', label: 'Sleep Problems', emoji: '😴' },
  { value: 'academic', label: 'Academic Pressure', emoji: '📚' },
  { value: 'relationship', label: 'Relationships', emoji: '💔' },
  { value: 'family', label: 'Family Issues', emoji: '👨‍👩‍👧' },
  { value: 'health', label: 'Health Concerns', emoji: '🏥' },
  { value: 'other', label: 'Other', emoji: '💭' },
];

// Mood emojis
const MOOD_EMOJIS = ['😢', '😔', '😐', '🙂', '😊'];

// Response types from backend
interface CrisisResponse {
  route: 'CRISIS';
  numbers: string[];
  bannerText: string;
  riskFlag: boolean;
}

interface BookResponse {
  route: 'BOOK';
  counselorFilters: { topic: string };
  supportRoom?: {
    id: string;
    topic: string;
    urgency: string;
    routedTo: string;
    status: string;
  };
  message?: string;
  riskFlag: boolean;
}

interface PeerResponse {
  route: 'PEER';
  supportRoom?: {
    id: string;
    topic: string;
    urgency: string;
    routedTo: string;
    status: string;
  };
  message?: string;
  riskFlag: boolean;
}

type TriageResponse = CrisisResponse | BookResponse | PeerResponse;

export function Triage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [showForm, setShowForm] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TriageFormData>({
    resolver: zodResolver(triageFormSchema),
    defaultValues: {
      moodScore: 3,
      urgency: 'low',
    },
  });

  const selectedTopic = watch('topic');
  const moodScore = watch('moodScore');
  const urgency = watch('urgency');

  const onSubmit = async (data: TriageFormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.createTriage(data);
      setResult(response);
      
      // Animate transition
      setShowForm(false);
    } catch (error: any) {
      console.error('Triage submission error:', error);
      const errorMessage = error?.message || 'Failed to submit triage. Please try again.';
      alert(`Error: ${errorMessage}\n\nCheck console for details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setShowForm(true);
  };

  if (!showForm && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          {result.route === 'CRISIS' && (
            <div className="space-y-6 animate-fade-in-up">
              <Alert variant="destructive" className="border-2 border-red-600 bg-red-100">
                <AlertTitle className="text-xl font-bold text-red-900">
                  🚨 Immediate Support Available
                </AlertTitle>
                <AlertDescription className="text-red-900 mt-2">
                  <p className="font-semibold mb-4">{result.bannerText}</p>
                  <div className="space-y-2">
                    <p className="font-medium">Emergency contacts:</p>
                    {result.numbers.map((number) => (
                      <a
                        key={number}
                        href={`tel:${number}`}
                        className="block bg-white text-red-700 font-bold text-2xl p-4 rounded-lg hover:bg-red-50 transition-colors text-center"
                      >
                        📞 {number}
                      </a>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>We're Here to Help</CardTitle>
                  <CardDescription>
                    You don't have to face this alone. Our crisis support team is available 24/7.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={async () => {
                      try {
                        await api.request('/crisis/alert', {
                          method: 'POST',
                          body: JSON.stringify({ 
                            message: `Urgent callback request - Topic: ${selectedTopic || 'Crisis'}, Mood: ${moodScore}/5` 
                          }),
                        });
                        alert('✅ Crisis alert sent! A counselor will contact you within 15 minutes.\n\nIf you need immediate help, please call one of the emergency numbers above.');
                      } catch (error) {
                        console.error('Failed to send crisis alert:', error);
                        alert('Please call the emergency numbers above for immediate help.');
                      }
                    }}
                  >
                    Request Immediate Callback
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/student/dashboard')}
                  >
                    Back to Assessment
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {result.route === 'BOOK' && (
            <div className="space-y-6 animate-fade-in-up">
              <Alert className="border-2 border-blue-600 bg-blue-50">
                <AlertTitle className="text-xl font-bold text-blue-900">
                  💬 Professional Support Recommended
                </AlertTitle>
                <AlertDescription className="text-blue-900 mt-2">
                  Based on your responses, we're connecting you with a professional counselor for private support.
                  They can provide specialized help for {result.counselorFilters?.topic?.toLowerCase() || 'your concerns'}.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Your Private Counselor Chat</CardTitle>
                  <CardDescription>
                    A counselor will join your private support room shortly to provide professional guidance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.supportRoom && (
                    <>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Topic:</span>
                          <span className="font-medium capitalize">{result.supportRoom.topic}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Urgency:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.supportRoom.urgency === 'high' || result.supportRoom.urgency === 'crisis' 
                              ? 'bg-red-100 text-red-800' 
                              : result.supportRoom.urgency === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {result.supportRoom.urgency.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-fg-secondary">Support from:</span>
                          <span className="font-medium capitalize">{result.supportRoom.routedTo.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => navigate(`/support/${result.supportRoom!.id}`)}
                      >
                        Enter Private Support Room
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleTryAgain}
                  >
                    Retake Assessment
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {result.route === 'PEER' && (
            <div className="space-y-6 animate-fade-in-up">
              <Alert className="border-2 border-purple-600 bg-purple-50">
                <AlertTitle className="text-xl font-bold text-purple-900">
                  💬 Private Support Connected
                </AlertTitle>
                <AlertDescription className="text-purple-900 mt-2">
                  {result.message || 'We\'re connecting you with a trained supporter for a private, one-on-one conversation.'}
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Your Private Support Room</CardTitle>
                  <CardDescription>
                    {result.supportRoom ? (
                      <>
                        A confidential space to discuss <strong>{result.supportRoom.topic.charAt(0).toUpperCase() + result.supportRoom.topic.slice(1)}</strong> with a {result.supportRoom.routedTo.replace('_', ' ')}.
                      </>
                    ) : (
                      'A safe, private space for one-on-one support.'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.supportRoom && (
                    <>
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Topic:</span>
                          <span className="font-medium capitalize">{result.supportRoom.topic}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Urgency:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.supportRoom.urgency === 'high' || result.supportRoom.urgency === 'crisis' 
                              ? 'bg-red-100 text-red-800' 
                              : result.supportRoom.urgency === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {result.supportRoom.urgency.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-fg-secondary">Routed to:</span>
                          <span className="font-medium capitalize">{result.supportRoom.routedTo.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => navigate(`/support/${result.supportRoom!.id}`)}
                      >
                        Enter Private Support Room
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleTryAgain}
                  >
                    Retake Assessment
                  </Button>
                </CardContent>
              </Card>

              {/* Privacy Notice */}
              <Alert className="border-purple-200 bg-purple-50">
                <AlertTitle className="text-purple-900">🔒 Your Privacy Matters</AlertTitle>
                <AlertDescription className="text-purple-800">
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>This is a completely private 1-on-1 conversation</li>
                    <li>Only you and your assigned supporter can see your messages</li>
                    <li>No other students can access or view your chat</li>
                    <li>All conversations are confidential</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-3xl">Wellbeing Check-In</CardTitle>
            <CardDescription>
              Tell us what's on your mind, and we'll connect you with the right support — whether that's a private chat with a peer supporter, booking a counselor, or accessing crisis resources.
              <br />
              <span className="text-sm text-fg-muted">⏱️ Takes about 60 seconds • 🔒 Completely confidential</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Topic Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  What's on your mind? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={selectedTopic}
                  onValueChange={(value) => setValue('topic', value)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {TOPICS.map((topic) => (
                    <div key={topic.value}>
                      <label
                        htmlFor={topic.value}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedTopic === topic.value
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-light bg-white'
                        }`}
                      >
                        <RadioGroupItem
                          value={topic.value}
                          id={topic.value}
                          className="sr-only"
                        />
                        <span className="text-3xl mb-2">{topic.emoji}</span>
                        <span className="text-sm font-medium">{topic.label}</span>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.topic && (
                  <p className="text-sm text-red-500">{errors.topic.message}</p>
                )}
              </div>

              {/* Mood Score Slider */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  How are you feeling today? <span className="text-red-500">*</span>
                </Label>
                <div className="pt-2">
                  <div className="flex justify-between mb-3">
                    {MOOD_EMOJIS.map((emoji, index) => (
                      <span
                        key={index}
                        className={`text-2xl transition-all ${
                          moodScore === index + 1
                            ? 'scale-125 opacity-100'
                            : 'opacity-40 scale-90'
                        }`}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[moodScore || 3]}
                    onValueChange={(value) => setValue('moodScore', value[0])}
                  />
                  <div className="flex justify-between text-xs text-fg-muted mt-2">
                    <span>Very Low</span>
                    <span>Very Good</span>
                  </div>
                </div>
              </div>

              {/* Urgency Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  How urgent is this for you? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={urgency}
                  onValueChange={(value) => setValue('urgency', value as 'low' | 'medium' | 'high')}
                  className="grid grid-cols-3 gap-3"
                >
                  {[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' }
                  ].map((level) => (
                    <div key={level.value}>
                      <label
                        htmlFor={`urgency-${level.value}`}
                        className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          urgency === level.value
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-light bg-white'
                        }`}
                      >
                        <RadioGroupItem
                          value={level.value}
                          id={`urgency-${level.value}`}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{level.label}</span>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.urgency && (
                  <p className="text-sm text-red-500">{errors.urgency.message}</p>
                )}
              </div>

              {/* Optional Message */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Anything else you'd like to share? (Optional)
                </Label>
                <Textarea
                  {...register('message')}
                  placeholder="Share more about what you're experiencing..."
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-fg-muted">
                  This information helps us provide better support. It's completely confidential.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Get Personalized Support'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info footer */}
        <div className="mt-6 text-center text-sm text-fg-secondary">
          <p>🔒 Your privacy matters. All information is kept confidential.</p>
        </div>
      </div>
    </div>
  );
}
