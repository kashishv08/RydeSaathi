import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitReview } from '../../hooks/useReview';

const STAR_LABELS = ['', 'Terrible', 'Bad', 'OK', 'Good', 'Excellent'];

export default function RideRating({ rideId, role, personName, personRole, onComplete }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const { mutateAsync: submitReview, isPending } = useSubmitReview();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }
        try {
            await submitReview({ ride_id: rideId, stars: rating, comment });
            toast.success("Thank you for your feedback!");
            onComplete();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || "Failed to submit rating.";
            toast.error(msg);
            if (msg.includes("already rated")) onComplete();
        }
    };

    const activeRating = hoverRating || rating;

    return (
        <AnimatePresence>
            <motion.div
                key="rating-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
                style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
                onClick={onComplete}
            >
                {/* Sheet */}
                <motion.div
                    key="rating-sheet"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl px-6 pt-5 pb-10 flex flex-col items-center gap-5 mx-auto"
                    style={{
                        background: 'linear-gradient(180deg,#1a1a2e 0%,#13131f 100%)',
                        border: '1px solid rgba(139,92,246,0.18)',
                        borderBottom: 'none',
                    }}
                >
                    {/* Drag handle */}
                    <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />

                    {/* Close */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={onComplete}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </motion.button>

                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.08 }}
                        className="relative"
                    >
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{ boxShadow: ['0 0 0px rgba(139,92,246,0)', '0 0 20px rgba(139,92,246,0.4)', '0 0 0px rgba(139,92,246,0)'] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center relative"
                            style={{
                                background: 'rgba(139,92,246,0.1)',
                                border: '2px solid rgba(139,92,246,0.35)',
                            }}
                        >
                            <User className="w-8 h-8 text-violet-400" />
                        </div>
                    </motion.div>

                    {/* Name + label */}
                    <div className="text-center">
                        <h2 className="text-xl font-black text-white tracking-tight">
                            {personName || 'Your Driver'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Rate your {personRole?.toLowerCase() || 'driver'}
                        </p>
                    </div>

                    {/* Stars */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                    key={star}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.9 }}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1 cursor-pointer"
                                >
                                    <Star
                                        className={`w-9 h-9 transition-all duration-200 ${
                                            activeRating >= star
                                                ? 'fill-violet-400 text-violet-400 drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]'
                                                : 'fill-transparent text-gray-700'
                                        }`}
                                    />
                                </motion.button>
                            ))}
                        </div>
                        <AnimatePresence mode="wait">
                            {activeRating > 0 && (
                                <motion.span
                                    key={activeRating}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="text-xs font-bold"
                                    style={{ color: 'rgba(167,139,250,0.9)' }}
                                >
                                    {STAR_LABELS[activeRating]}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Comment box */}
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a comment (optional)…"
                        className="w-full rounded-xl px-4 py-3 text-sm font-medium placeholder-gray-600 resize-none custom-scrollbar"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#e5e7eb',
                            outline: 'none',
                            height: '68px',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'rgba(139,92,246,0.4)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.08)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />

                    {/* Actions */}
                    <div className="w-full flex flex-col gap-2.5">
                        <motion.button
                            whileHover={rating > 0 ? { scale: 1.02, y: -1 } : {}}
                            whileTap={rating > 0 ? { scale: 0.97 } : {}}
                            onClick={handleSubmit}
                            disabled={isPending || rating === 0}
                            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all"
                            style={{
                                background: rating > 0 && !isPending
                                    ? 'linear-gradient(135deg,#7c3aed,#5b21b6)'
                                    : 'rgba(255,255,255,0.06)',
                                boxShadow: rating > 0 && !isPending ? '0 6px 24px rgba(124,58,237,0.35)' : 'none',
                                color: rating > 0 && !isPending ? '#fff' : 'rgba(255,255,255,0.3)',
                                cursor: rating > 0 && !isPending ? 'pointer' : 'not-allowed',
                            }}
                        >
                            {isPending ? 'Submitting…' : 'Submit Rating'}
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={onComplete}
                            className="w-full py-2.5 rounded-2xl text-sm font-semibold"
                            style={{ color: 'rgba(255,255,255,0.35)' }}
                        >
                            Skip for now
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
