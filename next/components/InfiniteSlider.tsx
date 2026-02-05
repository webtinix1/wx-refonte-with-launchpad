"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";

interface InfiniteSliderProps {
    children: React.ReactNode[];
    direction?: "horizontal" | "vertical";
    speed?: number;
    speedOnHover?: number;
    className?: string;
    itemsVisibleOnscreen?: number;
    gap?: number;
}

export const InfiniteSlider = ({
    children,
    direction = "horizontal",
    speed = 50,
    speedOnHover = 20,
    className = "",
    itemsVisibleOnscreen = 5,
    gap = 20,
}: InfiniteSliderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [currentSpeed, setCurrentSpeed] = useState(speed);
    const [contentSize, setContentSize] = useState(0);
    const baseTranslation = useMotionValue(0);

    // Dupliquer suffisamment pour couvrir l'écran
    const duplicatedChildren = [...children, ...children, ...children];

    // Calculer la taille réelle d'un seul groupe
    useEffect(() => {
        if (!contentRef.current) return;

        const updateSize = () => {
            if (contentRef.current) {
                const size = direction === "horizontal"
                    ? contentRef.current.scrollWidth / 3
                    : contentRef.current.scrollHeight / 3;
                setContentSize(size);
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [direction, children.length, gap]);

    useAnimationFrame((time, delta) => {
        if (!contentRef.current || contentSize === 0) return;

        const moveBy = (currentSpeed * delta) / 1000;
        let newTranslation = baseTranslation.get() - moveBy;

        // Boucle infinie seamless
        if (newTranslation <= -contentSize) {
            // Ne pas reset à 0, mais ajouter contentSize pour continuité
            baseTranslation.set(newTranslation + contentSize);
        } else {
            baseTranslation.set(newTranslation);
        }
    });

    const x = useTransform(baseTranslation, (v) => (direction === "horizontal" ? v : 0));
    const y = useTransform(baseTranslation, (v) => (direction === "vertical" ? v : 0));

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ajustement-with-max ${className}`}
            onMouseEnter={() => setCurrentSpeed(speedOnHover)}
            onMouseLeave={() => setCurrentSpeed(speed)}
        >
            <motion.div
                ref={contentRef}
                style={{ 
                    x, 
                    y,
                    gap: `${gap}px`
                }}
                className={`flex mx-auto ${direction === "horizontal" ? "flex-row" : "flex-col"}`}
            >
                {duplicatedChildren.map((child, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0"
                    >
                        {child}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};