import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import AdminPodcasts from "@/components/admin/AdminPodcasts";
import AdminAlbum from "@/components/admin/AdminAlbum";
import AdminTeam from "@/components/admin/AdminTeam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {

      if (!user || user.role !== "admin") {
        setLocation("/login");
      }

    }

  }, [user, loading, setLocation]);

  // Enquanto autenticação carrega
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Bloqueia renderização
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-foreground/5">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-foreground/80">
            Gerencie podcasts, postagens do álbum e integrantes da equipe
          </p>
        </div>

        <Tabs defaultValue="podcasts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="album">Álbum</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
          </TabsList>

          <TabsContent value="podcasts" className="mt-6">
            <AdminPodcasts />
          </TabsContent>

          <TabsContent value="album" className="mt-6">
            <AdminAlbum />
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <AdminTeam />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
