import { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

const OTP_EXPIRY_SECONDS = 120;

export function OtpTimer({ onResend, isSending }) {
    const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
    const intervalRef = useRef(null);

    const startTimer = () => {
        setSecondsLeft(OTP_EXPIRY_SECONDS);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        startTimer();
        return () => clearInterval(intervalRef.current);
    }, []);

    const handleResend = () => {
        onResend();
        startTimer();
    };

    const progress = (secondsLeft / OTP_EXPIRY_SECONDS) * 100;
    const expired = secondsLeft === 0;

    const getColor = () => {
        if (secondsLeft > 60) return 'var(--clr-primary)';
        if (secondsLeft > 30) return 'hsl(40, 80%, 45%)';
        return 'hsl(1, 75%, 55%)';
    };

    return (
        <div className="space-y-2.5">
            {/* Animated progress bar */}
            <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--clr-border)' }}>
                <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{
                        width: `${progress}%`,
                        background: getColor(),
                        boxShadow: expired ? 'none' : `0 0 8px ${getColor()}99`,
                    }}
                />
            </div>

            {/* Timer text + Resend button */}
            <div className="flex items-center justify-between">
                {expired ? (
                    <span className="text-xs font-medium" style={{ color: 'var(--clr-muted)' }}>
                        Didn't get the code?
                    </span>
                ) : (
                    <span className="text-xs font-medium" style={{ color: 'var(--clr-muted)' }}>
                        Resend in{' '}
                        <span className="font-bold tabular-nums" style={{ color: getColor() }}>
                            {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
                        </span>
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={!expired || isSending}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    style={{
                        color: expired ? 'var(--clr-primary)' : 'var(--clr-muted)',
                        background: expired ? 'hsl(174,58%,29%,0.08)' : 'transparent',
                        border: `1px solid ${expired ? 'hsl(174,58%,29%,0.2)' : 'transparent'}`,
                    }}
                >
                    <RotateCcw className={`w-3 h-3 ${isSending ? 'animate-spin' : ''}`} />
                    {isSending ? 'Sending...' : 'Resend'}
                </button>
            </div>
        </div>
    );
}

export function OtpInput({ value, onChange, autoFocus }) {
    const inputRefs = useRef([]);
    const digits = value.padEnd(6, ' ').split('').slice(0, 6);

    const focusSlot = (i) => inputRefs.current[i]?.focus();

    const handleKeyDown = (e, i) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const arr = value.split('');
            if (arr[i] && arr[i].trim()) {
                arr[i] = '';
                onChange(arr.join('').trimEnd());
            } else if (i > 0) {
                arr[i - 1] = '';
                onChange(arr.join('').trimEnd());
                focusSlot(i - 1);
            }
        } else if (e.key === 'ArrowLeft' && i > 0) focusSlot(i - 1);
        else if (e.key === 'ArrowRight' && i < 5) focusSlot(i + 1);
    };

    const handleInput = (e, i) => {
        const char = e.target.value.replace(/\D/g, '').slice(-1);
        if (!char) return;
        const arr = value.padEnd(6, '').split('');
        arr[i] = char;
        onChange(arr.join('').slice(0, 6).trimEnd());
        if (i < 5) focusSlot(i + 1);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted);
        focusSlot(Math.min(pasted.length, 5));
    };

    useEffect(() => { if (autoFocus) focusSlot(0); }, [autoFocus]);

    return (
        <div className="flex gap-3 w-full justify-center">
            {[0, 1, 2, 3, 4, 5].map((i) => {
                const filled = value.length > i;
                return (
                    <input
                        key={i}
                        ref={el => inputRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={filled ? value[i] : ''}
                        onKeyDown={e => handleKeyDown(e, i)}
                        onInput={e => handleInput(e, i)}
                        onPaste={handlePaste}
                        onChange={() => { }}
                        className="w-12 h-12 text-center text-lg font-bold rounded-xl outline-none transition-all duration-150 border-2"
                        style={{
                            borderColor: filled ? 'var(--clr-primary)' : 'var(--clr-border)',
                            background: filled ? 'hsl(174,58%,29%,0.06)' : 'hsl(0,0%,98%)',
                            color: 'var(--clr-foreground)',
                            caretColor: 'transparent',
                        }}
                        onFocus={e => { e.target.style.borderColor = 'var(--clr-primary)'; e.target.style.boxShadow = '0 0 0 3px hsl(174,58%,29%,0.12)'; }}
                        onBlur={e => { e.target.style.borderColor = filled ? 'var(--clr-primary)' : 'var(--clr-border)'; e.target.style.boxShadow = 'none'; }}
                    />
                );
            })}
        </div>
    );
}
