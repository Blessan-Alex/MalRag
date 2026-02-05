"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/navbar";
import Features from "@/components/features";
import About from "@/components/aboutus";
import ProjectStory from "@/components/project-story";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

gsap.registerPlugin(useGSAP);

export default function Home() {
    const backgroundRef = useRef(null);
    const headingRef = useRef(null);
    const colorRef = useRef(null);
    const navRef = useRef(null);
    const lottieRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.to(backgroundRef.current, {
            width: "100%",
            delay: 0.5,
            duration: 1,
            ease: "expo.inOut",
        });
        tl.to(headingRef.current.querySelectorAll("h1"), {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
        }).to(
            navRef.current,
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
            },
            "<"
        ).to(lottieRef.current, {
            alpha: 1,
            y:0,
            duration: 0.6,
            ease: "power2.out",
        }, "<");
        tl.to(colorRef.current, {
            backgroundColor: "#f5f5f5",
            duration: 0.2,
        });
    }, []);
    return (
        <div
            ref={colorRef}
            className="h-full w-full flex items-center flex-col justify-center bg-neutral-900"
        >
            <div
                id="home"
                ref={backgroundRef}
                className="h-screen w-0 flex flex-col items-center justify-center origin-center bg-neutral-100"
            >
                <div
                    ref={navRef}
                    className="h-1/12 w-full flex items-center justify-center py-2 opacity-0 -translate-y-2"
                >
                    <Navbar />
                </div>
                <div className="h-full w-full flex items-center justify-center">
                    <div
                        ref={headingRef}
                        className="h-full w-full hover:translate-x-2 transition-all duration-500 flex flex-col justify-center space-y-4 md:pl-16 pl-4"
                    >
                        <h1 className="text-4xl  opacity-0 translate-y-4 md:text-7xl font-sans font-bold ">
                            YOUR DOCUMENTS KNOW
                        </h1>
                        <h1 className="text-4xl opacity-0 translate-y-4 md:text-7xl font-sans font-bold ">
                            EVERYTHING
                        </h1>
                        <h1 className="text-4xl opacity-0 translate-y-4 md:text-7xl font-sans font-bold">
                            JUST ASK THEM
                        </h1>
                        <h1 className="text-2xl opacity-0 translate-y-4 md:text-3xl font-sans font-light mt-8">
                            Stop wasting time searching through files. Ask your
                            documents directly. Get the information you need
                            instantly.
                        </h1>
                    </div>
                    <div className=" hidden md:visible md:h-12 md:w-full md:flex items-center justify-center">
                        <div ref={lottieRef} className="w-full m-16  hover:scale-105 duration-700 aspect-square flex items-center justify-center opacity-0 translate-y-4">
                            <DotLottieReact
                                height={600}
                                width={600}
                                src="/AI data.lottie"
                                loop
                                autoplay
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div id="features" className="h-[120vh] w-full flex items-center justify-center rounded-t-[90px]" style={{ backgroundColor: '#070908' }}>
                <Features />
            </div>
            <div id="about" className="h-screen w-full flex items-center justify-center bg-neutral-100">
                <About />
            </div>
            <div id="story" className="w-full">
                <ProjectStory />
            </div>
        </div>
    );
}
