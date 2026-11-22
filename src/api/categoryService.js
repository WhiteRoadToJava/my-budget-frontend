import api from "./axios";

// The user's categories (/api/user/categories, CategoryController).
// Each one: { id, type: "INCOME" | "EXPENSE", key, defaultKey, name, emoji, position, hidden }.
// Incomes, expenses and schedules keep the key in their "category" field.

export const getCategories = async () => {
  try {
    const response = await api.get("/user/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// { type, name, emoji }
export const addCategory = async (category) => {
  try {
    const response = await api.post("/user/categories", category);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// any of { name, emoji, hidden }; an empty name gives a ready-made one its translated name back
export const updateCategory = async (id, changes) => {
  try {
    const response = await api.patch(`/user/categories/${id}`, changes);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// ids of one type, in the new order; returns all the categories
export const orderCategories = async (type, ids) => {
  try {
    const response = await api.put("/user/categories/order", { type, ids });
    return response.data;
  } catch (error) {
    console.error("Error ordering categories:", error);
    throw error;
  }
};

// { deleted: true }, or { deleted: false } when transactions use it: then it is hidden
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/user/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
