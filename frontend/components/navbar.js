import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import loo from "../public/loo.png";

export default function Navbar() {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-between md:px-12 px-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
                <Image 
                    src={loo} 
                    alt="Metro Link Logo" 
                    width={50} 
                    height={50}
                    className="object-contain"
                />
                <h1 className="text-2xl font-bold">METRO LINK</h1>
            </div>
            <div className="hidden md:visible h-full w-1/3 rounded-full md:flex items-center justify-between px-8 bg-white shadow-2xl">
                <button 
                    onClick={() => scrollToSection('home')}
                    className="hover:text-blue-600 transition-colors"
                >
                    Home
                </button>
                <button 
                    onClick={() => scrollToSection('features')}
                    className="hover:text-blue-600 transition-colors"
                >
                    Features
                </button>
                <button 
                    onClick={() => scrollToSection('about')}
                    className="hover:text-blue-600 transition-colors"
                >
                    About us
                </button>
                <button 
                    onClick={() => scrollToSection('story')}
                    className="hover:text-blue-600 transition-colors"
                >
                    Story
                </button>
            </div>
            <div className=" hover:scale-110 hover:pointer duration-1000">

            <Link href="/login">
                <Button>Get Started</Button>
            </Link>
            </div>
        </div>
    );
}