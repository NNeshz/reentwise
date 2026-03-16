import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Reentwise",
  description:
    "Términos y condiciones de uso y política de privacidad de Reentwise.",
};

const LAST_UPDATED = "15 de marzo de 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Términos y Condiciones
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última actualización: {LAST_UPDATED}
      </p>

      <section className="mt-10 space-y-8 text-muted-foreground leading-7 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:font-medium [&_h3]:text-foreground">
        <div className="space-y-3">
          <h2>1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar la plataforma Reentwise (&quot;el
            Servicio&quot;), usted acepta estar sujeto a estos Términos y
            Condiciones. Si no está de acuerdo con alguna parte de estos
            términos, no podrá acceder al Servicio.
          </p>
        </div>

        <div className="space-y-3">
          <h2>2. Descripción del servicio</h2>
          <p>
            Reentwise es una plataforma que facilita la gestión de cobros y
            recordatorios de pago a través de notificaciones automatizadas. El
            Servicio permite a los usuarios administrar pagos, enviar
            recordatorios y dar seguimiento al estado de cobros.
          </p>
        </div>

        <div className="space-y-3">
          <h2>3. Registro y cuenta</h2>
          <p>
            Para utilizar el Servicio, usted debe crear una cuenta proporcionando
            información veraz y actualizada. Usted es responsable de mantener la
            confidencialidad de sus credenciales de acceso y de todas las
            actividades que ocurran bajo su cuenta.
          </p>
        </div>

        <div className="space-y-3">
          <h2>4. Uso aceptable</h2>
          <p>Usted se compromete a no:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Utilizar el Servicio para fines ilegales o no autorizados.
            </li>
            <li>
              Enviar mensajes de spam, acoso o contenido ofensivo a través de la
              plataforma.
            </li>
            <li>
              Intentar acceder a cuentas, sistemas o redes sin autorización.
            </li>
            <li>
              Interferir con el funcionamiento normal del Servicio.
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2>5. Política de privacidad</h2>

          <h3>5.1 Datos que recopilamos</h3>
          <p>Recopilamos la siguiente información:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Datos de cuenta:</strong> nombre, correo electrónico y
              datos de autenticación.
            </li>
            <li>
              <strong>Datos de uso:</strong> información sobre cómo interactúa
              con el Servicio, incluyendo páginas visitadas y acciones
              realizadas.
            </li>
            <li>
              <strong>Datos de contactos:</strong> números de teléfono y nombres
              de los contactos que usted registra para el envío de recordatorios.
            </li>
          </ul>

          <h3>5.2 Uso de los datos</h3>
          <p>Utilizamos su información para:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Proveer, mantener y mejorar el Servicio.</li>
            <li>Enviar recordatorios y notificaciones de pago en su nombre.</li>
            <li>
              Comunicarnos con usted sobre actualizaciones o cambios en el
              Servicio.
            </li>
            <li>Cumplir con obligaciones legales aplicables.</li>
          </ul>

          <h3>5.3 Protección de datos</h3>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para
            proteger su información personal contra accesos no autorizados,
            alteración, divulgación o destrucción. Sin embargo, ninguna
            transmisión por internet es completamente segura.
          </p>

          <h3>5.4 Compartir información</h3>
          <p>
            No vendemos ni compartimos su información personal con terceros, salvo
            cuando sea necesario para operar el Servicio (por ejemplo, servicios
            de mensajería para enviar notificaciones) o cuando la ley lo requiera.
          </p>

          <h3>5.5 Retención de datos</h3>
          <p>
            Conservamos su información personal mientras su cuenta esté activa o
            mientras sea necesario para proveer el Servicio. Puede solicitar la
            eliminación de su cuenta y datos asociados en cualquier momento.
          </p>
        </div>

        <div className="space-y-3">
          <h2>6. Propiedad intelectual</h2>
          <p>
            Todo el contenido, diseño, logotipos y software del Servicio son
            propiedad de Reentwise y están protegidos por las leyes de propiedad
            intelectual aplicables. Queda prohibida la reproducción, distribución
            o modificación sin autorización expresa.
          </p>
        </div>

        <div className="space-y-3">
          <h2>7. Limitación de responsabilidad</h2>
          <p>
            El Servicio se proporciona &quot;tal cual&quot; y &quot;según
            disponibilidad&quot;. Reentwise no garantiza que el Servicio será
            ininterrumpido o libre de errores. En ningún caso seremos
            responsables por daños indirectos, incidentales o consecuentes
            derivados del uso del Servicio.
          </p>
        </div>

        <div className="space-y-3">
          <h2>8. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos Términos y Condiciones
            en cualquier momento. Las modificaciones entrarán en vigor al ser
            publicadas en esta página. El uso continuado del Servicio después de
            los cambios constituye su aceptación de los términos modificados.
          </p>
        </div>

        <div className="space-y-3">
          <h2>9. Cancelación</h2>
          <p>
            Usted puede cancelar su cuenta en cualquier momento. Nos reservamos
            el derecho de suspender o cancelar cuentas que violen estos términos
            sin previo aviso.
          </p>
        </div>

        <div className="space-y-3">
          <h2>10. Contacto</h2>
          <p>
            Si tiene preguntas sobre estos Términos y Condiciones o nuestra
            Política de Privacidad, puede contactarnos a través de nuestro sitio
            web.
          </p>
        </div>
      </section>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
