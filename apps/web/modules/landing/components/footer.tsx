import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-background pt-20 pb-10 px-4 md:px-8 border-t border-border/40">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {/* Top Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="reentwise Logo"
              width={24}
              height={24}
              className="object-contain dark:invert"
            />
            <span className="font-bold text-lg text-foreground">reentwise</span>
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Address Column */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Dirección
            </h4>
            <p className="text-xl md:text-2xl font-host-grotesk text-foreground max-w-md">
              Ciudad de México, México
            </p>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Navegación
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  Testimonios
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  Precios
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Información
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  Términos de servicio
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Redes sociales
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-foreground hover:text-primary transition-colors"
                >
                  Twitter (X)
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
