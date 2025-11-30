import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersRound, Upload, CheckCircle, Loader2 } from 'lucide-react';

export function BecomePeer() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    auiEmail: '',
    school: '',
    major: '',
    yearOfStudy: '',
    phoneNumber: '',
    motivation: '',
    experience: '',
    availability: '',
    communicationStyle: '',
    studentIdFile: null as File | null,
    agreedToTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, studentIdFile: file }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    const emailRegex = /@aui\.ma$/i;
    if (!formData.auiEmail.trim()) {
      newErrors.auiEmail = 'AUI email is required';
    } else if (!emailRegex.test(formData.auiEmail)) {
      newErrors.auiEmail = 'Please use your AUI email (@aui.ma)';
    }

    if (!formData.school.trim()) {
      newErrors.school = 'School is required';
    }

    if (!formData.major.trim()) {
      newErrors.major = 'Major is required';
    }

    if (!formData.yearOfStudy) {
      newErrors.yearOfStudy = 'Year of study is required';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.motivation.trim() || formData.motivation.length < 50) {
      newErrors.motivation = 'Please provide at least 50 characters explaining your motivation';
    }

    if (!formData.experience.trim() || formData.experience.length < 30) {
      newErrors.experience = 'Please provide at least 30 characters about your experience';
    }

    if (!formData.availability) {
      newErrors.availability = 'Please select your availability';
    }

    if (!formData.communicationStyle) {
      newErrors.communicationStyle = 'Please select a communication style';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the confidentiality terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5000/api/peer-applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          auiEmail: formData.auiEmail,
          school: formData.school,
          major: formData.major,
          yearOfStudy: formData.yearOfStudy,
          phoneNumber: formData.phoneNumber,
          motivation: formData.motivation,
          experience: formData.experience,
          availability: formData.availability,
          communicationStyle: formData.communicationStyle,
          studentIdFileUrl: null, // TODO: Implement file upload
          agreedToTerms: formData.agreedToTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }
      
      console.log('Peer supporter application submitted:', data);
      
      setIsSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      console.error('Submission error:', error);
      setErrors({ submit: error.message || 'Something went wrong. Please try again.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">We've Got Your Application! 🎉</h2>
          <p className="text-gray-600 mb-4">
            Thank you for taking this important step to support your peers. Your application has been successfully received by our team.
          </p>
          <div className="bg-purple-50 rounded-2xl p-4 mb-6">
            <p className="text-sm font-medium text-purple-900 mb-2">What happens next?</p>
            <p className="text-sm text-purple-700">
              Our admins will carefully review your application. You'll receive a response at your AUI email within 3-5 business days.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting you to the homepage...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
            <UsersRound className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Become a Peer Supporter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join Hearts & Minds and make a difference in the lives of fellow students who need support.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* AUI Email */}
            <div>
              <label htmlFor="auiEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                AUI Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="auiEmail"
                name="auiEmail"
                value={formData.auiEmail}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.auiEmail ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="your.name@aui.ma"
              />
              {errors.auiEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.auiEmail}</p>
              )}
            </div>

            {/* School and Major */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="school" className="block text-sm font-semibold text-gray-700 mb-2">
                  School <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.school ? 'border-red-500' : 'border-gray-300'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                  placeholder="e.g., SBA, SHSS"
                />
                {errors.school && (
                  <p className="mt-1 text-sm text-red-600">{errors.school}</p>
                )}
              </div>

              <div>
                <label htmlFor="major" className="block text-sm font-semibold text-gray-700 mb-2">
                  Major <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.major ? 'border-red-500' : 'border-gray-300'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                  placeholder="e.g., Computer Science"
                />
                {errors.major && (
                  <p className="mt-1 text-sm text-red-600">{errors.major}</p>
                )}
              </div>
            </div>

            {/* Year of Study */}
            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-semibold text-gray-700 mb-2">
                Year of Study <span className="text-red-500">*</span>
              </label>
              <select
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.yearOfStudy ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              >
                <option value="">Select your year</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
                <option value="graduate">Graduate</option>
              </select>
              {errors.yearOfStudy && (
                <p className="mt-1 text-sm text-red-600">{errors.yearOfStudy}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                placeholder="0612345678"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Motivation */}
            <div>
              <label htmlFor="motivation" className="block text-sm font-semibold text-gray-700 mb-2">
                Why do you want to become a peer supporter? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border ${
                  errors.motivation ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none`}
                placeholder="Share your motivation for wanting to support fellow students..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.motivation ? (
                  <p className="text-sm text-red-600">{errors.motivation}</p>
                ) : (
                  <p className="text-sm text-gray-500">Minimum 50 characters</p>
                )}
                <p className="text-sm text-gray-400">{formData.motivation.length}/500</p>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
                Do you have any prior experience in helping or listening to people? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border ${
                  errors.experience ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none`}
                placeholder="Describe any relevant experience, formal or informal..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.experience ? (
                  <p className="text-sm text-red-600">{errors.experience}</p>
                ) : (
                  <p className="text-sm text-gray-500">Minimum 30 characters</p>
                )}
                <p className="text-sm text-gray-400">{formData.experience.length}/500</p>
              </div>
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="availability" className="block text-sm font-semibold text-gray-700 mb-2">
                Availability per Week <span className="text-red-500">*</span>
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.availability ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
              >
                <option value="">Select your availability</option>
                <option value="1-3">1-3 hours per week</option>
                <option value="4-6">4-6 hours per week</option>
                <option value="7-10">7-10 hours per week</option>
                <option value="10+">10+ hours per week</option>
              </select>
              {errors.availability && (
                <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
              )}
            </div>

            {/* Communication Style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Preferred Communication Style <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: 'empathetic', label: 'Empathetic', description: 'Focus on understanding feelings and emotions' },
                  { value: 'structured', label: 'Structured', description: 'Organized approach with clear steps' },
                  { value: 'active-listening', label: 'Active Listening', description: 'Let them talk while you listen and reflect' },
                ].map((style) => (
                  <label
                    key={style.value}
                    className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.communicationStyle === style.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="communicationStyle"
                      value={style.value}
                      checked={formData.communicationStyle === style.value}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{style.label}</div>
                      <div className="text-sm text-gray-600">{style.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.communicationStyle && (
                <p className="mt-2 text-sm text-red-600">{errors.communicationStyle}</p>
              )}
            </div>

            {/* Upload Student ID */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Student ID <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <label htmlFor="studentId" className="cursor-pointer">
                  <span className="text-purple-600 font-semibold hover:text-purple-700">
                    Click to upload
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                  <input
                    type="file"
                    id="studentId"
                    name="studentId"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, or PDF (max 5MB)</p>
                {formData.studentIdFile && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.studentIdFile.name}</p>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer ${
                errors.agreedToTerms ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}>
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  I understand that peer support requires <strong>confidentiality</strong> and <strong>emotional responsibility</strong>. I commit to upholding the values and guidelines of Hearts & Minds.
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="mt-2 text-sm text-red-600">{errors.agreedToTerms}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Questions? Contact us at{' '}
            <a href="mailto:support@heartsandminds.aui.ma" className="text-purple-600 hover:text-purple-700 font-semibold">
              support@heartsandminds.aui.ma
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
