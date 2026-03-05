import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Card = {
    id: number | string;
    content: React.ReactNode;
};

export const CardStack = ({
    items,
    initialIndex = 0,
    autoAdvance = false,
    intervalMs = 3000,
    pauseOnHover = true,
    showDots = true,
}: {
    items: {
        id: number | string;
        content: React.ReactNode;
    }[];
    initialIndex?: number;
    autoAdvance?: boolean;
    intervalMs?: number;
    pauseOnHover?: boolean;
    showDots?: boolean;
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [cards, setCards] = useState<Card[]>(items as Card[]);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        setCards(items as Card[]);
    }, [items]);

    useEffect(() => {
        let interval: any;

        if (autoAdvance && !isHovering) {
            interval = setInterval(() => {
                handleNext();
            }, intervalMs);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoAdvance, intervalMs, isHovering, cards.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    return (
        <div
            className="relative w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center perspective-1000"
            onMouseEnter={() => pauseOnHover && setIsHovering(true)}
            onMouseLeave={() => pauseOnHover && setIsHovering(false)}
        >
            {/* No Arrows per new reference */}

            <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
                {cards.map((card, index) => {
                    // Calculate relative index to create the circular carousel effect
                    let relativeIndex = index - currentIndex;

                    // Adjust for circular wrapping
                    if (relativeIndex < -Math.floor(cards.length / 2)) {
                        relativeIndex += cards.length;
                    } else if (relativeIndex > Math.floor(cards.length / 2)) {
                        relativeIndex -= cards.length;
                    }

                    // Determine visibility and styles based on relative position
                    const isVisible = Math.abs(relativeIndex) <= 2; // Show only 2 neighbors

                    if (!isVisible) return null;

                    return (
                        <motion.div
                            key={card.id}
                            className="absolute w-[300px] md:w-[600px] h-[200px] md:h-[340px] rounded-3xl shadow-xl cursor-pointer bg-white"
                            initial={false}
                            animate={{
                                x: relativeIndex * 200, // Tighter overlap to fit container
                                z: Math.abs(relativeIndex) * -200,
                                scale: 1 - Math.abs(relativeIndex) * 0.15,
                                zIndex: 100 - Math.abs(relativeIndex),
                                rotateY: relativeIndex * -25,
                                opacity: 1 - Math.abs(relativeIndex) * 0.1,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                            onClick={() => {
                                if (relativeIndex !== 0) {
                                    setCurrentIndex((currentIndex + relativeIndex + cards.length) % cards.length);
                                }
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(_, { offset }) => {
                                if (offset.x > 50) handlePrev();
                                else if (offset.x < -50) handleNext();
                            }}
                        >
                            <div className="w-full h-full pointer-events-none user-select-none">
                                {card.content}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Pagination Dots */}
            {showDots && (
                <div className="absolute -bottom-6 flex gap-2">
                    {cards.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
