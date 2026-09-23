"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from 'next/link';
import gsap from "gsap";
import '@/component/landing/hero_section/herosection.css'

const content = [
    {
        line1: "Smart money management,",
        line2: "made simple with Krapook Moo",
        sub: "Track your income, expenses, and pockets effortlessly. Your ultimate personal finance companion",
    },
    {
        line1: "Take charge of your money,",
        line2: "grow your future",
        sub: "Get clear financial insights and take control of your wealth all in one place. Monitor your budgets, analyze spending habits, and build better financial habits with Smart Wealth Tracker",
    },
    {
        line1: "Smart tracking ",
        line2: "for smarter spending",
        sub: "Manage your pockets, analyze your transactions, and master your personal finance with ease",
    },
];

export const Herosection = () => {
    const [index, setIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const headWords = gsap.utils.toArray<HTMLElement>(".headline-word");
            const subWords = gsap.utils.toArray<HTMLElement>(".subline-word");

            const tl = gsap.timeline({
                onComplete: () =>
                    setIndex((prev) => (prev + 1) % content.length),
            });

            tl.fromTo(
                headWords,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power3.out",
                }
            )
                .fromTo(
                    subWords,
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.03,
                        ease: "power3.out",
                    },
                    "-=0.3"
                )
                .to(
                    [...headWords, ...subWords],
                    {
                        y: -30,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.02,
                        ease: "power3.in",
                    },
                    "+=3"
                );
        }, containerRef);

        return () => ctx.revert();
    }, [index]);

    const { line1, line2, sub } = content[index];

    const renderWords = (text: string, prefix: string, className: string) =>
        text.split(" ").map((word, i) => (
            <span
                key={`${prefix}-${index}-${i}`}
                className={`${className} inline-block mr-[0.25em]`}
            >
                {word}
            </span>
        ));

    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-800 animate-dynamic-bg flex items-center justify-center p-4">
            <div className="relative z-10 text-center text-white">
                <div ref={containerRef}
                    className="h-full flex flex-col items-center justify-center gap-6 px-6 pb-10" >
                    <h1 className="text-3xl md:text-5xl xl:text-6xl h-30 md:h-50 2xl:h-60 2xl:text-8xl font-bold text-center leading-10 md:leading-20 xl:leading-20 2xl:leading-30 text-white! mb-10">
                        {renderWords(line1, "l1", "headline-word")}
                        <br />
                        {renderWords(line2, "l2", "headline-word")}
                    </h1>

                    <p className="max-w-2xl text-xl text-center text-white! h-30">
                        {renderWords(sub, "sub", "subline-word")}
                    </p>
                    <div className="w-full flex flex-col md:flex-row justify-center gap-4 md:gap-12 mt-20">
                        <Link href="/login" className="font-semibold px-4 py-3 bg-black text-white md:max-w-62.5 w-full rounded-full hover:bg-emerald-600 hover:text-white transition-all duration-300">
                            Create Your Account
                        </Link>
                        <Link href="/register" className="font-semibold px-4 py-3 bg-white text-emerald-600 md:max-w-62.5 w-full rounded-full hover:bg-emerald-600 hover:text-white transition-all duration-300">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};