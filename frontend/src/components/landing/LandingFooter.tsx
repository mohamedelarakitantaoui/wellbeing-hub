import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-br from-primary-800 via-primary-700 to-secondary-teal text-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-warm rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-2xl group-hover:scale-105 transition-transform">
                <Heart className="h-6 w-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold">AUI Hearts & Minds</span>
            </Link>
            <p className="text-white/80 leading-relaxed mb-6">
              Supporting the mental wellness of Al Akhawayn University students through accessible, confidential care.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#benefits" className="text-white/80 hover:text-white transition-colors">Benefits</a>
              </li>
              <li>
                <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</a>
              </li>
              <li>
                <Link to="/become-peer" className="text-white/80 hover:text-white transition-colors">Become a Peer Mentor</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Contact Support</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-white/60 shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:support@auiheartsandminds.com" className="text-white/80 hover:text-white transition-colors">
                    support@auiheartsandminds.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-white/60 shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+212123456789" className="text-white/80 hover:text-white transition-colors">
                    +212 123 456 789
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white/60 shrink-0 mt-0.5" />
                <div className="text-white/80">
                  Al Akhawayn University<br />
                  Ifrane, Morocco
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © {currentYear} AUI Hearts & Minds. All rights reserved. Built with ❤️ for AUI students.
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>

        {/* Crisis Helpline Notice */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-start gap-4">
            <div className="bg-accent-error/20 p-3 rounded-xl shrink-0">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold mb-1">In Crisis? Get Immediate Help</h4>
              <p className="text-white/80 text-sm mb-2">
                If you're experiencing a mental health emergency, please call:
              </p>
              <a href="tel:190" className="text-white font-bold text-lg hover:underline">
                📞 190 (Morocco Crisis Line)
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
