import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Image as ImageIcon, Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function normalizeImages(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

export default function AdminAlbum() {
  const { data: posts = [], isLoading, refetch } = trpc.albumPosts.list.useQuery();
  const createMutation = trpc.albumPosts.create.useMutation();
  const updateMutation = trpc.albumPosts.update.useMutation();
  const deleteMutation = trpc.albumPosts.delete.useMutation();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrls: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrls = formData.imageUrls
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: formData.title,
          description: formData.description,
          imageUrls, 
        });
        toast.success("Postagem atualizada com sucesso!");
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          description: formData.description,
          imageUrls,
        });
        toast.success("Postagem criada com sucesso!");
      }
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        imageUrls: "",
      });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar postagem");
    }
  };

  const handleEdit = (post: typeof posts[0]) => {
    setFormData({
      title: post.title,
      description: post.description || "",
      imageUrls: post.imageUrls.join("\n"),
    });
    setEditingId(post.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta postagem?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Postagem deletada com sucesso!");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar postagem");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Álbum</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: "",
                  description: "",
                  imageUrls: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Postagem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Postagem" : "Criar Nova Postagem"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da postagem abaixo
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
                  placeholder="Título da postagem"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrição da postagem"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  URLs das Imagens (uma por linha)
                </label>
                <Textarea
                  required
                  value={formData.imageUrls}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrls: e.target.value })
                  }
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={5}
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
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="w-12 h-12 text-foreground/30 mb-4" />
            <p className="text-foreground/60">Nenhuma postagem criada ainda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const images = normalizeImages(post.imageUrls);
            return (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {images.length} imagem{images.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 line-clamp-2 mb-3">
                    {post.description || "Sem descrição"}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {images.slice(0, 3).map((url: string, idx: number) => (
                      <div key={idx} className="w-16 h-16 rounded overflow-hidden bg-foreground/10">
                        <img
                          src={url}
                          alt={`Preview ${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {images.length > 3 && (
                      <div className="w-16 h-16 rounded bg-foreground/10 flex items-center justify-center text-sm font-medium">
                        +{images.length - 3}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
