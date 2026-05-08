import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, MessageSquare, Star } from 'lucide-react';
import { motion } from 'motion/react';

export function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    if (!supabase) {
      setReviews([
        { id: '1', product_id: 'PRD-1', rating: 5, comment: 'Great quality shoes!' },
        { id: '2', product_id: 'PRD-2', rating: 3, comment: 'Okay, but size is a bit small.' },
      ]);
      setLoading(false);
      return;
    }

    const { data } = await supabase.from('reviews').select('*');
    if (data) setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id: string) => {
    if (!supabase || !confirm('Are you sure you want to delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    fetchReviews();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Reviews</h1>
          <p className="text-sm text-slate-500">Manage customer feedback</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Product ID</th>
                  <th className="px-6 py-4 font-medium">Rating</th>
                  <th className="px-6 py-4 font-medium w-1/2">Comment</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.map((review) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={review.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{review.product_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 italic">"{review.comment}"</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => deleteReview(review.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No reviews yet</h3>
            <p className="mt-1 text-sm text-slate-500">When customers review your products, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
