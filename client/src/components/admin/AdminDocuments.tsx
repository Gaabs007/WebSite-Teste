import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminDocuments() {
  const {
    data: documents = [],
    isLoading,
    refetch,
  } = trpc.documents.list.useQuery();

  const createMutation = trpc. documents.create.useMutation();
  const updateMutation = trpc.documents.update.useMutation();
  const deleteMutation = trpc.documents.delete.useMutation();

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    documentUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: formData.title,
          description: formData.description,
          documentUrl: formData.documentUrl,
        });

        toast.success("Documento atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          description: formData.description,
          documentUrl: formData.documentUrl,
        });

        toast.success("Documento criado com sucesso!");
      }

      setOpen(false);

      setFormData({
        title: "",
        description: "",
        documentUrl: "",
      });

      setEditingId(null);

      refetch();
    } catch (error) {
      toast.error("Erro ao salvar documento");
    }
  };

  const handleEdit = (document: typeof documents[0]) => {
    setFormData({
      title: document.title,
      description: document.description || "",
      documentUrl: document.documentUrl,
    });

    setEditingId(document.id);

    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este documento?")) {
      try {
        await deleteMutation.mutateAsync(id);

        toast.success("Documento deletado com sucesso!");

        refetch();
      } catch (error) {
        toast.error("Erro ao deletar documento");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Gerenciar Documentos
        </h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);

                setFormData({
                  title: "",
                  description: "",
                  documentUrl: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Documento
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? "Editar Documento"
                  : "Criar Novo Documento"}
              </DialogTitle>

              <DialogDescription>
                Preencha os dados do documento abaixo
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título
                </label>

                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  placeholder="Título do documento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição
                </label>

                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descrição do documento"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  URL do Documento PDF
                </label>

                <Input
                  required
                  type="url"
                  value={formData.documentUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      documentUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com/documento.pdf"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
                >
                  {createMutation.isPending ||
                  updateMutation.isPending ? (
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
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-foreground/30 mb-4" />

            <p className="text-foreground/60">
              Nenhum documento cadastrado ainda
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>
                      {document.title}
                    </CardTitle>

                    <CardDescription className="mt-1">
                      Documento PDF
                    </CardDescription>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <a
                        href={document.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleEdit(document)
                      }
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleDelete(document.id)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-foreground/80 mb-4">
                  {document.description ||
                    "Sem descrição"}
                </p>

                <a
                  href={document.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline break-all"
                >
                  {document.documentUrl}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}