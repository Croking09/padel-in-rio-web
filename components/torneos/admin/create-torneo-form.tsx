"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

import { useActionState } from "react";
import { createTorneo, TorneoCreationState } from "@/app/actions/torneos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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

    // Append categories
    categories.forEach((category) => {
      formData.append("categories", category);
    });

    // Only upload if there's a file and it has content
    if (imageFile && imageFile.size > 0 && startDate) {
      const supabase = createClient();

      // Format start_date to dd-MM-yyyy
      const dateObj = new Date(startDate);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      // Get file extension
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${formattedDate}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("torneos")
        .upload(fileName, imageFile, {
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        // Handle error visually if needed, for now just log
        setUploading(false);
        return;
      }

      // Append the path to formData (we'll read "img_path" in the server action)
      formData.set("img_path", fileName);
    }

    // Remove the file from formData to avoid sending large payload to server action
    formData.delete("image");

    React.startTransition(() => {
      formAction(formData);
    });
    setUploading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-lg mx-auto p-6 bg-card rounded-lg border shadow-sm"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Crear Nuevo Torneo
        </h2>
        <p className="text-muted-foreground text-sm">
          Introduce los detalles del nuevo torneo.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Torneo</Label>
          <Input
            id="name"
            name="name"
            placeholder="Ej: Torneo de Primavera"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Cartel del Torneo</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={cn(
              "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            )}
            placeholder="Detalles sobre el torneo..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Fecha de Inicio</Label>
            <Input
              id="start_date"
              name="start_date"
              type="datetime-local"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_date">Fecha de Fin</Label>
            <Input
              id="end_date"
              name="end_date"
              type="datetime-local"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Categorías</Label>
          <div className="flex gap-2">
            <Input
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
            <Button
              type="button"
              onClick={handleAddCategory}
              variant="secondary"
            >
              Añadir
            </Button>
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inscription_end_date">Cierre de Inscripciones</Label>
          <Input
            id="inscription_end_date"
            name="inscription_end_date"
            type="datetime-local"
            required
          />
        </div>
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-error bg-error/10 rounded-md border border-error/20">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 text-sm text-success bg-success/10 rounded-md border border-success/20">
          {state.message}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || uploading}
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
