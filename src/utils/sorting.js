export default function sortingTransactions(data) {
  const trnnsactions = data || [];

    return [...trnnsactions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
};
