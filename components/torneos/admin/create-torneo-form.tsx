"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Upload,
  ImageIcon,
  Calendar,
  CalendarCheck,
  Tags,
  Clock,
  X,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/components/ui/date-picker";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { createTournament } from "@/app/actions/tournament-actions";
import { createClient } from "@/lib/supabase/client";

export default function CreateTournamentForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [inscriptionEndDate, setInscriptionEndDate] = useState<Date>();

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setStartDate(undefined);
    setEndDate(undefined);
    setInscriptionEndDate(undefined);

    setCategories([]);
    setNewCategory("");

    setFileName("");
    setImageFile(null);
  };

  // 1MB body size limit for Server Actions. Upload image directly to storage from client.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Quick validation, server side action revalidates.
    if (inscriptionEndDate && startDate && inscriptionEndDate >= startDate) {
      toast.error(
        "El cierre de inscripciones debe ser anterior al inicio del torneo.",
      );
      return;
    }

    if (startDate && endDate && startDate >= endDate) {
      toast.error("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imgPath: string | null = null;

      if (imageFile && imageFile.size > 0) {
        const supabase = createClient();
        const fileExt = imageFile.name.split(".").pop();
        const uploadFileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("torneos")
          .upload(uploadFileName, imageFile, { upsert: true });

        if (uploadError) {
          toast.error("No se pudo subir la imagen. Intenta de nuevo.");
          return;
        }

        imgPath = uploadFileName;
      }

      const response = await createTournament({
        name,
        description: description || null,
        start_date: startDate ? format(startDate, "yyyy-MM-dd") : "",
        end_date: endDate ? format(endDate, "yyyy-MM-dd") : "",
        inscription_end_date: inscriptionEndDate
          ? format(inscriptionEndDate, "yyyy-MM-dd")
          : "",
        categories: categories.length > 0 ? categories : null,
        img_path: imgPath,
      });

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success("Torneo creado correctamente");
      resetForm();
      router.push("/torneos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mb-8 items-center max-w-2xl mx-auto px-4"
    >
      <FieldGroup className="w-full">
        <div className="flex flex-col md:flex-row w-full gap-4 md:items-start">
          <Field className="md:w-4/5">
            <FieldLabel htmlFor="name">
              Nombre <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej: Torneo de Primavera"
              required
              disabled={isSubmitting}
            />
          </Field>

          <Field className="md:w-2/5">
            <FieldLabel htmlFor="image" className="flex items-center gap-1">
              <Upload className="w-4 h-4" />
              Cartel
            </FieldLabel>

            <label
              htmlFor="image"
              className="bg-popover min-w-0 cursor-pointer flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm h-9"
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {fileName || "Seleccionar imagen"}
              </span>
            </label>

            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isSubmitting}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                setFileName(file?.name || "");
              }}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="description">Descripción</FieldLabel>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles sobre el torneo..."
            disabled={isSubmitting}
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="new-category"
            className="flex items-center gap-2"
          >
            <Tags className="w-4 h-4" />
            Categorías
          </FieldLabel>

          <div className="flex gap-2">
            <Input
              id="new-category"
              name="new-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nueva categoría (ej: 1ª Masculina)"
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
            />

            <Button
              type="button"
              variant="secondary"
              onClick={handleAddCategory}
              disabled={isSubmitting}
            >
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
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <DatePicker
              label="Fecha de inicio"
              value={startDate}
              onChange={setStartDate}
              required
              icon={<Calendar className="w-4 h-4" />}
            />
          </Field>

          <Field>
            <DatePicker
              label="Fecha de fin"
              value={endDate}
              onChange={setEndDate}
              required
              icon={<CalendarCheck className="w-4 h-4" />}
            />
          </Field>
        </div>

        <Field>
          <DatePicker
            label="Cierre de inscripciones"
            value={inscriptionEndDate}
            onChange={setInscriptionEndDate}
            required
            icon={<Clock className="w-4 h-4" />}
          />
          {inscriptionEndDate &&
            startDate &&
            inscriptionEndDate >= startDate && (
              <FieldError>
                El cierre de inscripciones debe ser anterior al inicio del
                torneo.
              </FieldError>
            )}
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creando...
            </>
          ) : (
            "Crear Torneo"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
