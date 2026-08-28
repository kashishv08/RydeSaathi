import { Pill } from "./SharedUI";

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
            <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]">
                <div>
                    <Pill>Simple by design</Pill>
                    <h2 className="mt-5 max-w-md font-display text-4xl font-extrabold leading-[1.02] tracking-[-.06em] md:text-5xl">Less waiting.<br /><span className="text-[#e57453]">More living.</span></h2>
                    <p className="mt-5 max-w-sm text-sm leading-6 text-[#71827e]">From your first tap to the final hello, every part of your ride is made to feel predictable.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    {[["01", "Tell us where", "Drop a pin or type a landmark you know."], ["02", "Choose your way", "A quick bike, an auto with room, or a car."], ["03", "Go with ease", "Track your Saathi and settle in."]].map(([num, title, copy]) => (
                        <div key={num} className="rounded-2xl border border-[#e5dfd1] bg-[#fffaf0] p-5 shadow-card">
                            <span className="font-mono text-xs font-bold text-[#e57453]">{num}</span>
                            <h3 className="mt-12 font-display text-lg font-extrabold">{title}</h3>
                            <p className="mt-2 text-sm leading-6 text-[#71827e]">{copy}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
