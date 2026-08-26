import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitReview } from '../../hooks/useReview';

const PRIMARY = 'hsl(169, 59%, 31%)';
const FG = 'hsl(193, 43%, 15%)';
const MUTED = 'hsl(193, 15%, 45%)';
const CARD_BG = 'hsl(44, 44%, 99%)';
const BORDER = 'hsl(38, 24%, 86%)';
const BG_MUTED = 'hsl(43, 38%, 96%)';

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
                style={{ background: 'rgba(27,54,58,0.5)', backdropFilter: 'blur(8px)' }}
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
                    className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl px-6 pt-5 pb-10 flex flex-col items-center gap-5 mx-auto relative"
                    style={{
                        background: CARD_BG,
                        border: `1px solid ${BORDER}`,
                        borderBottom: 'none',
                        boxShadow: '0 -8px 40px rgba(27,54,58,0.12)',
                    }}
                >
                    {/* Drag handle */}
                    <div className="w-10 h-1 rounded-full" style={{ background: 'hsl(38,24%,84%)' }} />

                    {/* Close */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={onComplete}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--clr-border)' }}
                    >
                        <X className="w-4 h-4" style={{ color: MUTED }} />
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
                            animate={{ boxShadow: ['0 0 0px hsl(169,59%,31%,0)', '0 0 20px hsl(169,59%,31%,0.3)', '0 0 0px hsl(169,59%,31%,0)'] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        />
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center relative"
                            style={{
                                background: 'var(--clr-primary-subtle)',
                                border: `2px solid hsl(169,59%,31%,0.3)`,
                            }}
                        >
                            <User className="w-8 h-8" style={{ color: PRIMARY }} />
                        </div>
                    </motion.div>

                    {/* Name + label */}
                    <div className="text-center">
                        <h2 className="text-xl font-black tracking-tight" style={{ color: FG, fontFamily: "'Manrope', sans-serif" }}>
                            {personName || 'Your Driver'}
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: MUTED }}>
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
                                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]'
                                                : 'fill-transparent text-gray-300'
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
                                    style={{ color: PRIMARY }}
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
                        className="w-full rounded-xl px-4 py-3 text-sm font-medium resize-none custom-scrollbar"
                        style={{
                            background: BG_MUTED,
                            border: `1px solid ${BORDER}`,
                            color: FG,
                            outline: 'none',
                            height: '68px',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'color-mix(in srgb, var(--clr-primary) 40%, transparent)';
                            e.target.style.boxShadow = '0 0 0 3px var(--clr-primary-subtle)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = BORDER;
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
                            className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all"
                            style={{
                                background: rating > 0 && !isPending
                                    ? `linear-gradient(135deg, ${PRIMARY}, hsl(169,59%,20%))`
                                    : 'hsl(38,24%,90%)',
                                boxShadow: rating > 0 && !isPending ? '0 6px 24px hsl(169,59%,31%,0.3)' : 'none',
                                color: rating > 0 && !isPending ? 'var(--clr-card)' : MUTED,
                                cursor: rating > 0 && !isPending ? 'pointer' : 'not-allowed',
                            }}
                        >
                            {isPending ? 'Submitting…' : 'Submit Rating'}
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={onComplete}
                            className="w-full py-2.5 rounded-2xl text-sm font-semibold"
                            style={{ color: MUTED }}
                        >
                            Skip for now
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
