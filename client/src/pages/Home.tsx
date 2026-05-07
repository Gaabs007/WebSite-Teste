import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Image, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
              Ação Saberes <span className="text-primary">Indígenas</span> na Escola
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8">
              Uma plataforma dedicada à divulgação e fortalecimento dos saberes indígenas através de ferramentas digitais acessíveis e modernas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/podcasts">
                <Button size="lg" className="w-full sm:w-auto">
                  Explorar Podcasts
                </Button>
              </Link>
              <Link href="/sobre">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Conheça o Projeto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Nossos Objetivos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-primary">Preservar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  Documentar e preservar os saberes tradicionais indígenas para as futuras gerações.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-secondary/20 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-secondary">Divulgar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  Compartilhar conhecimentos culturais com a comunidade escolar e sociedade em geral.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-primary">Fortalecer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  Valorizar e fortalecer a identidade cultural indígena através da educação.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 md:py-24 bg-foreground/5">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Conheça Nosso Conteúdo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Podcasts Card */}
            <Link href="/podcasts">
              <div className="group cursor-pointer">
                <Card className="h-full hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Music className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Podcasts</CardTitle>
                    <CardDescription>
                      Histórias, conhecimentos e tradições em áudio e vídeo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 mb-4">
                      Ouça e assista a conteúdos exclusivos sobre saberes indígenas, contados por especialistas e membros da comunidade.
                    </p>
                    <div className="flex items-center text-primary font-medium">
                      Explorar <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>

            {/* Album Card */}
            <Link href="/album">
              <div className="group cursor-pointer">
                <Card className="h-full hover:shadow-lg transition-all border-2 border-transparent hover:border-secondary/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                      <Image className="w-6 h-6 text-secondary" />
                    </div>
                    <CardTitle>Álbum</CardTitle>
                    <CardDescription>
                      Galeria de imagens e momentos especiais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 mb-4">
                      Explore uma coleção visual de eventos, atividades e momentos importantes do projeto.
                    </p>
                    <div className="flex items-center text-secondary font-medium">
                      Visualizar <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>

            {/* Team Card */}
            <Link href="/sobre">
              <div className="group cursor-pointer">
                <Card className="h-full hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Equipe</CardTitle>
                    <CardDescription>
                      Conheça os integrantes do projeto
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 mb-4">
                      Saiba mais sobre as pessoas dedicadas a preservar e compartilhar os saberes indígenas.
                    </p>
                    <div className="flex items-center text-primary font-medium">
                      Conhecer <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Participe da Preservação Cultural
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a nós na missão de valorizar, preservar e compartilhar os saberes indígenas com as futuras gerações.
          </p>
          <Link href="/sobre">
            <Button size="lg" variant="secondary">
              Saiba Mais
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
