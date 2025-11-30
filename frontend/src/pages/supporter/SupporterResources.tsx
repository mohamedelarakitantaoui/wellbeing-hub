import { useState } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Download, 
  Search,
  Heart,
  Brain,
  Users,
  AlertCircle,
  Lightbulb,
  Shield,
  Phone
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'guide' | 'document' | 'link';
  url?: string;
  icon: any;
  color: string;
}

export function SupporterResources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Resources', icon: FileText },
    { id: 'mental-health', label: 'Mental Health', icon: Brain },
    { id: 'counseling', label: 'Counseling Skills', icon: Users },
    { id: 'crisis', label: 'Crisis Support', icon: AlertCircle },
    { id: 'self-care', label: 'Self-Care', icon: Heart },
    { id: 'guidelines', label: 'Guidelines', icon: Shield },
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Active Listening Techniques',
      description: 'Learn effective active listening strategies to better support students in distress.',
      category: 'counseling',
      type: 'guide',
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      url: '#',
    },
    {
      id: '2',
      title: 'Recognizing Signs of Depression',
      description: 'Key indicators and warning signs of depression in students. Essential knowledge for early intervention.',
      category: 'mental-health',
      type: 'article',
      icon: Brain,
      color: 'bg-purple-100 text-purple-700',
      url: '#',
    },
    {
      id: '3',
      title: 'Crisis Intervention Protocol',
      description: 'Step-by-step guide for handling crisis situations and when to escalate to emergency services.',
      category: 'crisis',
      type: 'document',
      icon: AlertCircle,
      color: 'bg-red-100 text-red-700',
      url: '#',
    },
    {
      id: '4',
      title: 'Managing Anxiety in Students',
      description: 'Practical techniques and coping strategies to help students manage anxiety and stress.',
      category: 'mental-health',
      type: 'video',
      icon: Brain,
      color: 'bg-purple-100 text-purple-700',
      url: '#',
    },
    {
      id: '5',
      title: 'Counselor Self-Care Guide',
      description: 'Essential practices for maintaining your own mental health while supporting others.',
      category: 'self-care',
      type: 'guide',
      icon: Heart,
      color: 'bg-pink-100 text-pink-700',
      url: '#',
    },
    {
      id: '6',
      title: 'Confidentiality & Ethics Guidelines',
      description: 'Understanding confidentiality boundaries, mandatory reporting, and ethical considerations.',
      category: 'guidelines',
      type: 'document',
      icon: Shield,
      color: 'bg-green-100 text-green-700',
      url: '#',
    },
    {
      id: '7',
      title: 'Effective Questioning Techniques',
      description: 'How to ask the right questions to understand student needs and facilitate meaningful conversations.',
      category: 'counseling',
      type: 'article',
      icon: Lightbulb,
      color: 'bg-yellow-100 text-yellow-700',
      url: '#',
    },
    {
      id: '8',
      title: 'Suicide Risk Assessment',
      description: 'Critical guidelines for assessing suicide risk and appropriate response procedures.',
      category: 'crisis',
      type: 'document',
      icon: AlertCircle,
      color: 'bg-red-100 text-red-700',
      url: '#',
    },
    {
      id: '9',
      title: 'Supporting Students with Trauma',
      description: 'Trauma-informed care approaches and best practices for supporting traumatized students.',
      category: 'mental-health',
      type: 'guide',
      icon: Heart,
      color: 'bg-purple-100 text-purple-700',
      url: '#',
    },
    {
      id: '10',
      title: 'Building Rapport & Trust',
      description: 'Techniques for establishing trust and creating a safe space for students to open up.',
      category: 'counseling',
      type: 'video',
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      url: '#',
    },
    {
      id: '11',
      title: 'Burnout Prevention for Counselors',
      description: 'Recognizing burnout symptoms and implementing strategies to maintain long-term effectiveness.',
      category: 'self-care',
      type: 'article',
      icon: Heart,
      color: 'bg-pink-100 text-pink-700',
      url: '#',
    },
    {
      id: '12',
      title: 'Cultural Competency in Counseling',
      description: 'Understanding cultural differences and providing culturally sensitive support.',
      category: 'counseling',
      type: 'guide',
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      url: '#',
    },
    {
      id: '13',
      title: 'Emergency Contacts & Referrals',
      description: 'Quick reference guide for emergency contacts, hotlines, and referral resources.',
      category: 'crisis',
      type: 'document',
      icon: Phone,
      color: 'bg-red-100 text-red-700',
      url: '#',
    },
    {
      id: '14',
      title: 'Documentation Best Practices',
      description: 'How to properly document sessions while maintaining confidentiality and legal requirements.',
      category: 'guidelines',
      type: 'article',
      icon: FileText,
      color: 'bg-green-100 text-green-700',
      url: '#',
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      article: 'bg-blue-100 text-blue-700',
      video: 'bg-purple-100 text-purple-700',
      guide: 'bg-green-100 text-green-700',
      document: 'bg-orange-100 text-orange-700',
      link: 'bg-gray-100 text-gray-700',
    };
    return badges[type] || badges.article;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <p className="text-gray-600 mt-1">
          Access training materials, guides, and best practices for effective counseling
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006341] focus:border-transparent text-base"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-[#006341] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredResources.length} of {resources.length} resources
        </p>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            {searchTerm ? 'No resources match your search' : 'No resources available in this category'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(resource => {
            const Icon = resource.icon;
            
            return (
              <div
                key={resource.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-[#006341] cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${resource.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadge(resource.type)}`}>
                    {resource.type}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-[#006341] transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button className="text-sm font-medium text-[#006341] hover:text-[#00875c] flex items-center gap-2 group-hover:gap-3 transition-all">
                    <span>View Resource</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Emergency Resources */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-900 text-lg mb-2">Emergency Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-red-800 text-sm">National Crisis Hotline</p>
                <p className="text-red-700">988 (24/7)</p>
              </div>
              <div>
                <p className="font-semibold text-red-800 text-sm">Campus Security</p>
                <p className="text-red-700">+212 5XX-XXXXXX</p>
              </div>
              <div>
                <p className="font-semibold text-red-800 text-sm">AUI Health Center</p>
                <p className="text-red-700">+212 5XX-XXXXXX</p>
              </div>
              <div>
                <p className="font-semibold text-red-800 text-sm">Counseling Services Director</p>
                <p className="text-red-700">counseling@aui.ma</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-[#006341]/10 border border-[#006341]/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#006341] rounded-lg flex items-center justify-center shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#006341] text-lg mb-2">Need More Resources?</h3>
            <p className="text-gray-700 mb-4">
              If you need additional training materials, resources, or have suggestions for new content, please reach out to the counseling services team.
            </p>
            <button className="px-4 py-2 bg-[#006341] text-white font-medium rounded-lg hover:bg-[#00875c] transition-colors">
              Contact Support Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
