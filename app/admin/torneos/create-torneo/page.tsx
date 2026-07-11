import CreateTorneoForm from "@/components/torneos/admin/create-torneo-form";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col text-center my-8 gap-2">
        <h1 className="text-4xl font-bold">Crear torneo</h1>
        <p className="text-muted-foreground">Introduce los datos del torneo</p>
      </div>
      <CreateTorneoForm />
    </div>
  );
}
