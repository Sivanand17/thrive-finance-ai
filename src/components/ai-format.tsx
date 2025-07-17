// Shared AI response formatting for all sections

import React from "react";

const emojiMap: Record<string, string> = {
  save: "\uD83D\uDCB0",
  goal: "\uD83C\uDFC6",
  credit: "\uD83D\uDCB3",
  debt: "\uD83D\uDCB8",
  emergency: "\uD83D\uDEA8",
  income: "\uD83D\uDCB5",
  expense: "\uD83D\uDCB8",
  subscription: "\uD83D\uDD14",
  tip: "\uD83D\uDCA1",
  congrats: "\uD83C\uDF89",
  good: "\u2705",
  warning: "\u26A0\uFE0F",
  invest: "\uD83D\uDCB8",
  bill: "\uD83E\uDDFE",
  track: "\uD83D\uDCCA",
  plan: "\uD83D\uDCDD",
  budget: "\uD83D\uDCC5",
  check: "\u2714\uFE0F",
  star: "\u2B50",
  fire: "\uD83D\uDD25",
  calendar: "\uD83D\uDCC6",
  shopping: "\uD83D\uDED2",
  food: "\uD83C\uDF7D\uFE0F",
  travel: "\u2708\uFE0F",
  home: "\uD83C\uDFE0",
  health: "\uD83C\uDFE5",
  car: "\uD83D\uDE97",
  phone: "\uD83D\uDCF1",
  education: "\uD83C\uDF93",
  energy: "\u26A1",
  smile: "\uD83D\uDE03",
  rocket: "\uD83D\uDE80",
};

function addEmojis(text: string) {
  let result = text;
  Object.entries(emojiMap).forEach(([word, emoji]) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    result = result.replace(regex, `${emoji} ${word}`);
  });
  return result;
}

export function formatAIContent(content: string): React.ReactNode[] {
  return content.split("\n").map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return null;

    // Remove bold markers
    let cleaned = trimmed.replace(/\*\*/g, "");
    cleaned = addEmojis(cleaned);

    // Heading markdown (### or lines ending with :)
    if (cleaned.startsWith("###")) {
      return (
        <h3
          key={idx}
          className="text-base md:text-lg font-semibold mt-3 text-primary"
        >
          {cleaned.replace(/^###\s*/, "").replace(/[:]$/, "")}
        </h3>
      );
    }

    if (/[:]$/.test(cleaned) && cleaned.length < 120) {
      return (
        <h3
          key={idx}
          className="text-base md:text-lg font-semibold mt-3 text-primary"
        >
          {cleaned.replace(/[:]$/, "")}
        </h3>
      );
    }

    // Numbered lists
    if (/^\d+\.\s/.test(cleaned)) {
      return (
        <p
          key={idx}
          className="pl-4 relative before:content-['•'] before:absolute before:-left-2 text-[15px]"
        >
          {cleaned.replace(/^\d+\.\s/, "")}
        </p>
      );
    }

    // Bullet lists
    if (cleaned.startsWith("- ")) {
      return (
        <p
          key={idx}
          className="pl-4 relative before:content-['•'] before:absolute before:-left-2 text-[15px]"
        >
          {cleaned.slice(2)}
        </p>
      );
    }

    return (
      <p key={idx} className="text-[15px]">
        {cleaned}
      </p>
    );
  });
}
