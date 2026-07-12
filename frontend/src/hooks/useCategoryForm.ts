/**
 * Custom hook for managing and validating category form
 * Used useExpenseForm as blueprint
 */

import { useEffect, useState } from "react";
import { Category, CategoryFormData } from "../types";
import { fetchCategories } from "../services/api";

interface UseCategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export function useCategoryForm({ initialData, onSubmit }: UseCategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
      name: initialData?.name || "",
      emoji: initialData?.emoji || "",
    });

  const [error, setError] = useState(""); // Single error message to be put in "custom input" component
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<Category[] | null>();

  // Fetch available categories for double-checking duplicates
  useEffect(() => {
    const loadCategories = async() => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch(err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, [])

  const handleChange = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (error) {
      setError("");
    }
  };

  const validateForm = (): boolean => {
    const categoryNames = categories?.map(cat => {return cat.name});
    
    // Require category name
    if (!formData.name.trim()) {
      setError("Category name is required!");
      return false
    }
    
    // Check if category name is a duplicate
    if (categoryNames?.includes(formData.name)) {
      setError("Category name already exists!");
      return false
    }

    // Require emoji
    if (!formData.emoji.trim()) {
      setError("Choose an emoji!");
      return false
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        name: "",
        emoji: "",
      });
      setError("");
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: initialData?.name || "",
      emoji: initialData?.emoji || "",
    });
    setError("");
  };

  return {
    formData,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
