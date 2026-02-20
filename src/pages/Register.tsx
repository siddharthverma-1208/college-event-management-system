import { useState, FormEvent, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { cn } from '../utils/cn';

interface RegisterProps {
  preselectedEventId?: string;
  onSuccess: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  contactNumber: string;
  collegeName: string;
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  universityRollNumber: string;
  batch: string;
  eventId: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  contactNumber: '',
  collegeName: '',
  age: '',
  gender: '',
  universityRollNumber: '',
  batch: '',
  eventId: ''
};

const batchOptions = [
  { value: '2021-2025', label: '2021-2025' },
  { value: '2022-2026', label: '2022-2026' },
  { value: '2023-2027', label: '2023-2027' },
  { value: '2024-2028', label: '2024-2028' },
];

export function Register({ preselectedEventId, onSuccess }: RegisterProps) {
  const { events, addStudent, addToast, theme } = useApp();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    eventId: preselectedEventId || ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (preselectedEventId) {
      setFormData(prev => ({ ...prev, eventId: preselectedEventId }));
    }
  }, [preselectedEventId]);

  const eventOptions = events
    .filter(e => new Date(e.date) >= new Date())
    .map(e => ({ value: e.id, label: e.eventName }));

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid 10-digit number';
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const age = parseInt(formData.age);
      if (age < 16 || age > 30) {
        newErrors.age = 'Age must be between 16 and 30';
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.universityRollNumber.trim()) {
      newErrors.universityRollNumber = 'University roll number is required';
    }

    if (!formData.batch) {
      newErrors.batch = 'Please select your batch';
    }

    if (!formData.eventId) {
      newErrors.eventId = 'Please select an event';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('error', 'Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = addStudent({
      fullName: formData.fullName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      collegeName: formData.collegeName,
      age: parseInt(formData.age),
      gender: formData.gender as 'male' | 'female' | 'other',
      universityRollNumber: formData.universityRollNumber,
      batch: formData.batch,
      eventId: formData.eventId
    });

    setIsSubmitting(false);

    if (success) {
      addToast('success', '🎉 Registration successful! You will receive a confirmation email.');
      setFormData(initialFormData);
      onSuccess();
    } else {
      addToast('error', 'You have already registered for this event with the same email or roll number.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen pt-20 pb-12 transition-colors duration-300',
      isDark ? 'bg-slate-900' : 'bg-slate-50'
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          'absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl',
          isDark ? 'bg-violet-500/10' : 'bg-violet-400/10'
        )} />
        <div className={cn(
          'absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl',
          isDark ? 'bg-indigo-500/10' : 'bg-indigo-400/10'
        )} />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className={cn(
            'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6',
            'bg-gradient-to-br from-violet-600 to-indigo-600',
            'shadow-xl shadow-violet-500/25 animate-float'
          )}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className={cn(
            'text-3xl font-bold mb-2 transition-colors',
            isDark ? 'text-white' : 'text-slate-900'
          )}>
            Event Registration
          </h1>
          <p className={cn(
            'transition-colors',
            isDark ? 'text-slate-400' : 'text-slate-500'
          )}>
            Fill in your details to register for an event
          </p>
        </div>

        {/* Form Card */}
        <div 
          className={cn(
            'rounded-2xl border overflow-hidden animate-fade-in-up transition-all duration-300',
            isDark
              ? 'bg-slate-800/50 border-slate-700/50 shadow-2xl shadow-black/20'
              : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'
          )}
          style={{ animationDelay: '100ms' }}
        >
          {/* Gradient top border */}
          <div className="h-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
          
          <form onSubmit={handleSubmit} className="p-8">
            {/* Event Selection */}
            <div className={cn(
              'mb-8 p-5 rounded-xl border transition-colors',
              isDark
                ? 'bg-violet-500/5 border-violet-500/20'
                : 'bg-violet-50 border-violet-100'
            )}>
              <Select
                label="Select Event"
                options={eventOptions}
                placeholder="Choose an event to register"
                value={formData.eventId}
                onChange={(e) => handleChange('eventId', e.target.value)}
                error={errors.eventId}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Info Header */}
              <div className="md:col-span-2">
                <h3 className={cn(
                  'text-lg font-semibold mb-4 flex items-center gap-2 transition-colors',
                  isDark ? 'text-white' : 'text-slate-900'
                )}>
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    isDark ? 'bg-violet-500/10' : 'bg-violet-100'
                  )}>
                    <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Personal Information
                </h3>
              </div>

              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                error={errors.fullName}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label="Contact Number"
                type="tel"
                placeholder="10-digit mobile number"
                value={formData.contactNumber}
                onChange={(e) => handleChange('contactNumber', e.target.value)}
                error={errors.contactNumber}
                required
              />

              <Input
                label="Age"
                type="number"
                placeholder="Your age"
                min={16}
                max={30}
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                error={errors.age}
                required
              />

              {/* Gender Radio Buttons */}
              <div className="md:col-span-2 space-y-1.5">
                <label className={cn(
                  'block text-sm font-medium transition-colors',
                  isDark ? 'text-slate-300' : 'text-slate-700'
                )}>
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3 pt-2">
                  {[
                    { value: 'male', label: 'Male', icon: '👨' },
                    { value: 'female', label: 'Female', icon: '👩' },
                    { value: 'other', label: 'Other', icon: '🧑' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer',
                        'transition-all duration-200 hover:scale-[1.02]',
                        formData.gender === option.value
                          ? isDark
                            ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                            : 'border-violet-500 bg-violet-50 text-violet-700'
                          : isDark
                            ? 'border-slate-600 hover:border-slate-500 text-slate-300'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      )}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={formData.gender === option.value}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1 animate-fade-in">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* Academic Info Header */}
              <div className="md:col-span-2 mt-4">
                <h3 className={cn(
                  'text-lg font-semibold mb-4 flex items-center gap-2 transition-colors',
                  isDark ? 'text-white' : 'text-slate-900'
                )}>
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    isDark ? 'bg-indigo-500/10' : 'bg-indigo-100'
                  )}>
                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  Academic Information
                </h3>
              </div>

              <Input
                label="College Name"
                type="text"
                placeholder="Your college name"
                value={formData.collegeName}
                onChange={(e) => handleChange('collegeName', e.target.value)}
                error={errors.collegeName}
                required
              />

              <Input
                label="University Roll Number"
                type="text"
                placeholder="Your university roll number"
                value={formData.universityRollNumber}
                onChange={(e) => handleChange('universityRollNumber', e.target.value)}
                error={errors.universityRollNumber}
                required
              />

              <Select
                label="Batch"
                options={batchOptions}
                placeholder="Select your batch"
                value={formData.batch}
                onChange={(e) => handleChange('batch', e.target.value)}
                error={errors.batch}
                required
              />
            </div>

            {/* Submit Button */}
            <div className={cn(
              'mt-8 pt-6 border-t transition-colors',
              isDark ? 'border-slate-700' : 'border-slate-100'
            )}>
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </Button>
              <p className={cn(
                'text-center text-sm mt-4 transition-colors',
                isDark ? 'text-slate-500' : 'text-slate-500'
              )}>
                By registering, you agree to our terms and conditions
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
