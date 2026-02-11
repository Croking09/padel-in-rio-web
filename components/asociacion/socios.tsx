import { getAllSocios } from "@/app/actions/socios";

export default async function Socios() {
  const socios = await getAllSocios();

  return (
    <>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 list-disc list-inside mx-auto">
        {socios?.map((socio) => (
          <li key={socio.id}>{socio.full_name}</li>
        ))}
      </ul>
    </>
  );
}
