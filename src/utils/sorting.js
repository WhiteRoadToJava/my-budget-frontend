export default function sortingTransactions(data) {
  const transactions = data || [];

    return [...transactions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
};
