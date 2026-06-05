"use client";

import React, { useState } from "react";
import "./AnimateGrid.css";

interface CardItem {
  logo: string;
  title?: string;
  [key: string]: any;
}

interface AnimateGridProps {
  className?: string;
  textGlowStartColor?: string;
  textGlowEndColor?: string;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  cards: CardItem[];
  renderCard?: (item: CardItem, index: number) => React.ReactNode;
}

export default function AnimateGrid({
  className = "",
  textGlowStartColor = "rgba(0, 242, 254, 0.2)",
  textGlowEndColor = "rgba(0, 242, 254, 0.8)",
  perspective = 600,
  rotateX = -1,
  rotateY = -15,
  cards,
  renderCard,
}: AnimateGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const getAdjacentIndices = (activeIdx: number) => {
    return [activeIdx - 1, activeIdx + 1, activeIdx - 4, activeIdx + 4].filter((idx) => {
      if (idx < 0 || idx >= cards.length) return false;
      if (activeIdx % 4 === 0 && idx === activeIdx - 1) return false;
      if (activeIdx % 4 === 3 && idx === activeIdx + 1) return false;
      return true;
    });
  };

  const isAdjacent = (index: number) => {
    if (activeIndex === null) return false;
    return getAdjacentIndices(activeIndex).includes(index);
  };

  const gridColsClass = cards.length < 4 ? `grid-cols-${cards.length}` : "grid-cols-4";

  return (
    <div
      className={`relative block ${className}`}
      style={{
        "--text-glow-start-color": textGlowStartColor,
        "--text-glow-end-color": textGlowEndColor,
      } as React.CSSProperties}
    >
      <div
        className={`relative grid w-full max-w-full items-center justify-center gap-4 ${gridColsClass}`}
        style={{
          transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {cards.map((item, index) => {
          const isBig = activeIndex === index;
          const isSmall = isAdjacent(index);
          const raisedClass = isBig
            ? "card-raised-big"
            : isSmall
            ? "card-raised-small"
            : "";

          return (
            <div
              key={index}
              className={`card block rounded-xl border border-transparent px-3 py-5 transition-all duration-200 cursor-pointer ${raisedClass}`}
              style={{ zIndex: index + 1 }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {renderCard ? (
                renderCard(item, index)
              ) : (
                <img
                  className="logo mx-auto h-10 w-auto object-contain"
                  src={item.logo}
                  alt={`Card ${index}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
