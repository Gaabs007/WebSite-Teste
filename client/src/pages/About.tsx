import { useState } from "react";
import { trpc } from "@/lib/trpc";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Users, Loader2 } from "lucide-react";

export default function About() {
  const { data: teamMembers = [], isLoading } =
    trpc.teamMembers.list.useQuery();

  const [selectedMember, setSelectedMember] = useState<any>(null);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Sobre o Projeto
          </h1>

          <p className="text-lg text-foreground/80 max-w-3xl">
            A Ação Saberes Indígenas na Escola é uma iniciativa dedicada à
            preservação, divulgação e fortalecimento dos conhecimentos
            tradicionais indígenas através de ferramentas digitais acessíveis e
            modernas.
          </p>
        </div>

        {/* Projeto */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">

          <div>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              Missão
            </h2>

            <p className="text-foreground/80 leading-relaxed">
              Valorizar, preservar e compartilhar os saberes indígenas com a
              comunidade escolar e sociedade em geral, utilizando tecnologia
              como ferramenta de inclusão e educação cultural.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-secondary mb-4">
              Visão
            </h2>

            <p className="text-foreground/80 leading-relaxed">
              Criar uma plataforma digital que seja referência na preservação e
              divulgação de conhecimentos indígenas, contribuindo para a
              valorização da identidade cultural e o fortalecimento das
              comunidades indígenas.
            </p>
          </div>
        </div>

        {/* Team */}
        <div className="mb-12">

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
            Equipe
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>

          ) : teamMembers.length === 0 ? (

            <div className="text-center py-12">
              <Users className="w-12 h-12 text-foreground/30 mx-auto mb-4" />

              <p className="text-foreground/60">
                Nenhum integrante cadastrado no momento.
              </p>
            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {teamMembers.map((member) => (
                <Card
                  key={member.id}
                  className="
                    overflow-hidden
                    hover:shadow-2xl
                    transition-all
                    duration-300
                    border-2
                    border-transparent
                    hover:border-primary/50
                    flex
                    flex-col
                  "
                >

                  {/* Imagem */}
                  <div className="w-full h-[340px] bg-foreground/10 flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="
                        max-h-full
                        max-w-full
                        object-contain
                        rounded-xl
                      "
                    />
                  </div>

                  {/* Cabeçalho */}
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {member.name}
                    </CardTitle>

                    <CardDescription className="text-primary font-semibold text-base">
                      {member.role}
                    </CardDescription>
                  </CardHeader>

                  {/* Conteúdo */}
                  <CardContent className="flex flex-col flex-1">

                    <div
                      className="
                        text-foreground/80
                        text-sm
                        leading-relaxed
                        overflow-hidden
                        relative
                        min-h-[120px]
                      "
                    >
                      <p className="line-clamp-5">
                        {member.description ||
                          "Membro dedicado do projeto."}
                      </p>

                      {(member.description?.length || 0) > 220 && (
                        <div className="mt-3">
                          <button
                            onClick={() => setSelectedMember(member)}
                            className="
                              text-primary
                              font-semibold
                              hover:underline
                              transition-colors
                            "
                          >
                            Ler mais
                          </button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <Dialog
          open={!!selectedMember}
          onOpenChange={() => setSelectedMember(null)}
        >

          <DialogContent
            className="
              !w-[95vw]
              !max-w-[1700px]
              h-[90vh]
              p-0
              overflow-hidden
              border-2
              border-primary/20
            "
          >

            {selectedMember && (

              <div className="w-full h-full flex">

                {/* IMAGEM */}
                <div
                  className="
                    w-1/2
                    h-full
                    bg-black/40
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    p-8
                  "
                >

                  <img
                    src={selectedMember.photoUrl}
                    alt={selectedMember.name}
                    className="
                      max-w-full
                      max-h-full
                      object-contain
                      rounded-2xl
                      shadow-2xl
                    "
                  />
                </div>

                {/* TEXTO */}
                <div
                  className="
                    w-1/2
                    h-full
                    overflow-y-auto
                    border-l
                    border-primary/20
                    bg-card
                  "
                >

                  <div className="p-8">

                    <DialogHeader>
                      <DialogTitle className="text-5xl font-serif leading-tight mb-4">
                        {selectedMember.name}
                      </DialogTitle>
                    </DialogHeader>

                    <p className="text-primary font-semibold text-2xl mb-8">
                      {selectedMember.role}
                    </p>

                    <div
                      className="
                        text-lg
                        leading-relaxed
                        text-foreground/80
                        whitespace-pre-line
                      "
                    >
                      {selectedMember.description ||
                        "Membro dedicado do projeto."}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Valores */}
        <div className="bg-primary/10 rounded-lg p-8 md:p-12">

          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            Nossos Valores
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <h3 className="font-bold text-primary mb-2">
                Respeito Cultural
              </h3>

              <p className="text-foreground/80">
                Valorizamos e respeitamos a diversidade e singularidade de cada
                cultura indígena.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-secondary mb-2">
                Inclusão
              </h3>

              <p className="text-foreground/80">
                Garantimos acesso igualitário ao conhecimento e à participação
                de todos.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-primary mb-2">
                Autenticidade
              </h3>

              <p className="text-foreground/80">
                Mantemos a integridade e autenticidade dos saberes tradicionais
                compartilhados.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-secondary mb-2">
                Inovação
              </h3>

              <p className="text-foreground/80">
                Utilizamos tecnologia moderna para preservar e divulgar
                conhecimentos ancestrais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}