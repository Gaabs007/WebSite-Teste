import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Music, Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminPodcasts() {
  const { data: podcasts = [], isLoading, refetch } = trpc.podcasts.list.useQuery();
  const createMutation = trpc.podcasts.create.useMutation();
  const updateMutation = trpc.podcasts.update.useMutation();
  const deleteMutation = trpc.podcasts.delete.useMutation();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaUrl: "",
    mediaType: "audio" as "audio" | "video",
    thumbnailUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("Podcast atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Podcast criado com sucesso!");
      }
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        mediaUrl: "",
        mediaType: "audio",
        thumbnailUrl: "",
      });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar podcast");
      console.error(error);
    }
  };

  const handleEdit = (podcast: typeof podcasts[0]) => {
    setFormData({
      title: podcast.title,
      description: podcast.description || "",
      mediaUrl: podcast.mediaUrl,
      mediaType: podcast.mediaType as "audio" | "video",
      thumbnailUrl: podcast.thumbnailUrl || "",
    });
    setEditingId(podcast.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este podcast?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Podcast deletado com sucesso!");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar podcast");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Podcasts</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: "",
                  description: "",
                  mediaUrl: "",
                  mediaType: "audio",
                  thumbnailUrl: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Podcast
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Podcast" : "Criar Novo Podcast"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do podcast abaixo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Título do podcast"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição do podcast"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Mídia</label>
                <Select value={formData.mediaType} onValueChange={(value) =>
                  setFormData({ ...formData, mediaType: value as "audio" | "video" })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="audio">Áudio</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL da Mídia</label>
                <Input
                  required
                  type="url"
                  value={formData.mediaUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, mediaUrl: e.target.value })
                  }
                  placeholder="https://example.com/podcast.mp3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL da Thumbnail (opcional)</label>
                <Input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnailUrl: e.target.value })
                  }
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : podcasts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Music className="w-12 h-12 text-foreground/30 mb-4" />
            <p className="text-foreground/60">Nenhum podcast criado ainda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {podcasts.map((podcast) => (
            <Card key={podcast.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{podcast.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {podcast.mediaType === "audio" ? "🎙️ Áudio" : "🎬 Vídeo"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(podcast)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(podcast.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 line-clamp-2">
                  {podcast.description || "Sem descrição"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
