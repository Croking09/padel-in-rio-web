import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export default function CookiePolicy() {
  return (
    <>
      <div className="flex flex-col max-w-5xl mx-auto text-center py-8 w-fit">
        <h1 className="text-4xl font-bold">Política de Cookies</h1>
        <p className="text-muted-foreground">
          Última actualización: 12/02/2026
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-12 pb-12 px-8">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            0. Responsable del tratamiento
          </h2>

          <div>
            <p>
              <strong>Titular:</strong> Pádel In Río
            </p>
            <p>
              <strong>Email de contacto:</strong> padelinrio@gmail.com
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            1. ¿Qué son las cookies?
          </h2>

          <p className="leading-7">
            Una cookie es un pequeño fichero de texto que se almacena en su
            navegador cuando visita casi cualquier página web. Su utilidad es
            que la web sea capaz de recordar su visita cuando vuelva a navegar
            por esa página. Las cookies suelen almacenar información de carácter
            técnico, preferencias personales, personalización de contenidos,
            estadísticas de uso, enlaces a redes sociales, acceso a cuentas de
            usuario, etc. El objetivo de la cookie es adaptar el contenido de la
            web a su perfil y necesidades.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            2. Cookies utilizadas en este sitio web
          </h2>

          <p className="mb-8 leading-7">
            En este sitio web utilizamos únicamente cookies propias con
            finalidad técnica, que son estrictamente necesarias para el
            funcionamiento del sitio. No se utilizan cookies de terceros ni con
            fines publicitarios, analíticos o de personalización.
          </p>

          <Card className="rounded-lg border py-0">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[22%] font-semibold">
                    Nombre
                  </TableHead>
                  <TableHead className="w-[53%] font-semibold">
                    Finalidad
                  </TableHead>
                  <TableHead className="w-[25%] font-semibold">
                    Duración
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow>
                  <TableCell className="align-top font-medium break-all whitespace-normal">
                    sb-[project-id]-auth-token
                  </TableCell>

                  <TableCell className="align-top whitespace-normal">
                    Gestionar la sesión de usuario y autenticación mediante
                    Supabase. Permite mantener al usuario identificado de forma
                    segura.
                  </TableCell>

                  <TableCell className="align-top whitespace-normal">
                    Persistente (hasta cierre de sesión o expiración del token)
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="align-top font-medium break-all whitespace-normal">
                    temporadaId
                  </TableCell>

                  <TableCell className="align-top whitespace-normal">
                    Recuerda la temporada seleccionada por el usuario para
                    mantener esta preferencia al navegar por la aplicación.
                  </TableCell>

                  <TableCell className="align-top whitespace-normal">
                    Persistente (hasta cierre de sesión)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">3. Gestión de cookies</h2>

          <div className="space-y-4 leading-7">
            <p>
              Puesto que solo utilizamos cookies esenciales para el
              funcionamiento de la aplicación (autenticación), el rechazo de
              estas cookies impedirá el correcto funcionamiento del inicio de
              sesión y el acceso a áreas privadas.
            </p>

            <p>
              No obstante, puede permitir, bloquear o eliminar las cookies
              instaladas en su equipo mediante la configuración de su navegador.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            4. Actualizaciones de esta política
          </h2>

          <p className="leading-7">
            Esta política de cookies puede modificarse en función de exigencias
            legales o cambios en el funcionamiento del sitio web. Se recomienda
            revisarla periódicamente.
          </p>
        </section>
      </div>
    </>
  );
}
