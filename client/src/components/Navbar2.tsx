import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/podcasts", label: "Podcasts" },
    { href: "/album", label: "Álbum" },
    { href: "/sobre", label: "Sobre" },
  ];

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-50
        border-b border-black/30
        shadow-2xl
        backdrop-blur-md
        overflow-hidden
        bg-[linear-gradient(to_bottom,_#0f5c2b_0%,_#166534_28%,_#991b1b_50%,_#166534_72%,_#0f5c2b_100%)]
        before:absolute before:inset-0
        before:bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),rgba(255,255,255,0.14),transparent_320px)]
        before:pointer-events-none
      "
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        e.currentTarget.style.setProperty(
          "--x",
          `${e.clientX - rect.left}px`
        );

        e.currentTarget.style.setProperty(
          "--y",
          `${e.clientY - rect.top}px`
        );
      }}
    >
      {/* Camada escura */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none z-0" />

      {/* Conteúdo */}
      <div className="container relative z-10 flex items-center justify-between h-20">

        {/* Logo */}
        <Link href="/">
          <div
            className="
              flex items-center gap-4 cursor-pointer group
              transition-all duration-300
              hover:scale-[1.03]
              hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]
            "
          >
            <img
              src="/img/logo.webp"
              alt="Saberes Indígenas"
              className="
                h-14 md:h-16
                w-auto
                object-contain
                rounded-xl
                group-hover:opacity-90
                transition-opacity
              "
            />

            <div className="flex flex-col leading-tight">
              <span className="text-white font-serif font-bold text-xl md:text-2xl">
                Saberes Indígenas na Escola
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div
                className="
                  text-white/100
                  hover:text-white
                  transition-all duration-300
                  font-medium
                  cursor-pointer
                  !text-3x1
                  hover:scale-110
                  hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)]
                "
              >
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => logout()}
              className="bg-white text-green-700 hover:bg-green-50"
            >
              Sair
            </Button>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-green-700/40 bg-black/90 backdrop-blur-md">
          <div className="container py-4 flex flex-col gap-4">

            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className="
                    text-white/90
                    hover:text-white
                    transition-all duration-300
                    font-medium
                    cursor-pointer
                    text-lg
                    hover:scale-105
                    hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)]
                  "
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </div>
              </Link>
            ))}

            <div className="border-t border-white/10 pt-4 flex flex-col gap-2">

              <Link href="/login">
                <div
                  className="
                    text-white/90
                    hover:text-white
                    transition-all duration-300
                    font-medium
                    cursor-pointer
                    text-lg
                    hover:scale-105
                    hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.55)]
                  "
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Painel Admin
                </div>
              </Link>

              {user && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-green-700 hover:bg-green-50"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sair
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}