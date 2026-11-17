const normalize = (text) => String(text ?? "").trim().replace(/\s+/g, " ").toLowerCase();

export const confirmsDelete = (typed, accountName, localWord) => {
  const value = normalize(typed);
  if (!value) return false;
  const accepted = [accountName, "delete", localWord].map(normalize).filter(Boolean);
  return accepted.includes(value);
};