import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.js';

export const ContactSection: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-[#EBE3D8] shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Info Column */}
            <div className="md:col-span-5 bg-[#2C1B14] p-8 text-white flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#9DB08E]">
                  Get In Touch
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold mt-1 mb-4 text-white">
                  We'd Love to Hear From You
                </h2>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-8">
                  Have questions about styling, fit recommendations, or affiliate partnerships? Send us a note and our editorial team will reply within 24 hours.
                </p>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 text-stone-200">
                    <Mail className="w-4 h-4 text-[#9DB08E]" />
                    <span>{settings.contact_email || 'hello@wearday.store'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-200">
                    <Phone className="w-4 h-4 text-[#9DB08E]" />
                    <span>{settings.contact_phone || '+1 (800) 458-9273'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-200">
                    <MapPin className="w-4 h-4 text-[#9DB08E]" />
                    <span>Los Angeles & London Curated Studio</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-[11px] text-stone-400">
                Official Amazon Associates Affiliate Showcase
              </div>
            </div>

            {/* Right Form Column */}
            <div className="md:col-span-7 p-8">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#F4F7F2] text-[#657956] flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2C1B14]">Message Sent!</h3>
                  <p className="text-xs text-[#745442] max-w-sm">
                    Thank you for reaching out. We have received your inquiry and will be in touch shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-6 py-2.5 bg-[#2C1B14] text-white text-xs font-semibold rounded-xl"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1B14] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EDE2] bg-[#FAF7F2] focus:bg-white text-xs sm:text-sm text-[#2C1B14] focus:border-[#9DB08E] focus:outline-none focus:ring-1 focus:ring-[#9DB08E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2C1B14] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EDE2] bg-[#FAF7F2] focus:bg-white text-xs sm:text-sm text-[#2C1B14] focus:border-[#9DB08E] focus:outline-none focus:ring-1 focus:ring-[#9DB08E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2C1B14] mb-1">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EDE2] bg-[#FAF7F2] focus:bg-white text-xs sm:text-sm text-[#2C1B14] focus:border-[#9DB08E] focus:outline-none focus:ring-1 focus:ring-[#9DB08E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2C1B14] mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Tell us about the pieces you are looking for..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EDE2] bg-[#FAF7F2] focus:bg-white text-xs sm:text-sm text-[#2C1B14] focus:border-[#9DB08E] focus:outline-none focus:ring-1 focus:ring-[#9DB08E]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 bg-[#2C1B14] hover:bg-[#422E23] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
