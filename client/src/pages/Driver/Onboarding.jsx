import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Car, User, Phone, ArrowRight, ArrowLeft,
    Check, Camera, Hash, ShieldCheck, Zap, Sparkles
} from "lucide-react";
import { useDriverProfile, useDriverProfileComplete } from "../../hooks/driver";

const VEHICLE_OPTIONS = [
    { value: "MOTO", label: "Moto", icon: "🏍️", desc: "2-wheeler, fastest lane filtering" },
    { value: "AUTO", label: "Auto", icon: "🛺", desc: "3-wheeler, budget-friendly" },
    { value: "UBER_GO", label: "Uber Go", icon: "🚗", desc: "Compact car, everyday rides" },
    { value: "PREMIER", label: "Premier", icon: "🚙", desc: "Sedan, premium comfort" },
    { value: "UBER_XL", label: "Uber XL", icon: "🚐", desc: "SUV, extra luggage capacity" },
];

function StepIndicator({ step }) {
    return (
        <div className="flex items-center justify-center gap-3 mb-8">
            {[
                { n: 1, label: "Personal Details" },
                { n: 2, label: "Vehicle Setup" },
            ].map(({ n, label }, i) => (
                <div key={n} className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1.5">
                        <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm"
                            style={{
                                background: n < step
                                    ? 'var(--clr-primary)'
                                    : n === step
                                        ? 'linear-gradient(135deg, var(--clr-primary), hsl(169,59%,20%))'
                                        : 'var(--clr-border)',
                                color: n <= step ? 'var(--clr-card)' : 'var(--clr-muted)',
                                boxShadow: n === step ? '0 8px 20px -4px var(--clr-primary)' : 'none',
                                transform: n === step ? 'scale(1.05)' : 'scale(1)',
                            }}
                        >
                            {n < step ? <Check className="w-4 h-4 stroke-[2.5]" /> : n}
                        </div>
                        <span
                            className="text-xs font-semibold tracking-wide"
                            style={{ color: n === step ? 'var(--clr-primary)' : 'var(--clr-muted)' }}
                        >
                            {label}
                        </span>
                    </div>
                    {i < 1 && (
                        <div
                            className="w-16 h-0.5 mt-[-20px] rounded-full transition-all duration-500"
                            style={{ background: step > 1 ? 'var(--clr-primary)' : 'var(--clr-border)' }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

function InputField({ label, id, icon: Icon, error, ...props }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--clr-muted)' }}>
                {label}
            </label>
            <div
                className="relative rounded-2xl transition-all duration-200 border"
                style={{
                    background: 'var(--clr-bg)',
                    borderColor: error
                        ? 'var(--clr-destructive)'
                        : isFocused
                            ? 'var(--clr-primary)'
                            : 'var(--clr-border)',
                    boxShadow: isFocused ? '0 0 0 4px hsl(174, 58%, 29%, 0.12)' : 'none'
                }}
            >
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Icon className="h-4 w-4 transition-colors" style={{ color: isFocused ? 'var(--clr-primary)' : 'var(--clr-muted)' }} />
                    </div>
                )}
                <input
                    id={id}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full py-3.5 pr-4 bg-transparent text-sm font-medium transition-all focus:outline-none"
                    style={{
                        paddingLeft: Icon ? '2.5rem' : '1rem',
                        color: 'var(--clr-foreground)',
                    }}
                    {...props}
                />
            </div>
            {error && <p className="text-xs font-medium pl-1 animate-shake" style={{ color: 'var(--clr-destructive)' }}>{error}</p>}
        </div>
    );
}

export default function Onboarding() {
    const navigate = useNavigate();
    const { data: profileResponse, isLoading } = useDriverProfile();
    const { mutateAsync: completeProfile, isPending } = useDriverProfileComplete();

    const [step, setStep] = useState(1);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        vehicle_type: "MOTO",
        plate_number: "",
        avatar: null,
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (profileResponse?.data?.vehicle) {
            navigate("/driver", { replace: true });
        }
    }, [profileResponse, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
            setAvatarPreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, avatar: null }));
        }
    };

    const validateField = (name, value) => {
        switch (name) {
            case "first_name":
                if (!value.trim()) return "First name is required";
                if (value.trim().length < 2) return "Must be at least 2 characters";
                if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return "Only letters, spaces, hyphens and apostrophes allowed";
                return null;
            case "last_name":
                if (!value.trim()) return "Last name is required";
                if (value.trim().length < 2) return "Must be at least 2 characters";
                if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return "Only letters, spaces, hyphens and apostrophes allowed";
                return null;
            case "phone":
                if (!value.trim()) return "Phone number is required";
                if (!/^[+]?[\d]{7,15}$/.test(value.replace(/[\s\-()]/g, ""))) return "Enter a valid phone number (7–15 digits)";
                return null;
            case "plate_number":
                if (!value.trim()) return "Plate number is required";
                if (value.trim().length < 4) return "Plate number is too short";
                if (!/^[A-Za-z0-9\s\-]+$/.test(value.trim())) return "Only letters, numbers, spaces and hyphens allowed";
                return null;
            default:
                return null;
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.avatar) newErrors.avatar = "Profile photo is required";
        const firstErr = validateField("first_name", formData.first_name);
        if (firstErr) newErrors.first_name = firstErr;
        const lastErr = validateField("last_name", formData.last_name);
        if (lastErr) newErrors.last_name = lastErr;
        const phoneErr = validateField("phone", formData.phone);
        if (phoneErr) newErrors.phone = phoneErr;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        const plateErr = validateField("plate_number", formData.plate_number);
        if (plateErr) newErrors.plate_number = plateErr;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;
        setSubmitError(null);

        const payload = new FormData();
        payload.append("first_name", formData.first_name);
        payload.append("last_name", formData.last_name);
        payload.append("phone", formData.phone);
        payload.append("vehicle_type", formData.vehicle_type);
        payload.append("plate_number", formData.plate_number.toUpperCase());
        if (formData.avatar) payload.append("avatar", formData.avatar);

        try {
            await completeProfile(payload);
            navigate("/driver", { replace: true });
        } catch (err) {
            setSubmitError(err.response?.data?.error || "Something went wrong. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--clr-bg)' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--clr-border)', borderTopColor: 'var(--clr-primary)' }} />
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--clr-muted)' }}>Loading Profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex w-full overflow-hidden" style={{ background: 'var(--clr-bg)', fontFamily: 'var(--app-font-sans)' }}>

            {/* Left Brand Panel — sticky, never scrolls */}
            <div className="hidden lg:flex lg:w-1/2 flex-shrink-0 sticky top-0 h-screen relative overflow-hidden flex-col justify-between p-16" style={{ background: 'var(--clr-foreground)' }}>
                <img
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
                    alt="Driver Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(186,45%,6%)] via-[hsl(186,45%,12%,0.6)] to-transparent" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-white/10 backdrop-blur-md border border-white/15">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-white font-bold tracking-wider text-lg">RydeSaathi Partner</span>
                </div>

                <div className="relative z-10 space-y-6 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                        <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 animate-pulse" />
                        Fast-Track Onboarding
                    </div>
                    <h2 className="text-5xl font-extrabold text-white tracking-tight leading-tight" style={{ fontFamily: 'var(--app-font-display)' }}>
                        Drive on your terms, earn beyond limits.
                    </h2>
                    <p className="text-base text-gray-300 leading-relaxed">
                        Join thousands of verified drivers growing their revenue streams through priority dispatching and zero hidden fees.
                    </p>

                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
                        {[
                            { stat: "2 Mins", label: "Quick setup" },
                            { stat: "3×", label: "Income Boost" },
                            { stat: "100%", label: "Secure Payouts" },
                        ].map(({ stat, label }) => (
                            <div key={stat} className="space-y-1">
                                <p className="text-2xl font-black text-emerald-400">{stat}</p>
                                <p className="text-xs text-gray-400 font-medium">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-gray-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Verified & Encrypted Partner Ecosystem
                </div>
            </div>

            {/* Right Form Container — independently scrollable */}
            <div className="w-full lg:w-1/2 h-screen overflow-y-auto flex items-start justify-center p-6 sm:p-10 lg:p-16">
                <div className="w-full max-w-md space-y-8">

                    <div className="space-y-2 text-center lg:text-left">
                        <div className="inline-flex lg:hidden w-12 h-12 rounded-2xl items-center justify-center mb-2 shadow-md" style={{ background: 'var(--clr-primary)' }}>
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--clr-foreground)', fontFamily: 'var(--app-font-display)' }}>
                            {step === 1 ? "Personal Profile" : "Vehicle Details"}
                        </h1>
                        <p className="text-sm font-medium" style={{ color: 'var(--clr-muted)' }}>
                            {step === 1 ? "Setup your rider identity & contact" : "Configure your primary earning vehicle"}
                        </p>
                    </div>

                    <StepIndicator step={step} />

                    {submitError && (
                        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-semibold border bg-red-500/10 border-red-500/20 text-red-500 animate-shake">
                            <span className="text-sm">⚠️</span>
                            <span>{submitError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-5 animate-fadeIn">
                                {/* Interactive Avatar Uploader */}
                                <div
                                    className="flex items-center gap-5 p-4 rounded-2xl border transition-colors"
                                    style={{
                                        background: 'var(--clr-card)',
                                        borderColor: errors.avatar ? 'var(--clr-destructive)' : 'var(--clr-border)'
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed flex-shrink-0 group transition-all"
                                        style={{
                                            borderColor: errors.avatar ? 'var(--clr-destructive)' : avatarPreview ? 'var(--clr-primary)' : 'var(--clr-border)',
                                            background: 'var(--clr-bg)'
                                        }}
                                    >
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full gap-1" style={{ color: errors.avatar ? 'var(--clr-destructive)' : 'var(--clr-muted)' }}>
                                                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-bold uppercase">Upload</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                                            <Camera className="w-5 h-5 text-white" />
                                        </div>
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

                                    <div className="space-y-1">
                                        <p className="text-sm font-bold" style={{ color: 'var(--clr-foreground)' }}>
                                            Profile Picture <span style={{ color: 'var(--clr-destructive)' }}>*</span>
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--clr-muted)' }}>Upload a clear photo for client safety matching.</p>
                                        {avatarPreview
                                            ? <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1 pt-1">✓ Photo ready</p>
                                            : errors.avatar && <p className="text-xs font-semibold pt-1" style={{ color: 'var(--clr-destructive)' }}>⚠ {errors.avatar}</p>
                                        }
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="First Name" id="first_name" name="first_name" type="text" placeholder="John" value={formData.first_name} onChange={handleChange} onBlur={handleBlur} error={errors.first_name} icon={User} />
                                    <InputField label="Last Name" id="last_name" name="last_name" type="text" placeholder="Doe" value={formData.last_name} onChange={handleChange} onBlur={handleBlur} error={errors.last_name} />
                                </div>

                                <InputField label="Phone Number" id="phone" name="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} onBlur={handleBlur} error={errors.phone} icon={Phone} />

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer active:scale-[0.99]"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--clr-primary), hsl(169,59%,20%))',
                                        color: '#ffffff',
                                        boxShadow: '0 10px 25px -5px var(--clr-primary)',
                                    }}
                                >
                                    Proceed to Vehicle Info <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5">
                                <div className="space-y-3">
                                    <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--clr-muted)' }}>Select Vehicle Class</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {VEHICLE_OPTIONS.map((opt) => {
                                            const selected = formData.vehicle_type === opt.value;
                                            return (
                                                <label
                                                    key={opt.value}
                                                    htmlFor={`vtype-${opt.value}`}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-all hover:-translate-y-px"
                                                    style={{
                                                        borderColor: selected ? 'var(--clr-primary)' : 'var(--clr-border)',
                                                        background: selected
                                                            ? 'linear-gradient(135deg, hsl(174,58%,29%,0.10), hsl(174,58%,29%,0.04))'
                                                            : 'var(--clr-card)',
                                                        boxShadow: selected ? 'inset 0 0 0 1.5px var(--clr-primary), 0 4px 16px hsl(174,58%,29%,0.12)' : 'none',
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        id={`vtype-${opt.value}`}
                                                        name="vehicle_type"
                                                        value={opt.value}
                                                        checked={selected}
                                                        onChange={handleChange}
                                                        className="hidden"
                                                    />
                                                    <span
                                                        className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                                                        style={{ background: selected ? 'hsl(174,58%,29%,0.12)' : 'var(--clr-muted)' }}
                                                    >
                                                        {opt.icon}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold" style={{ color: selected ? 'var(--clr-primary)' : 'var(--clr-foreground)' }}>{opt.label}</p>
                                                        <p className="text-xs" style={{ color: 'var(--clr-muted)' }}>{opt.desc}</p>
                                                    </div>
                                                    <div
                                                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                                                        style={{
                                                            borderColor: selected ? 'var(--clr-primary)' : 'var(--clr-border)',
                                                            background: selected ? 'var(--clr-primary)' : 'transparent',
                                                        }}
                                                    >
                                                        {selected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--clr-muted)' }}>License Plate Number</label>
                                    <div
                                        className="flex items-center rounded-2xl border overflow-hidden transition-all duration-200"
                                        style={{ background: 'var(--clr-bg)', borderColor: errors.plate_number ? 'var(--clr-destructive)' : 'var(--clr-border)' }}
                                    >
                                        <span
                                            className="pl-4 text-xs font-bold self-stretch flex items-center flex-shrink-0"
                                            style={{ color: 'var(--clr-primary)' }}
                                        >#</span>
                                        <input
                                            id="plate_number"
                                            name="plate_number"
                                            type="text"
                                            placeholder="MH 01 AB 1234"
                                            value={formData.plate_number}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="flex-1 py-3.5 px-3 bg-transparent text-sm font-medium focus:outline-none"
                                            style={{ color: 'var(--clr-foreground)', textTransform: 'uppercase' }}
                                        />
                                    </div>
                                    {errors.plate_number && <p className="mt-1 text-xs font-medium pl-1" style={{ color: 'var(--clr-destructive)' }}>{errors.plate_number}</p>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-1/3 py-4 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5"
                                        style={{ borderColor: 'var(--clr-border)', color: 'var(--clr-muted)', background: 'var(--clr-card)' }}
                                    >
                                        <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.99]"
                                        style={{
                                            background: 'linear-gradient(135deg, var(--clr-primary), hsl(169,59%,20%))',
                                            color: '#ffffff',
                                            boxShadow: '0 10px 25px -5px var(--clr-primary)',
                                        }}
                                    >
                                        {isPending ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Finalizing Setup...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4 stroke-[2.5]" /> Complete Setup
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <p className="text-center text-xs font-medium pt-2" style={{ color: 'var(--clr-muted)' }}>
                        🔒 Your data is fully secure and handled under safety regulations.
                    </p>
                </div>
            </div>
        </div>
    );
}