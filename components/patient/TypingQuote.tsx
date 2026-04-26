"use client";

import React from "react";

interface TypingQuoteProps {
  quote: string;
  typed: string;
  isComplete: boolean;
}

export function TypingQuote({ quote, typed, isComplete }: TypingQuoteProps) {
  return (
    <div className="flex justify-center px-2">
      <p className="text-2xl sm:text-3xl font-mono leading-relaxed max-w-2xl text-center select-none">
        {quote.split("").map((char, i) => {
          const isCursor = i === typed.length && !isComplete;
          const isTyped = i < typed.length;
          const isCorrect = isTyped && typed[i] === char;
          const isWrong = isTyped && !isCorrect;

          return (
            <React.Fragment key={i}>
              {isCursor && (
                <span className="inline-block w-0.5 h-5 bg-accent animate-pulse-soft align-middle" />
              )}
              <span
                className={
                  isWrong
                    ? "text-sentiment-crisis bg-sentiment-crisis/10"
                    : isCorrect
                    ? "text-text-primary"
                    : "text-text-tertiary"
                }
              >
                {char === " " ? " " : char}
              </span>
            </React.Fragment>
          );
        })}
      </p>
    </div>
  );
}
