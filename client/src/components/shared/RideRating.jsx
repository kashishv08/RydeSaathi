import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitReview } from '../../hooks/useReview';
import { Modal, Button } from '@heroui/react';

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
            await submitReview({
                ride_id: rideId,
                stars: rating,
                comment: comment
            });
            toast.success("Thank you for your feedback!");
            onComplete();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || "Failed to submit rating.";
            toast.error(msg);
            if (msg.includes("already rated")) {
                onComplete();
            }
        }
    };

    return (
        <Modal isOpen={true} onOpenChange={(isOpen) => { if (!isOpen) onComplete() }}>
            <Modal.Backdrop className="bg-black/60 backdrop-blur-md">
                <Modal.Container placement="center">
                    <Modal.Dialog className="sm:max-w-sm w-full rounded-[1.5rem] p-4 shadow-2xl bg-white border-none mx-4">
                        <Modal.Body className="flex flex-col items-center px-2 py-2">
                            <h2 className="text-2xl font-bold tracking-tight text-black mb-1 text-center">
                                Rate your {personRole.toLowerCase()}
                            </h2>
                            <p className="text-gray-500 font-medium text-center mb-4 text-sm">
                                Your feedback helps us improve RydeSaathi.
                            </p>

                            {/* Profile Circle */}
                            <div className="relative mb-3 group">
                                <div className="absolute inset-0 bg-black/5 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-[4px] border-white shadow-lg relative z-10 overflow-hidden">
                                    <User className="w-8 h-8 text-gray-400" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-black mb-4">{personName || 'User'}</h3>

                            {/* Star Rating */}
                            <div className="flex gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star 
                                            className={`w-10 h-10 transition-colors duration-300 ${
                                                (hoverRating || rating) >= star 
                                                    ? 'fill-black text-black drop-shadow-sm' 
                                                    : 'fill-transparent text-gray-300'
                                            }`} 
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Comment Box */}
                            <div className="w-full max-w-sm mb-1">
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Leave a comment (optional)..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none h-16"
                                />
                            </div>
                        </Modal.Body>

                        <Modal.Footer className="flex-col gap-2 px-2 pb-1 pt-2 w-full max-w-sm mx-auto">
                            <Button
                                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-base transition-all shadow-sm ${
                                    rating > 0 && !isPending
                                        ? 'bg-black text-white hover:bg-gray-900'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                                onPress={handleSubmit}
                                isDisabled={isPending || rating === 0}
                            >
                                {isPending ? 'Submitting...' : 'Submit Rating'}
                            </Button>
                            
                            <Button 
                                variant="light"
                                onPress={onComplete}
                                className="w-full py-2 text-gray-500 font-semibold text-sm hover:text-gray-900 transition-colors h-auto"
                            >
                                Skip for now
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
