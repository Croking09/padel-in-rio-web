"use client";

import { createTorneo } from "@/app/actions/torneos";
import { TorneoCreationState } from "@/components/torneos/admin/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import * as React from "react";
import { useActionState } from "react";
import {
  Upload,
  ImageIcon,
  Calendar,
  CalendarCheck,
  Tags,
  Clock,
  X,
} from "lucide-react";

const initialState: TorneoCreationState = {
  message: "",
  error: "",
  success: false,
};

export default function CreateTorneoForm() {
  const [state, formAction, isPending] = useActionState(
    createTorneo,
    initialState,
  );
  const [uploading, setUploading] = React.useState(false);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [newCategory, setNewCategory] = React.useState("");

  const [fileName, setFileName] = React.useState<string>("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image") as File;
    const startDate = formData.get("start_date") as string;

    categories.forEach((category) => {
      formData.append("categories", category);
    });

    if (imageFile && imageFile.size > 0 && startDate) {
      const supabase = createClient();

      const formattedDate = formatDate(startDate, "dd-MM-yyyy");

      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${formattedDate}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("torneos")
        .upload(fileName, imageFile, {
          upsert: true,
        });

      if (uploadError) {
        setUploading(false);
        return;
      }

      formData.set("img_path", fileName);
    }
    formData.delete("image");

    const dateFields = ["start_date", "end_date", "inscription_end_date"];
    dateFields.forEach((field) => {
      const value = formData.get(field) as string;
      if (value) {
        formData.set(field, new Date(value).toISOString());
      }
    });

    React.startTransition(() => {
      formAction(formData);
    });
    setUploading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 mb-8 items-center max-w-2xl mx-auto px-4"
    >
      <div className="flex flex-col md:flex-row w-full gap-4 md:items-end">
        <div className="grid gap-2 md:w-4/5">
          <Label className="font-bold px-1" htmlFor="name">
            Nombre
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="ej: Torneo de Primavera"
            required
          />
        </div>

        <div className="grid gap-2 md:w-2/5">
          <Label
            className="font-bold flex items-center gap-2 px-1"
            htmlFor="image"
          >
            <Upload className="w-4 h-4" />
            Cartel
          </Label>

          <label
            htmlFor="image"
            className="min-w-0 cursor-pointer flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm h-9 hover:bg-accent transition-colors"
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">{fileName || "Seleccionar imagen"}</span>
          </label>

          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
        </div>
      </div>

      <div className="grid gap-2 w-full">
        <Label className="font-bold px-1" htmlFor="description">
          Descripción
        </Label>

        <textarea
          id="description"
          name="description"
          rows={5}
          className={cn(
            "flex w-full rounded-md border border-input px-3 py-2 text-sm",
          )}
          placeholder="Detalles sobre el torneo..."
        />
      </div>

      <div className="grid gap-3 w-full">
        <Label
          className="font-bold flex items-center gap-2 px-1"
          htmlFor="new-category"
        >
          <Tags className="w-4 h-4" />
          Categorías
        </Label>

        <div className="flex gap-2">
          <Input
            id="new-category"
            name="new-category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nueva categoría (ej: 1ª Masculina)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCategory();
              }
            }}
          />

          <Button type="button" onClick={handleAddCategory}>
            Añadir
          </Button>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow"
              >
                {cat}
                <button
                  data-testid={`remove-category-${index}`}
                  type="button"
                  onClick={() => handleRemoveCategory(index)}
                  className="cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="grid gap-2">
          <Label
            className="font-bold flex items-center gap-2 px-1"
            htmlFor="start_date"
          >
            <Calendar className="w-4 h-4" />
            Fecha de inicio
          </Label>

          <Input
            id="start_date"
            name="start_date"
            type="datetime-local"
            required
            className="cursor-pointer"
            onClick={(e) => e.currentTarget.showPicker?.()}
          />
        </div>

        <div className="grid gap-2">
          <Label
            className="font-bold flex items-center gap-2 px-1"
            htmlFor="end_date"
          >
            <CalendarCheck className="w-4 h-4" />
            Fecha de fin
          </Label>
          <Input
            id="end_date"
            name="end_date"
            type="datetime-local"
            required
            className="cursor-pointer"
            onClick={(e) => e.currentTarget.showPicker?.()}
          />
        </div>
      </div>

      <div className="grid gap-2 w-full">
        <Label
          className="font-bold flex items-center gap-2 px-1"
          htmlFor="inscription_end_date"
        >
          <Clock className="w-4 h-4" />
          Cierre de inscripciones
        </Label>

        <Input
          id="inscription_end_date"
          name="inscription_end_date"
          type="datetime-local"
          required
          className="cursor-pointer"
          onClick={(e) => e.currentTarget.showPicker?.()}
        />
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-error bg-error/20 border border-error rounded w-full">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 text-sm text-success bg-success/20 border border-success rounded w-full">
          {state.message}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || uploading}
        variant="secondary"
      >
        {uploading
          ? "Subiendo imagen..."
          : isPending
            ? "Creando..."
            : "Crear Torneo"}
      </Button>
    </form>
  );
}
