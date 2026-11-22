import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categoryService";
import { findCategory } from "../utils/categories/categories";

const NONE = [];

// The user's categories, loaded once and shared by every component that asks.
// find(category, transactionType): the category of a transaction (undefined while loading).
export const useCategories = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
  const categories = data ?? NONE;
  const find = useCallback(
    (category, type) => findCategory(categories, category, type),
    [categories],
  );
  return { categories, find, isLoading, isError };
};