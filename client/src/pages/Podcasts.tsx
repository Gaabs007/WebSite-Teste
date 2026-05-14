import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Podcasts() {
  const { data: podcasts = [], isLoading } = trpc.podcasts.list.useQuery();
  const [selectedPodcast, setSelectedPodcast] = useState<typeof podcasts[0] | null>(null);
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Podcasts
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl">
            Ouça histórias, conhecimentos e tradições indígenas contadas por especialistas e membros da comunidade.
          </p>
        </div>

        {/* Player Modal */}
        {selectedPodcast && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{selectedPodcast.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {selectedPodcast.description}
                  </CardDescription>
                </div>
                <button
                  onClick={() => setSelectedPodcast(null)}
                  className="text-foreground/50 hover:text-foreground ml-4"
                >
                  ✕
                </button>
              </CardHeader>
              <CardContent>
                {selectedPodcast.mediaType === "audio" ? (
                  <iframe data-testid="embed-iframe"
                          //style="border-radius:12px" 
                          src={selectedPodcast.mediaUrl}
                          width="100%" height="352" 
                          frameBorder="0" 
                          //allowfullscreen="" 
                          allow="autoplay; 
                          clipboard-write; 
                          encrypted-media; 
                          fullscreen; 
                          picture-in-picture" 
                          loading="lazy">
                  </iframe>
                ) : (
                  <iframe
                    className="w-full aspect-video rounded-lg mb-4"
                    src={selectedPodcast.mediaUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedPodcast(null)}
                  className="w-full"
                >
                  Fechar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Podcasts Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : podcasts.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="text-foreground/60">Nenhum podcast disponível no momento.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcasts.map((podcast) => (
              <Card
                key={podcast.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary/50"
              >
                {podcast.thumbnailUrl && (
                  <div className="w-full bg-foreground/10 flex items-center justify-center p-4">
                    <img
                      src={podcast.thumbnailUrl}
                      alt={podcast.title}
                      className="max-h-64 w-auto object-contain"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {!podcast.thumbnailUrl && (
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Music className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg">{podcast.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {podcast.mediaType === "audio" ? "🎙️ Áudio" : "🎬 Vídeo"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 text-sm mb-4 line-clamp-3">
                    {podcast.description || "Sem descrição disponível"}
                  </p>
                  <Button
                    onClick={() => setSelectedPodcast(podcast)}
                    className="w-full"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Reproduzir
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
