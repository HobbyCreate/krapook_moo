"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

import awsLogo from "@/public/icons/aws-light.webp";
import dockerLogo from "@/public/icons/docker.webp";
import expressLogo from "@/public/icons/express-dark.png";
import gitLogo from "@/public/icons/github-light.webp";
import nextLogo from "@/public/icons/nextjs.webp";
import nodeLogo from "@/public/icons/nodejs.webp";
import jsLogo from "@/public/icons/javascript.webp";
import tsLogo from "@/public/icons/typescript.webp";
import postgresLogo from "@/public/icons/postgresql.webp";
import supabaseLogo from "@/public/icons/supabase.webp";
import tailwindLogo from "@/public/icons/tailwind.webp";
import tanstackLogo from "@/public/icons/tanstack-dark.png";
import prismaLogo from "@/public/icons/prisma.png";

const wrapImage = [
    { imgSrc: awsLogo, imgDesc: "AWS", imgLink: "https://aws.amazon.com/" },
    { imgSrc: dockerLogo, imgDesc: "Docker", imgLink: "https://www.docker.com/" },
    { imgSrc: expressLogo, imgDesc: "Express.js", imgLink: "https://expressjs.com/" },
    { imgSrc: gitLogo, imgDesc: "GitHub", imgLink: "https://github.com/" },
    { imgSrc: nextLogo, imgDesc: "Next.js", imgLink: "https://nextjs.org/" },
    { imgSrc: nodeLogo, imgDesc: "Node.js", imgLink: "https://nodejs.org/" },
    { imgSrc: jsLogo, imgDesc: "JavaScript", imgLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { imgSrc: tsLogo, imgDesc: "TypeScript", imgLink: "https://www.typescriptlang.org/" },
    { imgSrc: postgresLogo, imgDesc: "PostgreSQL", imgLink: "https://www.postgresql.org/" },
    { imgSrc: supabaseLogo, imgDesc: "Supabase", imgLink: "https://supabase.com/" },
    { imgSrc: tailwindLogo, imgDesc: "Tailwind CSS", imgLink: "https://tailwindcss.com/" },
    { imgSrc: tanstackLogo, imgDesc: "TanStack", imgLink: "https://tanstack.com/" },
    { imgSrc: prismaLogo, imgDesc: "Prisma", imgLink: "https://prisma.io/" },
];

export const Toolsection = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    useLayoutEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".technology-card");
            const firstSetWidth = cards
                .slice(0, wrapImage.length)
                .reduce((total, card) => total + card.offsetWidth, 0);

            const gap = 32; 
            const distance = firstSetWidth + gap * wrapImage.length;

            tweenRef.current = gsap.to(track, {
                x: -distance,
                duration: 25,
                ease: "none",
                repeat: -1,
            });
        }, trackRef);

        return () => ctx.revert();
    }, []);

    const handleMouseEnter = () => {
        tweenRef.current?.pause();
    };

    const handleMouseLeave = () => {
        tweenRef.current?.resume();
    };

    return (
        <div className="w-full py-20 bg-black overflow-hidden px-6 md:px-10">
            <div className="">
                <h2 className="text-md md:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-200! uppercase">Technology</h2>
            </div>
            
            <div 
                className="w-full overflow-hidden pt-10 md:pt-16 pb-4" 
                style={{
                    maskImage: "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%)",
                    WebkitMaskImage: "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%)",
                }}
            >
                <div ref={trackRef} className="flex gap-8 w-max">
                    {[...wrapImage, ...wrapImage].map((item, index) => {
                        const isFirstSet = index < wrapImage.length;
                        const keyPrefix = isFirstSet ? "first" : "second";

                        return (
                            <Link 
                                href={item.imgLink} 
                                target="_blank" 
                                key={`${keyPrefix}-${item.imgDesc}-${index}`}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="technology-card relative group w-50 h-28 cursor-pointer shrink-0 border-2 border-gray-600 rounded-xl grid place-content-center p-1 transition-all duration-300 ease-out hover:border-white hover:bg-zinc-900 hover:scale-105 transform-gpu will-change-transform"
                                >
                                <Image
                                    src={item.imgSrc}
                                    width={50}
                                    height={50}
                                    alt={item.imgDesc}
                                    className="object-contain"
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                                    {item.imgDesc}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};