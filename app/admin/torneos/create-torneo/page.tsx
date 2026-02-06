import CreateTorneoForm from "@/components/torneos/admin/create-torneo-form";

export default function Page() {
  return (
    <div>
      <div className="flex flex-col text-center my-8 gap-2">
        <h2 className="text-4xl font-bold">Crear torneo</h2>
        <p>Introduce los datos del torneo</p>
      </div>
      <CreateTorneoForm />
    </div>
  );
}
