"use client";

import { createTorneo } from "@/app/actions/torneos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/components/ui/date-picker";

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

  const router = useRouter();

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
      toast.error(response.error);
    } else {
      toast.success("Torneo creado correctamente");
      resetForm();
      router.push("/torneos");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mb-8 items-center max-w-2xl mx-auto px-4"
    >
      <div className="flex flex-col md:flex-row w-full gap-4 md:items-end">
        <div className="grid gap-2 md:w-4/5">
          <Label className="font-bold" htmlFor="name">
            Nombre <span className="text-destructive">*</span>
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
          <Label className="font-bold flex items-center" htmlFor="image">
            <Upload className="w-4 h-4" />
            Cartel
          </Label>

          <label
            htmlFor="image"
            className="bg-popover min-w-0 cursor-pointer flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm h-9"
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
        <Label className="font-bold" htmlFor="description">
          Descripción
        </Label>

        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles sobre el torneo..."
        />
      </div>

      <div className="grid gap-2 w-full">
        <Label
          className="font-bold flex items-center gap-2"
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

          <Button variant="secondary" onClick={handleAddCategory}>
            Añadir
          </Button>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {cat}
                <button
                  data-testid={`remove-category-${index}`}
                  type="button"
                  onClick={() => handleRemoveCategory(index)}
                  className="cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <DatePicker
          label="Fecha de inicio"
          value={startDate}
          onChange={setStartDate}
          required
          icon={<Calendar className="w-4 h-4" />}
        />

        <DatePicker
          label="Fecha de fin"
          value={endDate}
          onChange={setEndDate}
          required
          icon={<CalendarCheck className="w-4 h-4" />}
        />
      </div>

      <div className="grid gap-2 w-full">
        <DatePicker
          label="Cierre de inscripciones"
          value={inscriptionEndDate}
          onChange={setInscriptionEndDate}
          required
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      <Button type="submit" className="w-full">
        Crear Torneo
      </Button>
    </form>
  );
}
