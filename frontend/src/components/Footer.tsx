import { Heart, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { label: 'About', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Crisis Resources', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
  };

  return (
    <footer className="bg-primary-700 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="h-7 w-7 text-primary-700" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">AUI Wellbeing Hub</h3>
                <p className="text-primary-100 text-sm font-medium">Al Akhawayn University</p>
              </div>
            </div>
            <p className="text-primary-100 leading-relaxed max-w-md text-base">
              Your wellbeing, our commitment. A comprehensive mental health platform designed specifically for AUI students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-primary-100 hover:text-white transition-colors duration-200 text-base hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xl font-bold mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-primary-100 hover:text-white transition-colors duration-200 text-base hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-10 border border-white/20 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent-error rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h5 className="font-bold text-lg mb-2">Crisis Support - Available 24/7</h5>
              <p className="text-base text-primary-100 leading-relaxed">
                If you're experiencing a mental health emergency, please call our crisis hotline immediately or contact local emergency services.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/20 flex flex-col md:flex-row justify-center items-center gap-6">
          <p className="text-sm text-primary-100">
            © {currentYear} Al Akhawayn University – Student Wellbeing Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
