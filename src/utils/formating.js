export const formatNumber = (number) => {
  if (number === null || number === undefined || number === "") return "—";
  const value = Number(number);
  if (Number.isNaN(value)) return "—";
  return value.toLocaleString("fr-FR");
};