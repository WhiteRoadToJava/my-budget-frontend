export default function sortingTransactions(data) {
  const trnnsactions = data || [];

    return [...trnnsactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
};
