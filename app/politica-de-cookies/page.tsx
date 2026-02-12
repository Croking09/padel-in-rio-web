export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>

      <p className="mb-4">Última actualización: 12/02/2026</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          0. Responsable del tratamiento
        </h2>

        <p className="mb-4">
          <strong>Titular:</strong> Padel In Rio
          <br />
          <strong>Email de contacto:</strong> padelinrio@gmail.com
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          1. ¿Qué son las cookies?
        </h2>
        <p className="mb-4">
          Una cookie es un pequeño fichero de texto que se almacena en su
          navegador cuando visita casi cualquier página web. Su utilidad es que
          la web sea capaz de recordar su visita cuando vuelva a navegar por esa
          página. Las cookies suelen almacenar información de carácter técnico,
          preferencias personales, personalización de contenidos, estadísticas
          de uso, enlaces a redes sociales, acceso a cuentas de usuario, etc. El
          objetivo de la cookie es adaptar el contenido de la web a su perfil y
          necesidades.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          2. Cookies utilizadas en este sitio web
        </h2>
        <p className="mb-4">
          En este sitio web utilizamos únicamente cookies propias con finalidad
          técnica, que son estrictamente necesarias para el funcionamiento del
          sitio. No se utilizan cookies de terceros ni con fines publicitarios,
          analíticos o de personalización.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-background border border-border rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold border-b border-border">
                  Nombre
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold border-b border-border">
                  Finalidad
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold border-b border-border">
                  Duración
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 px-4 text-sm font-medium">
                  sb-[project-id]-auth-token
                </td>
                <td className="py-3 px-4 text-sm">
                  Gestionar la sesión de usuario y autenticación a través de
                  Supabase. Permite mantener al usuario identificado de forma
                  segura.
                </td>
                <td className="py-3 px-4 text-sm">
                  Persistente (hasta cierre de sesión o expiración del token)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Gestión de cookies</h2>
        <p className="mb-4">
          Puesto que solo utilizamos cookies esenciales para el funcionamiento
          de la aplicación (autenticación), el rechazo de estas cookies impedirá
          el correcto funcionamiento del inicio de sesión y el acceso a áreas
          privadas.
        </p>
        <p className="mb-4">
          No obstante, puede usted permitir, bloquear o eliminar las cookies
          instaladas en su equipo mediante la configuración de las opciones del
          navegador:
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          4. Actualizaciones de esta política
        </h2>

        <p>
          Esta política de cookies puede modificarse en función de exigencias
          legales o cambios en el funcionamiento del sitio web. Se recomienda
          revisarla periódicamente.
        </p>
      </section>
    </div>
  );
}
