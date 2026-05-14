import { Link } from "wouter";
import { Heart, Instagram, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background border-t border-green-700/40">
      <div className="container py-10">

        {/* Container principal */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">

          {/* COLUNA ESQUERDA - LOGOS */}
          <div className="flex justify-center lg:justify-start w-full lg:w-auto">

            <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-[400px] w-full">

              {/* Logo principal */}
              <div className="flex justify-center">
                <img
                  src="/img/logoCompleta.webp"
                  alt="Logo Saberes"
                  className="h-52 w-auto object-contain"
                />
              </div>

              {/* Separador */}
              <div className="w-full h-px bg-gray-300 my-5" />

              {/* Logos institucionais */}
              <div className="flex items-center justify-center gap-5">

                <img
                  src="/img/ufr.webp"
                  alt="UFR"
                  className="h-16 w-auto object-contain"
                />

                <div className="w-px h-12 bg-gray-300" />

                <img
                  src="/img/gov.br.webp"
                  alt="Gov BR"
                  className="h-12 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="flex flex-col justify-between flex-1 w-full">

            {/* Navegação + Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* Navegação */}
              <div>
                <h4 className="font-serif font-bold text-3xl mb-5">
                  Navegação
                </h4>

                <ul className="space-y-3 text-lg">

                  <li>
                    <Link href="/podcasts#">
                      <span className="cursor-pointer text-background/75 hover:text-primary transition-colors">
                        Podcasts
                      </span>
                    </Link>
                  </li>

                  <li>
                    <Link href="/album#">
                      <span className="cursor-pointer text-background/75 hover:text-primary transition-colors">
                        Álbum
                      </span>
                    </Link>
                  </li>

                  <li>
                    <Link href="/sobre#">
                      <span className="cursor-pointer text-background/75 hover:text-primary transition-colors">
                        Sobre
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contato */}
              <div>
                <h4 className="font-serif font-bold text-3xl mb-5">
                  Contato
                </h4>

                <div className="space-y-4 text-lg">

                  <div className="flex items-center gap-3 text-background/75">
                    <Mail className="w-5 h-5 text-green-500" />
                    <span>contato@acaoindigena.com</span>
                  </div>
                    <a
                        href="https://www.instagram.com/asie.ufr?igsh=NWI4N3F0YTZpeDg0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-background/75 hover:text-primary transition-colors"
                    >
                        <Instagram className="w-5 h-5 text-green-500" />
                        <span>@asie.ufr</span>
                    </a>
                    <a
                        href="https://maps.app.goo.gl/SZ4GszVuQ69hKo8F6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-background/75 hover:text-primary transition-colors"
                    >
                        <MapPin className="w-5 h-5 text-green-500" />
                        <span>Universidade Federal de Rondonópolis - MT</span>
                    </a>

                </div>
              </div>
            </div>

            {/* Texto institucional */}
            <div className="mt-10">
              <p className="text-background/70 text-lg leading-relaxed max-w-3xl">
                Plataforma dedicada à preservação, valorização e divulgação
                dos saberes indígenas através da educação, cultura e tecnologia.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-white/10 mt-10 pt-5 flex flex-col md:flex-row items-center justify-between gap-3">

          <p className="text-sm text-background/55 text-center md:text-left">
            © {new Date().getFullYear()} Ação Saberes Indígenas na Escola.
            Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-2 text-sm text-background/55">
            <span>Feito com</span>

            <Heart className="w-4 h-4 text-red-400 fill-red-400" />

            <span>para preservação cultural</span>
          </div>
        </div>
      </div>
    </footer>
  );
}