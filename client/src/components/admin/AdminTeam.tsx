import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminTeam() {
  const { data: members = [], isLoading, refetch } = trpc.teamMembers.list.useQuery();
  const createMutation = trpc.teamMembers.create.useMutation();
  const updateMutation = trpc.teamMembers.update.useMutation();
  const deleteMutation = trpc.teamMembers.delete.useMutation();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    photoUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("Integrante atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Integrante criado com sucesso!");
      }
      setOpen(false);
      setFormData({
        name: "",
        role: "",
        description: "",
        photoUrl: "",
      });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar integrante");
    }
  };

  const handleEdit = (member: typeof members[0]) => {
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description || "",
      photoUrl: member.photoUrl,
    });
    setEditingId(member.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este integrante?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("Integrante deletado com sucesso!");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar integrante");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Equipe</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  role: "",
                  description: "",
                  photoUrl: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Integrante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Integrante" : "Adicionar Novo Integrante"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do integrante abaixo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nome do integrante"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Função/Cargo</label>
                <Input
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  placeholder="Ex: Coordenador, Educador, Pesquisador"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Breve apresentação ou função no projeto"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL da Foto</label>
                <Input
                  required
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, photoUrl: e.target.value })
                  }
                  placeholder="https://example.com/photo.jpg"
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
                  {editingId ? "Atualizar" : "Adicionar"}
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
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-foreground/30 mb-4" />
            <p className="text-foreground/60">Nenhum integrante cadastrado ainda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="relative w-full h-40 bg-foreground/10 overflow-hidden">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold">
                      {member.role}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 line-clamp-2">
                  {member.description || "Sem descrição"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
