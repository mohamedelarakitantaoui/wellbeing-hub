import { CheckCircle2, UserCheck, Shield } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Check-In Quickly',
    description: 'Share how you feel in 60 seconds with our confidential triage system.',
    icon: CheckCircle2,
  },
  {
    number: '02',
    title: 'Get Guided to Support',
    description: 'Receive personalized recommendations and connect with the right resources.',
    icon: UserCheck,
  },
  {
    number: '03',
    title: 'Connect Safely',
    description: 'Access counselors, peer support, and ongoing care in a secure environment.',
    icon: Shield,
  },
];

export default function Steps() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-[#006341] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Getting support is simple. Just three steps to better wellbeing.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="max-w-5xl mx-auto relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                  {/* Step Number Badge */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#006341] to-[#007A52] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative z-10">
                      <span className="text-2xl font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-5">
                    <step.icon className="w-10 h-10 text-[#007A52]" strokeWidth={2} />
                  </div>

                  {/* Title - H3 */}
                  <h3 className="text-2xl font-semibold text-[#006341] mb-3 group-hover:text-[#007A52] transition-colors">
                    {step.title}
                  </h3>

                  {/* Description - Body */}
                  <p className="text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow Connector - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 -right-4 z-20">
                    <svg className="w-8 h-8 text-[#006341] opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-700 mb-4 text-lg">
            Ready to take the first step towards better wellbeing?
          </p>
          <div className="inline-flex items-center gap-2 text-[#006341] font-semibold text-lg group cursor-pointer hover:text-[#007A52] transition-colors">
            <span>Get started now</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
