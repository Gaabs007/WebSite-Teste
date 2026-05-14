import { trpc } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import { useState } from "react";

/**
 * Normaliza imageUrls vindos do backend
 * - null → []
 * - string JSON → string[]
 * - string simples → [string]
 * - array → array
 */
function parseImageUrls(imageUrls: unknown): string[] {
  if (!imageUrls) return [];

  if (Array.isArray(imageUrls)) return imageUrls;

  if (typeof imageUrls === "string") {
    try {
      const parsed = JSON.parse(imageUrls);
      return Array.isArray(parsed) ? parsed : [imageUrls];
    } catch {
      return [imageUrls];
    }
  }

  return [];
}

export default function Album() {
  const { data: posts = [], isLoading } = trpc.albumPosts.list.useQuery();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const currentPost = posts.find((p) => p.id === selectedPostId);
  const currentImages = currentPost
    ? parseImageUrls(currentPost.imageUrls)
    : [];

  const currentImage =
    selectedImageIndex !== null
      ? currentImages[selectedImageIndex]
      : null;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Álbum
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl">
            Explore uma coleção visual de eventos, atividades e momentos especiais
            do projeto.
          </p>
        </div>

        {/* Image Viewer Modal */}
        {currentImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => {
                  setSelectedImageIndex(null);
                  setSelectedPostId(null);
                }}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X className="w-8 h-8" />
              </button>

              <img
                src={currentImage}
                alt="Imagem ampliada"
                className="w-full h-auto rounded-lg"
              />

              {currentImages.length > 1 && (
                <div className="flex justify-between items-center mt-4 text-white">
                  <button
                    onClick={() =>
                      setSelectedImageIndex(
                        selectedImageIndex === 0
                          ? currentImages.length - 1
                          : selectedImageIndex! - 1
                      )
                    }
                    className="px-4 py-2 bg-primary/80 hover:bg-primary rounded-lg"
                  >
                    ← Anterior
                  </button>

                  <span className="text-sm">
                    {selectedImageIndex! + 1} de {currentImages.length}
                  </span>

                  <button
                    onClick={() =>
                      setSelectedImageIndex(
                        selectedImageIndex === currentImages.length - 1
                          ? 0
                          : selectedImageIndex! + 1
                      )
                    }
                    className="px-4 py-2 bg-primary/80 hover:bg-primary rounded-lg"
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Posts */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="text-foreground/60">
              Nenhuma postagem disponível no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => {
              const images = parseImageUrls(post.imageUrls);

              return (
                <Card
                  key={post.id}
                  className="overflow-hidden border-2 border-primary/20"
                >
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    {post.description && (
                      <CardDescription className="mt-2">
                        {post.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedPostId(post.id);
                              setSelectedImageIndex(index);
                            }}
                            className="relative group overflow-hidden rounded-lg bg-foreground/10 min-h-[200px] flex items-center justify-center"
                          >
                            <img
                              src={image}
                              alt={`${post.title} - Imagem ${index + 1}`}
                              className="max-h-[300px] w-full object-contain group-hover:scale-105 transition-transform"

                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-white" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}