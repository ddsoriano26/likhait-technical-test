/**
 * Form component for adding/editing expenses
 */

import React, { useState } from "react";
import { CategoryFormData } from "../types";
import { TextField, Button } from "../vibes";
import EmojiPicker from 'emoji-picker-react';
import { COLORS } from "../constants/colors";
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
  const { formData, error, isSubmitting, handleChange, handleSubmit } =
    useCategoryForm({
      initialData,
      onSubmit,
    });

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

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

  // Single row meant to look like a single "input" field containing button for emoji picker + category name text field
  const rowStyle: React.CSSProperties = {
    display: "flex",
    flex: "row",
    alignItems: "end",
    border: `1px solid ${error ? COLORS.danger : COLORS.border}`,
    borderRadius: "0.375rem",
    padding: "1px",
  };

  const pickerStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 10,
  };

  // Set error message style
  const errorStyle: React.CSSProperties = {
    color: `${COLORS.danger}`,
    fontSize: "0.875rem",
    display: "block",
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div>
        <div style={rowStyle}>
          <Button
            aria-label="Emoji"
            variant="neutral"
            onClick={() => setEmojiPickerOpen(true)}
            title="Choose emoji"
          >
            {formData.emoji ? formData.emoji : "➕"}
          </Button>
          <TextField
            type="text"
            placeholder="Enter category name and choose emoji"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            fullWidth
            required
            noBorder
          />
          {emojiPickerOpen && (
            <div style={pickerStyle}>
              <EmojiPicker
                onEmojiClick={(emojiObject) => {
                  setEmojiPickerOpen(false);
                  handleChange("emoji", emojiObject.emoji);
                }}
                />
            </div>
          )}
        </div>
        {error && (
          <span style={errorStyle}>
            {error}
          </span>
        )}
      </div>

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
