/**
 * Form component for adding/editing expenses
 */

import React, { useEffect, useState } from "react";
import { Category, CategoryFormData } from "../types";
import { TextField, Button } from "../vibes";
import EmojiPicker from 'emoji-picker-react';
import { COLORS } from "../constants/colors";
import { fetchCategories } from "../services/api";
import { useCategoryForm } from "../hooks/useCategoryForm";

interface ExpenseFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Category",
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useCategoryForm({
      initialData,
      onSubmit,
    });

  const [emoji, setEmoji] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const [categories, setCategories] = useState<Category[] | null>();

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    flex: "row",
    alignItems: "end",
    // border: `1px solid ${errors ? COLORS.danger : COLORS.border}`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: "0.375rem",
    padding: "1px",
  };

  const pickerStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 10,
  };

  useEffect(() => {
    const getCategories = async() => {
      const allCategories = await fetchCategories()
      setCategories(allCategories)
      // return allCategories
    }
    getCategories()
  }, [])

  useEffect(() => {
    console.log(categories)
  }, [categories])

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={rowStyle}>
        <Button
          aria-label="Emoji"
          // size="medium"
          variant="neutral"
          onClick={() => setEmojiPickerOpen(true)}
          title="Choose emoji"
        >
          {emoji ? emoji : "➕"}
        </Button>
        <TextField
          type="text"
          placeholder="Enter category name and choose emoji"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          fullWidth
          required
          noBorder
        />
      </div>

      {emojiPickerOpen && (
        <div style={pickerStyle}>
          <EmojiPicker
            onEmojiClick={(emojiObject) => {
              setEmoji(emojiObject.emoji);
              setEmojiPickerOpen(false);
              handleChange("emoji", emojiObject.emoji);
            }}
            />
        </div>
        
      )}

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
