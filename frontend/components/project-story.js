"use client";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

export default function ProjectStory() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

    const teamMembers = [
        "John Smith", "Sarah Johnson", "Michael Chen", 
        "Emily Rodriguez", "David Kim", "Lisa Wang",
        "Alex Thompson", "Maria Garcia", "James Wilson"
    ];

    return (
        <div ref={containerRef} className="relative bg-white">
            {/* Main Content */}
            <motion.div 
                style={{ y, opacity }}
                className="relative z-10 py-32"
            >
                <div className="max-w-6xl mx-auto px-6">
                    {/* Hero Title */}
                    <motion.div 
                        ref={sectionRef}
                        initial={{ opacity: 0, y: 50 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center mb-24"
                    >
                        <div className="w-32 h-1 bg-black mx-auto rounded-full"></div>
                    </motion.div>

                    {/* Story Sections */}
                    <div className="space-y-32">
                        {/* Section 1: The Vision */}
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                        >
                            <div>
                                <div className="text-gray-600 text-sm font-bold tracking-wider uppercase mb-4">
                                    01. The Vision
                                </div>
                                <h3 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight tracking-tight">
                                    Revolutionizing Document Intelligence
                                </h3>
                                <p className="text-xl text-gray-700 leading-relaxed font-light">
                                    Metro Link was born from a simple yet profound realization: organizations were drowning in documents. 
                                    Teams spent countless hours searching through files, losing productivity, and missing critical information. 
                                    We envisioned a world where documents could speak directly to users, providing instant, accurate answers 
                                    through the power of artificial intelligence.
                                </p>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="relative"
                            >
                                <div className="w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 flex items-center justify-center relative overflow-hidden">
                                    {/* Animated background pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-4 left-4 w-2 h-2 bg-black rounded-full animate-pulse"></div>
                                        <div className="absolute top-8 right-8 w-1 h-1 bg-black rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                        <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-black rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                                        <div className="absolute bottom-4 right-4 w-2 h-2 bg-black rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                                    </div>
                                    {/* Main visual */}
                                    <div className="relative z-10">
                                        <div className="w-32 h-32 border-4 border-black rounded-full flex items-center justify-center mb-4">
                                            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                                                <div className="w-8 h-8 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-black tracking-wider">VISION</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Section 2: The Architecture */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="relative order-2 lg:order-1"
                            >
                                <div className="w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 flex items-center justify-center relative overflow-hidden">
                                    {/* Animated grid pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                                            {Array.from({length: 64}).map((_, i) => (
                                                <div key={i} className="border border-black"></div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Main visual */}
                                    <div className="relative z-10">
                                        <div className="space-y-3">
                                            <div className="flex space-x-2 justify-center">
                                                <div className="w-8 h-8 bg-black"></div>
                                                <div className="w-8 h-8 bg-black"></div>
                                                <div className="w-8 h-8 bg-black"></div>
                                            </div>
                                            <div className="flex space-x-2 justify-center">
                                                <div className="w-8 h-8 bg-gray-400"></div>
                                                <div className="w-8 h-8 bg-black"></div>
                                                <div className="w-8 h-8 bg-gray-400"></div>
                                            </div>
                                            <div className="flex space-x-2 justify-center">
                                                <div className="w-8 h-8 bg-gray-400"></div>
                                                <div className="w-8 h-8 bg-gray-400"></div>
                                                <div className="w-8 h-8 bg-black"></div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-black tracking-wider mt-4">ARCHITECTURE</div>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="order-1 lg:order-2">
                                <div className="text-gray-600 text-sm font-bold tracking-wider uppercase mb-4">
                                    02. The Architecture
                                </div>
                                <h3 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight tracking-tight">
                                    Built for Scale & Performance
                                </h3>
                                <p className="text-xl text-gray-700 leading-relaxed font-light">
                                    Our architecture leverages cutting-edge technologies: Neo4j for graph-based document relationships, 
                                    PostgreSQL for structured data, Redis for lightning-fast caching, and OpenSearch for semantic search. 
                                    The RAG (Retrieval-Augmented Generation) engine powered by advanced LLMs ensures accurate, contextual responses 
                                    while maintaining enterprise-grade security and scalability.
                                </p>
                            </div>
                        </motion.div>

                        {/* Section 3: The Innovation */}
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                        >
                            <div>
                                <div className="text-gray-600 text-sm font-bold tracking-wider uppercase mb-4">
                                    03. The Innovation
                                </div>
                                <h3 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight tracking-tight">
                                    AI-Powered Document Intelligence
                                </h3>
                                <p className="text-xl text-gray-700 leading-relaxed font-light">
                                    We developed proprietary algorithms for document processing, combining OCR with SpaCy for intelligent 
                                    text extraction, quality assessment systems, and multi-modal understanding. Our system can process 
                                    documents from multiple sources - WhatsApp Business, Maximo, SharePoint, and email servers - 
                                    creating a unified knowledge base that grows smarter with every interaction.
                                </p>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="relative"
                            >
                                <div className="w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 flex items-center justify-center relative overflow-hidden">
                                    {/* Animated neural network pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <circle cx="20" cy="20" r="2" fill="black" className="animate-pulse"/>
                                            <circle cx="80" cy="20" r="2" fill="black" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
                                            <circle cx="20" cy="80" r="2" fill="black" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
                                            <circle cx="80" cy="80" r="2" fill="black" className="animate-pulse" style={{animationDelay: '0.9s'}}/>
                                            <circle cx="50" cy="50" r="3" fill="black" className="animate-pulse" style={{animationDelay: '1.2s'}}/>
                                            <line x1="20" y1="20" x2="50" y2="50" stroke="black" strokeWidth="0.5"/>
                                            <line x1="80" y1="20" x2="50" y2="50" stroke="black" strokeWidth="0.5"/>
                                            <line x1="20" y1="80" x2="50" y2="50" stroke="black" strokeWidth="0.5"/>
                                            <line x1="80" y1="80" x2="50" y2="50" stroke="black" strokeWidth="0.5"/>
                                        </svg>
                                    </div>
                                    {/* Main visual */}
                                    <div className="relative z-10">
                                        <div className="space-y-4">
                                            <div className="flex justify-center space-x-1">
                                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                            </div>
                                            <div className="w-16 h-16 border-2 border-black rounded-lg flex items-center justify-center">
                                                <div className="w-8 h-8 border border-black rounded"></div>
                                            </div>
                                            <div className="flex justify-center space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-black tracking-wider mt-4">INNOVATION</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Section 4: The Impact */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="relative order-2 lg:order-1"
                            >
                                <div className="w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 flex items-center justify-center relative overflow-hidden">
                                    {/* Animated chart pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <svg className="w-full h-full" viewBox="0 0 100 100">
                                            <polyline points="10,80 25,60 40,40 55,25 70,15 85,10" 
                                                     fill="none" stroke="black" strokeWidth="2"/>
                                            <polyline points="10,80 25,70 40,50 55,35 70,20 85,15" 
                                                     fill="none" stroke="black" strokeWidth="1" opacity="0.5"/>
                                        </svg>
                                    </div>
                                    {/* Main visual */}
                                    <div className="relative z-10">
                                        <div className="space-y-3">
                                            {/* Bar chart */}
                                            <div className="flex items-end space-x-2 justify-center h-16">
                                                <div className="w-3 bg-black" style={{height: '40%'}}></div>
                                                <div className="w-3 bg-gray-400" style={{height: '60%'}}></div>
                                                <div className="w-3 bg-black" style={{height: '80%'}}></div>
                                                <div className="w-3 bg-gray-400" style={{height: '100%'}}></div>
                                                <div className="w-3 bg-black" style={{height: '70%'}}></div>
                                            </div>
                                            {/* Percentage indicators */}
                                            <div className="flex justify-center space-x-4 text-xs font-bold">
                                                <span className="text-black">80%</span>
                                                <span className="text-gray-600">95%</span>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-black tracking-wider mt-4">IMPACT</div>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="order-1 lg:order-2">
                                <div className="text-gray-600 text-sm font-bold tracking-wider uppercase mb-4">
                                    04. The Impact
                                </div>
                                <h3 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight tracking-tight">
                                    Transforming How Teams Work
                                </h3>
                                <p className="text-xl text-gray-700 leading-relaxed font-light">
                                    Metro Link has revolutionized document workflows across organizations. Teams now spend 80% less time 
                                    searching for information, with 95% accuracy in document queries. Our conversational AI interface 
                                    makes complex document interactions feel natural, while our role-based dashboards provide insights 
                                    that drive informed decision-making across all levels of the organization.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                   
                </div>
            </motion.div>
        </div>
    );
}