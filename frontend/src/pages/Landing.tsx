import LandingNav from '../components/landing/LandingNav';
import EnhancedHero from '../components/landing/EnhancedHero';
import BenefitsSection from '../components/landing/BenefitsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import FinalCTA from '../components/landing/FinalCTA';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <EnhancedHero />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Feature Showcase Section */}
      <FeatureShowcase />

      {/* Final CTA Section */}
      <FinalCTA />
    </div>
  );
}
