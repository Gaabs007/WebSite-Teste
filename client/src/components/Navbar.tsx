import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/podcasts", label: "Podcasts" },
    { href: "/album", label: "Álbum" },
    { href: "/documentos", label: "Documentos" },
    { href: "/sobre", label: "Sobre" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 font-serif font-bold text-xl text-primary hover:text-primary/80 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              SI
            </div>
            <span className="hidden sm:inline">Saberes Indígenas</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer">
                {link.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button size="sm" variant="outline">
              Painel Admin
            </Button>
          </Link>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
            >
              Sair
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </div>
              </Link>
            ))}
            <div className="border-t border-border pt-4 flex flex-col gap-2">
              <Link href="/login">
                <div
                  className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Painel Admin
                </div>
              </Link>
              {user && (
                <Button
                  variant="outline"
                  size="sm"
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
