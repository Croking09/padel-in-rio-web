"use client";

import { createTorneo } from "@/app/actions/torneos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import { useState } from "react";
import {
  Upload,
  ImageIcon,
  Calendar,
  CalendarCheck,
  Tags,
  Clock,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function CreateTorneoForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [inscriptionEndDate, setInscriptionEndDate] = useState("");

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setInscriptionEndDate("");
    setCategories([]);
    setNewCategory("");
    setFileName("");
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imgPath = "";

    if (imageFile && imageFile.size > 0 && startDate) {
      const supabase = createClient();

      const formattedDate = formatDate(startDate, "dd-MM-yyyy");
      const fileExt = imageFile.name.split(".").pop();
      const uploadFileName = `${formattedDate}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("torneos")
        .upload(uploadFileName, imageFile, { upsert: true });

      if (uploadError) return;

      imgPath = uploadFileName;
    }

    const response = await createTorneo({
      name,
      description: description || null,
      start_date: startDate ? new Date(startDate).toISOString() : "",
      end_date: endDate ? new Date(endDate).toISOString() : "",
      inscription_end_date: inscriptionEndDate
        ? new Date(inscriptionEndDate).toISOString()
        : "",
      img_path: imgPath || null,
      categories: categories.length > 1 ? categories : null,
    });

    if (!response.success) {
      toast.error(response.error, { position: "top-center" });
    } else {
      toast.success("Torneo creado correctamente", { position: "top-center" });
      resetForm();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 mb-8 items-center max-w-2xl mx-auto px-4"
    >
      <div className="flex flex-col md:flex-row w-full gap-4 md:items-end">
        <div className="grid gap-2 md:w-4/5">
          <Label className="font-bold px-1" htmlFor="name">
            Nombre <span className="text-xs text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
              setFileName(file?.name || "");
            }}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pr-6 md:pr-0">
        <div className="grid gap-2">
          <Label
            className="font-bold flex items-center gap-2 px-1"
            htmlFor="start_date"
          >
            <Calendar className="w-4 h-4" />
            Fecha de inicio <span className="text-xs text-red-500">*</span>
          </Label>

          <Input
            id="start_date"
            name="start_date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
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
            Fecha de fin <span className="text-xs text-red-500">*</span>
          </Label>
          <Input
            id="end_date"
            name="end_date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            type="date"
            required
            className="cursor-pointer"
            onClick={(e) => e.currentTarget.showPicker?.()}
          />
        </div>
      </div>

      <div className="grid gap-2 w-full pr-6 md:pr-0">
        <Label
          className="font-bold flex items-center gap-2 px-1"
          htmlFor="inscription_end_date"
        >
          <Clock className="w-4 h-4" />
          Cierre de inscripciones{" "}
          <span className="text-xs text-red-500">*</span>
        </Label>

        <Input
          id="inscription_end_date"
          name="inscription_end_date"
          value={inscriptionEndDate}
          onChange={(e) => setInscriptionEndDate(e.target.value)}
          type="date"
          required
          className="cursor-pointer"
          onClick={(e) => e.currentTarget.showPicker?.()}
        />
      </div>

      <Button type="submit" className="w-full" variant="secondary">
        Crear Torneo
      </Button>
    </form>
  );
}
