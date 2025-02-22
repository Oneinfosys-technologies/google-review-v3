import React, { useState } from 'react';
import { StarRating } from './components/StarRating';
import { supabase } from './lib/supabase';
import { MessageSquareHeart, Sparkles } from 'lucide-react';

function App() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = async (newRating: number) => {
    setRating(newRating);
    
    if (newRating >= 4) {
      const businessPlaceId = 'YOUR_GOOGLE_PLACE_ID';
      const templateMessage = encodeURIComponent('I had a great experience!');
      window.location.href = `https://search.google.com/local/writereview?placeid=${businessPlaceId}&review=${templateMessage}`;
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('feedback')
        .insert([{ rating, message }]);

      if (supabaseError) throw supabaseError;

      setStatus('success');
      setMessage('');
      setRating(0);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-white/20">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">Thank You!</h2>
            <p className="text-gray-600 text-lg leading-relaxed">Your valuable feedback helps us create better experiences for everyone.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-md w-full border border-white/20">
        <div className="text-center mb-10">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-16 h-16 bg-blue-100 rounded-full blur-xl"></div>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-purple-100 rounded-full blur-xl"></div>
            <div className="relative flex items-center justify-center mb-6">
              <MessageSquareHeart className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Your Voice Matters
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Help us shape the future of our services
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center">
            <label className="block text-lg font-medium text-gray-700 mb-6">
              How was your experience with us?
            </label>
            <div className="flex justify-center">
              <StarRating rating={rating} onRatingChange={handleRatingChange} />
            </div>
          </div>

          {rating > 0 && rating <= 3 && (
            <div className="bg-gray-50/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-100">
              <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-3">
                How can we improve?
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-6 py-4 border border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your feedback helps us improve..."
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm text-red-600 text-sm p-6 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {rating > 0 && rating <= 3 && (
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-lg font-medium shadow-lg disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
            </button>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-8 text-center text-gray-500 text-sm">
      <p>© {currentYear} Your Company Name. All rights reserved.</p>
      <p className="mt-1">Crafted with care for our valued customers</p>
    </footer>
  );
}

export default App;