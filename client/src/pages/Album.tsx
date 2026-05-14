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
} from "@/components/ui/dialog";

import {
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";

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
  const { data: posts = [], isLoading } =
    trpc.albumPosts.list.useQuery();

  const [selectedImageIndex, setSelectedImageIndex] =
    useState<number | null>(null);

  const [selectedPostId, setSelectedPostId] =
    useState<number | null>(null);

  const currentPost =
    posts.find((p) => p.id === selectedPostId);

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
            Explore uma coleção visual de eventos,
            atividades e momentos especiais do projeto.
          </p>
        </div>

        {/* Modal */}
        <Dialog
          open={!!currentImage}
          onOpenChange={() => {
            setSelectedImageIndex(null);
            setSelectedPostId(null);
          }}
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

            {currentImage && currentPost && (

              <div className="w-full h-full flex relative">

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
                    relative
                  "
                >

                  <button
                    onClick={() => {
                      setSelectedImageIndex(null);
                      setSelectedPostId(null);
                    }}
                    className="
                      absolute
                      top-4
                      right-4
                      z-20
                      text-white
                      hover:text-gray-300
                      transition-colors
                    "
                  >
                    <X className="w-8 h-8" />
                  </button>

                  <img
                    src={currentImage}
                    alt="Imagem ampliada"
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

                    <h1 className="text-5xl font-serif leading-tight mb-4">
                      {currentPost.title}
                    </h1>

                    {currentPost.createdAt && (
                      <p className="text-primary font-semibold text-2xl mb-8">
                        {new Date(
                          currentPost.createdAt
                        ).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}

                    {currentPost.description && (
                      <div
                        className="
                          text-lg
                          leading-relaxed
                          text-foreground/80
                          whitespace-pre-line
                        "
                      >
                        {currentPost.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Navegação */}
                {currentImages.length > 1 && (

                  <div
                    className="
                      absolute
                      bottom-6
                      left-1/2
                      -translate-x-1/2
                      z-30
                      flex
                      items-center
                      gap-6
                      bg-black/70
                      backdrop-blur-md
                      px-6
                      py-3
                      rounded-2xl
                      border
                      border-white/10
                    "
                  >

                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex === 0
                            ? currentImages.length - 1
                            : selectedImageIndex! - 1
                        )
                      }
                      className="
                        px-5
                        py-2
                        rounded-xl
                        bg-primary/90
                        hover:bg-primary
                        text-white
                        transition-colors
                      "
                    >
                      ← Anterior
                    </button>

                    <span className="text-sm text-white whitespace-nowrap">
                      {selectedImageIndex! + 1} de{" "}
                      {currentImages.length}
                    </span>

                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          selectedImageIndex ===
                            currentImages.length - 1
                            ? 0
                            : selectedImageIndex! + 1
                        )
                      }
                      className="
                        px-5
                        py-2
                        rounded-xl
                        bg-primary/90
                        hover:bg-primary
                        text-white
                        transition-colors
                      "
                    >
                      Próxima →
                    </button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

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
                  onClick={() => {
                    if (images.length > 0) {
                      setSelectedPostId(post.id);
                      setSelectedImageIndex(0);
                    }
                  }}
                  className="
                    overflow-hidden
                    border-2
                    border-primary/20
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:border-primary/50
                    hover:shadow-2xl
                  "
                >

                  <CardHeader>
                    <CardTitle>
                      {post.title}
                    </CardTitle>

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

                          <div
                            key={index}
                            className="
                              relative
                              group
                              overflow-hidden
                              rounded-lg
                              bg-foreground/10
                              min-h-[220px]
                              flex
                              items-center
                              justify-center
                              border-2
                              border-transparent
                              transition-all
                              duration-300
                            "
                          >

                            <img
                              src={image}
                              alt={`${post.title} - Imagem ${index + 1}`}
                              className="
                                max-h-[300px]
                                w-full
                                object-contain
                                transition-transform
                                duration-300
                                group-hover:scale-105
                              "
                            />

                            <div
                              className="
                                absolute
                                inset-0
                                bg-black/20
                                opacity-0
                                group-hover:opacity-100
                                transition-opacity
                                flex
                                items-center
                                justify-center
                              "
                            >

                              <div
                                className="
                                  bg-black/70
                                  p-3
                                  rounded-full
                                  backdrop-blur-md
                                "
                              >
                                <ImageIcon className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          </div>
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