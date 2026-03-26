import { useState, type FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
  honeypot: string; // Anti-spam field
}

const inputClasses = "w-full px-4 py-3 rounded-lg bg-[#0A0A0B] border border-white/10 text-[#F5F0EB] placeholder-[#6B6560] focus:outline-none focus:border-[#D45060]/50 focus:shadow-[0_0_10px_rgba(212,80,96,0.15)] transition-all duration-300 text-sm";

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (formData.honeypot) {
      console.log('Bot detected');
      return;
    }
    
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '6b97dfee-d577-483a-be0b-4030251352b5',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          botcheck: formData.honeypot,
        }),
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to send message');
      }
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '', honeypot: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot field (hidden) */}
      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />
      
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-medium text-[#B5A99A] uppercase tracking-wider mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClasses}
        />
      </div>
      
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-[#B5A99A] uppercase tracking-wider mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClasses}
        />
      </div>
      
      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs font-medium text-[#B5A99A] uppercase tracking-wider mb-2">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          placeholder="Tell me about your project or idea..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`${inputClasses} resize-none`}
        />
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full px-6 py-3 rounded-lg font-medium text-sm tracking-wide bg-gradient-to-r from-[#D45060]/40 to-[#B8648A]/35 border border-[#D45060]/50 text-[#FAF7F2] hover:from-[#D45060]/55 hover:to-[#B8648A]/50 hover:border-[#D45060] hover:shadow-[0_0_10px_rgba(212,80,96,0.4),0_0_30px_rgba(212,80,96,0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {status === 'loading' ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Sending...
          </span>
        ) : 'Send Message'}
      </button>
      
      {/* Status Messages */}
      {status === 'success' && (
        <div className="p-4 rounded-lg border border-[#6B8F71]/20 bg-[#6B8F71]/5 text-[#6B8F71] text-sm">
          Message sent successfully! I'll get back to you soon.
        </div>
      )}
      
      {status === 'error' && (
        <div className="p-4 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-sm">
          {errorMessage}
        </div>
      )}
    </form>
  );
}
