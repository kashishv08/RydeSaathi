import { useNavigate } from "react-router-dom";
import { ArrowRight, WalletCards, Car, MessageCircle, Users } from "lucide-react";
import { Pill } from "./SharedUI";

const helpfulLinks = [
    { icon: Car, title: "Drive", copy: "Drive your own car or auto." },
    { icon: MessageCircle, title: "Delivery", copy: "Deliver food and packages locally." },
    { icon: Users, title: "Fleet", copy: "Manage multiple vehicles and drivers." },
];

export default function Drive() {
    const navigate = useNavigate();

    return (
        <section id="drive" className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-[.9fr_1.1fr] md:px-10 md:py-28">
            <div className="rounded-[26px] bg-[#e7f1e9] p-7 md:p-10">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1f756d] text-[#fff8e8]"><WalletCards size={22} /></span>
                <h2 className="mt-8 font-display text-4xl font-extrabold tracking-[-.06em]">Your road.<br />Your upside.</h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-[#607873]">Choose when to go online, see the fare before you accept, and get paid weekly. Driving with RydeSaathi fits around your life.</p>
                <button onClick={() => navigate("/driver")} className="cursor-pointer mt-7 rounded-xl bg-[#1f756d] px-5 py-3 text-sm font-extrabold text-[#fff8e8]" data-testid="button-drive-learn">Explore driver mode <ArrowRight size={15} className="ml-1 inline" /></button>
            </div>
            <div className="flex flex-col justify-center">
                <Pill tone="coral">For every kind of day</Pill>
                <h2 className="mt-5 max-w-xl font-display text-4xl font-extrabold tracking-[-.06em] md:text-5xl">From chai runs to airport runs.</h2>
                <div className="mt-8 divide-y divide-[#e5dfd1]">
                    {helpfulLinks.map(({ icon: Icon, title, copy }) => (
                        <div key={title} className="flex gap-4 py-5 first:pt-0">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#faebc8] text-[#8b6922]"><Icon size={18} /></span>
                            <div>
                                <h3 className="font-display font-extrabold">{title}</h3>
                                <p className="mt-1 text-sm text-[#71827e]">{copy}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
