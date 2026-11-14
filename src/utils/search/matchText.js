const HARAKAT = /[\u064B-\u0652\u0670\u0640]/g; // tanween, harakat, shadda, sukun, dagger alef, tatweel

export const normalizeText = (text) =>
  String(text ?? "")
    .toLowerCase()
    .replace(HARAKAT, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .trim()

    export const filterOptions = (list = [], query = "") => {
        const words = normalizeText(query).split(" ").filter(Boolean);
        if(words.length === 0) return list;
        return list.filter((item) => {
            const text = normalizeText(item);
            return words.every((w) => text.includes(w))
        });
    };
