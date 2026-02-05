"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function HomeLayout({ children }) {
    const pathname = usePathname();

    const isActive = (href) => pathname.startsWith(href);

    return (
            <div className="min-h-screen bg-gray-50 relative">
                <div className="w-auto pt-4 absolute top-2 left-1/2 -translate-x-1/2 z-10">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <div className="w-full flex items-center justify-center">
                            <nav className="flex items-center gap-2 rounded-full bg-white shadow-lg ring-1 ring-black/5 px-2 py-1">
                                <Link
                                    href="/home/chat"
                                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                        isActive("/home/chat")
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Chat
                                </Link>
                                <Link
                                    href="/home/documents"
                                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                        isActive("/home/documents")
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Documents
                                </Link>
                                <Link
                                    href="/home/profile"
                                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                        isActive("/home/profile")
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Profile
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>

                <div>{children}</div>
            </div>
    );
}
