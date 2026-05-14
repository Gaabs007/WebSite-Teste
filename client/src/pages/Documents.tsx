import { trpc } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function Documents() {
  const {
    data: documents = [],
    isLoading,
  } = trpc.documents.list.useQuery();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Documentos
          </h1>

          <p className="text-lg text-foreground/80 max-w-2xl">
            Acesse documentos, pesquisas, materiais didáticos e conteúdos em PDF relacionados aos saberes indígenas.
          </p>
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-foreground/30 mx-auto mb-4" />

            <p className="text-foreground/60">
              Nenhum documento disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <Card
                key={document.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {document.title}
                      </CardTitle>

                      <CardDescription className="text-sm">
                        📄 Documento PDF
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-foreground/80 text-sm mb-4 line-clamp-4">
                    {document.description ||
                      "Sem descrição disponível"}
                  </p>

                  <Button
                    asChild
                    className="w-full"
                    size="sm"
                  >
                    <a
                      href={document.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir Documento
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}