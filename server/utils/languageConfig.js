export const getLanguageInstruction = (lang) => {
  const instructions = {
    Hindi: "Hindi mein samjhao. Sirf Devanagari script use karo.",
    Hinglish: "Hinglish mein samjhao. Roman letters mein Hindi bolna.",
    English: "Explain in simplest English. Use daily-life analogies."
  };

  return instructions[lang] || instructions.English;
};
