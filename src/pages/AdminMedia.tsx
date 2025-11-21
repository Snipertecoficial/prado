import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminApiRequest,
  createProductMedia,
  generateImageStagedUpload,
  setMediaMetafield,
  updateProductMedia,
  type StagedUploadTarget,
} from "@/lib/shopify-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Images,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";

interface MediaItem {
  id: string;
  alt: string | null;
  previewUrl: string;
  position: number;
}

interface ProductMediaResponse {
  data: {
    productByHandle: {
      id: string;
      title: string;
      handle: string;
      media: {
        edges: Array<{
          node: {
            id: string;
            alt: string | null;
            mediaContentType: string;
            preview: { image: { url: string } };
          };
        }>;
      };
      metafield?: {
        id: string;
        value: string;
      } | null;
    } | null;
  };
}

type UploadStatus =
  | { fileName: string; state: "pending" | "staging" | "uploading" | "creating"; progress: number }
  | { fileName: string; state: "error"; message: string };

const PRODUCT_MEDIA_BY_HANDLE = `
  query productMediaByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      media(first: 30) {
        edges {
          node {
            ... on MediaImage {
              id
              alt
              mediaContentType
              preview { image { url } }
            }
          }
        }
      }
      metafield(namespace: "custom", key: "media_gallery") {
        id
        value
      }
    }
  }
`;

const AdminMedia = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [handle, setHandle] = useState("perfil-estrutural-em-aluminio-20x40-v-slot-preto-canal-6");
  const [productId, setProductId] = useState<string | null>(null);
  const [productTitle, setProductTitle] = useState<string>("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const orderedMedia = useMemo(
    () => [...mediaItems].sort((a, b) => a.position - b.position),
    [mediaItems],
  );

  const fetchProductMedia = useCallback(async () => {
    if (!handle) return;
    try {
      setLoading(true);
      const response = await adminApiRequest<ProductMediaResponse>(PRODUCT_MEDIA_BY_HANDLE, { handle });
      const product = response.data.productByHandle;

      if (!product) {
        toast({
          variant: "destructive",
          title: "Produto não encontrado",
          description: "Verifique o handle informado.",
        });
        return;
      }

      setProductId(product.id);
      setProductTitle(product.title);

      const metafieldValue = product.metafield?.value ? JSON.parse(product.metafield.value) : null;
      const parsedMetafield = Array.isArray(metafieldValue)
        ? (metafieldValue as Array<{ id: string; alt?: string | null; position?: number }>)
        : [];

      const items: MediaItem[] = product.media.edges
        .map(edge => edge.node)
        .filter(node => node.mediaContentType === "IMAGE")
        .map((node, index) => {
          const metafieldEntry = parsedMetafield.find(entry => entry.id === node.id);
          return {
            id: node.id,
            alt: metafieldEntry?.alt ?? node.alt ?? null,
            previewUrl: node.preview.image.url,
            position: metafieldEntry?.position ?? index + 1,
          };
        })
        .sort((a, b) => a.position - b.position);

      setMediaItems(items);
    } catch (error: unknown) {
      console.error("Erro ao carregar mídia:", error);
      const message = error instanceof Error ? error.message : "Não foi possível buscar as mídias.";
      toast({
        variant: "destructive",
        title: "Erro ao carregar",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [handle, toast]);

  useEffect(() => {
    fetchProductMedia();
  }, [fetchProductMedia]);

  const syncMediaState = async (items: MediaItem[], mediaIdsToDelete?: string[]) => {
    if (!productId) return;
    setSyncing(true);
    try {
      const updatePayload = items.map((item, index) => ({
        id: item.id,
        alt: item.alt,
        position: index + 1,
      }));

      await updateProductMedia(productId, updatePayload, mediaIdsToDelete);

      await setMediaMetafield(productId, updatePayload);
      toast({ title: "Galeria sincronizada" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Revise o token e tente novamente.";
      toast({
        variant: "destructive",
        title: "Falha ao sincronizar",
        description: message,
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleReorder = (index: number, direction: "up" | "down") => {
    const newMedia = [...orderedMedia];
    if (direction === "up" && index > 0) {
      [newMedia[index - 1], newMedia[index]] = [newMedia[index], newMedia[index - 1]];
    } else if (direction === "down" && index < newMedia.length - 1) {
      [newMedia[index + 1], newMedia[index]] = [newMedia[index], newMedia[index + 1]];
    }

    const withPositions = newMedia.map((item, idx) => ({ ...item, position: idx + 1 }));
    setMediaItems(withPositions);
    syncMediaState(withPositions);
  };

  const handleCaptionChange = (id: string, alt: string) => {
    const updated = mediaItems.map(item => (item.id === id ? { ...item, alt } : item));
    setMediaItems(updated);
    syncMediaState(updated);
  };

  const handleDelete = (id: string) => {
    const remaining = mediaItems.filter(item => item.id !== id).map((item, index) => ({
      ...item,
      position: index + 1,
    }));
    setMediaItems(remaining);
    syncMediaState(remaining, [id]);
  };

  const uploadFileToShopify = async (file: File, stagedTarget: StagedUploadTarget) => {
    const formData = new FormData();
    stagedTarget.parameters.forEach(param => formData.append(param.name, param.value));
    formData.append("file", file);

    await fetch(stagedTarget.url, {
      method: "POST",
      body: formData,
    });
  };

  const handleUpload = async (files?: FileList | null) => {
    if (!productId) {
      toast({
        variant: "destructive",
        title: "Produto não carregado",
        description: "Busque um produto antes de subir arquivos.",
      });
      return;
    }

    const selectedFiles = files ? Array.from(files) : Array.from(fileInputRef.current?.files || []);
    if (!selectedFiles.length) return;

    // Validate file types and sizes
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    const invalidFiles = selectedFiles.filter(file => {
      const isValidType = ALLOWED_TYPES.includes(file.type);
      const isValidSize = file.size <= MAX_FILE_SIZE;
      return !isValidType || !isValidSize;
    });

    if (invalidFiles.length > 0) {
      const messages = invalidFiles.map(file => {
        if (!ALLOWED_TYPES.includes(file.type)) {
          return `${file.name}: tipo de arquivo inválido`;
        }
        if (file.size > MAX_FILE_SIZE) {
          return `${file.name}: arquivo muito grande (máximo 10MB)`;
        }
        return file.name;
      });
      
      toast({
        variant: "destructive",
        title: "Arquivos inválidos",
        description: messages.join(', '),
      });
      return;
    }

    const initialStatuses: UploadStatus[] = selectedFiles.map(file => ({
      fileName: file.name,
      state: "pending",
      progress: 0,
    }));
    setUploadStatuses(initialStatuses);

    for (const [index, file] of selectedFiles.entries()) {
      try {
        setUploadStatuses(prev =>
          prev.map((status, idx) =>
            idx === index ? { ...status, state: "staging", progress: 10 } : status,
          ),
        );

        const stagedTarget = await generateImageStagedUpload(file);

        setUploadStatuses(prev =>
          prev.map((status, idx) =>
            idx === index ? { ...status, state: "uploading", progress: 40 } : status,
          ),
        );

        await uploadFileToShopify(file, stagedTarget);

        setUploadStatuses(prev =>
          prev.map((status, idx) =>
            idx === index ? { ...status, state: "creating", progress: 70 } : status,
          ),
        );

        await createProductMedia(productId, [
          {
            originalSource: stagedTarget.resourceUrl,
            alt: file.name,
          },
        ]);

        setUploadStatuses(prev =>
          prev.map((status, idx) =>
            idx === index ? { ...status, state: "creating", progress: 100 } : status,
          ),
        );
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Não foi possível enviar o arquivo.";
        setUploadStatuses(prev =>
          prev.map((status, idx) =>
            idx === index
              ? { fileName: file.name, state: "error", message: message || "Falha ao subir" }
              : status,
          ),
        );
        toast({
          variant: "destructive",
          title: "Erro no upload",
          description: message,
        });
      }
    }

    await fetchProductMedia();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-6">
        <Button variant="ghost" className="mb-2" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-3">
          <Images className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Administração de Mídia</h1>
            <p className="text-muted-foreground text-sm">Envie, exclua, reordene e sincronize as imagens do produto.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Produto alvo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 md:grid-cols-[2fr,auto] md:items-end">
              <div>
                <Label htmlFor="handle">Handle do produto</Label>
                <Input
                  id="handle"
                  value={handle}
                  onChange={event => setHandle(event.target.value)}
                  placeholder="produto-handle"
                />
              </div>
              <Button onClick={fetchProductMedia} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span className="ml-2">Buscar</span>
              </Button>
            </div>

            {productId && (
              <p className="text-sm text-muted-foreground">
                Produto carregado: <strong>{productTitle}</strong>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>Uploads</CardTitle>
            <p className="text-sm text-muted-foreground">Use imagens em JPG ou PNG. A legenda é definida pelo nome do arquivo.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Input ref={fileInputRef} type="file" multiple accept="image/*" onChange={event => handleUpload(event.target.files)} />
              <Button onClick={() => handleUpload()} disabled={!productId}>
                <Upload className="mr-2 h-4 w-4" />
                Enviar imagens
              </Button>
            </div>

            {uploadStatuses.length > 0 && (
              <div className="space-y-3">
                {uploadStatuses.map(status => (
                  <div key={status.fileName} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{status.fileName}</span>
                      {status.state === "error" ? (
                        <span className="text-destructive">{status.message}</span>
                      ) : (
                        <span className="text-muted-foreground capitalize">{status.state}</span>
                      )}
                    </div>
                    {status.state !== "error" && <Progress value={status.progress} />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Galeria ({mediaItems.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Carregando mídia...
              </div>
            ) : mediaItems.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhuma imagem cadastrada.</p>
            ) : (
              <div className="space-y-3">
                {orderedMedia.map((media, index) => (
                  <div
                    key={media.id}
                    className="grid gap-4 rounded-lg border p-3 md:grid-cols-[120px,1fr,auto] md:items-center"
                  >
                    <div className="flex items-center justify-center bg-muted rounded-md h-[120px] overflow-hidden">
                      <img src={media.previewUrl} alt={media.alt || "Imagem do produto"} className="h-full w-full object-contain" />
                    </div>
                    <div className="space-y-2">
                      <Label>Legenda</Label>
                      <Input
                        value={media.alt || ""}
                        onChange={event => handleCaptionChange(media.id, event.target.value)}
                        placeholder="Descrição da imagem"
                      />
                      <p className="text-xs text-muted-foreground">Posição: {index + 1}</p>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" disabled={index === 0 || syncing} onClick={() => handleReorder(index, "up")}>
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={index === orderedMedia.length - 1 || syncing}
                          onClick={() => handleReorder(index, "down")}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Separator />
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(media.id)} disabled={syncing}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {syncing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sincronizando com Shopify...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMedia;
