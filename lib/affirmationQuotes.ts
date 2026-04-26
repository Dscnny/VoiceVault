/** Curated affirmation quotes for the Typing Journal. Max 2 sentences each. */
export const AFFIRMATION_QUOTES: string[] = [
  "You are doing better than you think. Growth doesn't always look like progress.",
  "Your feelings are valid, even when they don't make sense right now.",
  "You don't have to earn rest. Taking care of yourself is always enough.",
  "It's okay to not have everything figured out. You are still allowed to take up space.",
  "You've made it through every hard day so far. That's not luck — that's you.",
  "Being gentle with yourself is not weakness. It's one of the wisest things you can do.",
  "Your progress doesn't have to look impressive to count as real.",
  "You are allowed to change your mind, your path, and your plans as many times as you need.",
  "The fact that you're still trying says something important about who you are.",
  "Hard days are part of the story, not the whole thing.",
  "You don't owe anyone a perfectly healed version of yourself.",
  "Asking for help is a form of strength, not a confession of failure.",
  "You are more than the worst things you have ever felt.",
  "Small steps count. They always have and they always will.",
  "You are allowed to be a work in progress and still deserve good things.",
  "Rest is not something you have to earn. It's something you're already allowed to have.",
  "Your feelings don't have to be logical to be real and worth honoring.",
  "You've handled more than you thought you could before. You can handle this too.",
  "Healing isn't a straight line, and your path doesn't have to look like anyone else's.",
  "You are not behind. You're moving at exactly the pace that's right for you.",
  "Letting yourself feel hard emotions doesn't mean you're falling apart.",
  "You showed up today. That's not nothing — that's the whole thing.",
];

/** Returns a randomly selected quote from the affirmation list. */
export function getRandomQuote(): string {
  return AFFIRMATION_QUOTES[Math.floor(Math.random() * AFFIRMATION_QUOTES.length)];
}
