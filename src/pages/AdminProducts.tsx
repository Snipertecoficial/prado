import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addProductToCollections,
  AdminCollection,
  AdminProductDetail,
  AdminProductSummary,
  createAdminProduct,
  createProductMedia,
  fetchAdminProductDetail,
  fetchAdminProducts,
  fetchCollections,
  generateImageStagedUpload,
  removeProductFromCollections,
  setMediaMetafield,
  StagedUploadTarget,
  updateAdminProduct,
  updateProductMedia,
} from "@/lib/shopify-admin";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  BookImage,
  Loader2,
  MoveUp,
  MoveDown,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

type MediaItem = { id: string; alt: string | null; previewUrl: string; position: number };
type UploadStatus =
  | { fileName: string; state: "pending" | "staging" | "uploading" | "creating"; progress: number }
  | { fileName: string; state: "error"; message: string };

const emptyProductForm = {
  title: "",
  handle: "",
  descriptionHtml: "",
  vendor: "",
  productType: "",
  tags: "",
  price: "",
  status: "DRAFT",
};

const AdminProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [products, setProducts] = useState<AdminProductSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
  const [productDetail, setProductDetail] = useState<AdminProductDetail | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [optionRows, setOptionRows] = useState<Array<{ name: string; values: string }>>([
    { name: "Tamanho", values: "Único" },
  ]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [syncingMedia, setSyncingMedia] = useState(false);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);

  const orderedMedia = useMemo(() => [...mediaItems].sort((a, b) => a.position - b.position), [mediaItems]);

  // Filter products based on search query and status
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           prod.handle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || prod.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const summaries = await fetchAdminProducts(80);
      setProducts(summaries);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
      toast({
        variant: "destructive",
        title: "Falha ao listar produtos",
        description: "Confirme o token da Admin API e tente novamente.",
      });
    } finally {
      setLoadingProducts(false);
    }
  }, [toast]);

  const loadCollections = useCallback(async () => {
    try {
      const cats = await fetchCollections(80);
      setCollections(cats);
    } catch (error) {
      console.error("Erro ao buscar coleções", error);
      toast({
        variant: "destructive",
        title: "Falha ao carregar categorias",
        description: "Revise as credenciais e tente novamente.",
      });
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
    loadCollections();
  }, [loadCollections, loadProducts]);

  const populateForm = (detail: AdminProductDetail) => {
    setProductForm({
      title: detail.title,
      handle: detail.handle,
      descriptionHtml: detail.descriptionHtml || "",
      vendor: detail.vendor || "",
      productType: detail.productType || "",
      tags: detail.tags?.join(", ") || "",
      price: detail.variants[0]?.price.amount || "",
      status: detail.status,
    });

    setOptionRows(
      detail.options.length
        ? detail.options.map(opt => ({ name: opt.name, values: opt.values.join(", ") }))
        : [{ name: "Tamanho", values: "Único" }],
    );
    setSelectedCollections(detail.collections.map(c => c.id));
    setMediaItems(detail.media);
    setSelectedVariantId(detail.variants[0]?.id);
  };

  const handleSelectProduct = async (productId: string) => {
    try {
      setLoadingDetail(true);
      setSelectedProductId(productId);
      const detail = await fetchAdminProductDetail(productId);
      setProductDetail(detail);
      populateForm(detail);
    } catch (error) {
      console.error("Erro ao carregar produto", error);
      toast({
        variant: "destructive",
        title: "Não foi possível carregar o produto",
        description: "Revise o produto escolhido e o token da Admin API.",
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      setSavingProduct(true);
      const created = await createAdminProduct({
        title: productForm.title,
        handle: productForm.handle || undefined,
        descriptionHtml: productForm.descriptionHtml || undefined,
        vendor: productForm.vendor || undefined,
        productType: productForm.productType || undefined,
        tags: productForm.tags
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean),
        status: productForm.status,
        price: productForm.price || undefined,
        options: optionRows
          .filter(opt => opt.name.trim())
          .map(opt => ({ name: opt.name.trim(), values: opt.values.split(",").map(v => v.trim()).filter(Boolean) })),
      });

      if (created?.id) {
        toast({ title: "Produto criado", description: "Continue configurando imagens e categorias." });
        setSelectedProductId(created.id);
        await loadProducts();
        await handleSelectProduct(created.id);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao criar produto";
      toast({ variant: "destructive", title: "Erro ao criar", description: message });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProductId) return;

    try {
      setSavingProduct(true);
      await updateAdminProduct({
        id: selectedProductId,
        title: productForm.title,
        handle: productForm.handle,
        descriptionHtml: productForm.descriptionHtml,
        vendor: productForm.vendor,
        productType: productForm.productType,
        tags: productForm.tags
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean),
        status: productForm.status,
        price: productForm.price || undefined,
        variantId: selectedVariantId,
        options: optionRows
          .filter(opt => opt.name.trim())
          .map(opt => ({ name: opt.name.trim(), values: opt.values.split(",").map(v => v.trim()).filter(Boolean) })),
      });

      toast({ title: "Produto atualizado" });
      await handleSelectProduct(selectedProductId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao salvar";
      toast({ variant: "destructive", title: "Erro ao salvar", description: message });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleCollectionsSave = async () => {
    if (!selectedProductId || !productDetail) return;

    const current = new Set(productDetail.collections.map(c => c.id));
    const desired = new Set(selectedCollections);

    const toAdd = Array.from(desired).filter(id => !current.has(id));
    const toRemove = Array.from(current).filter(id => !desired.has(id));

    try {
      if (toAdd.length) {
        await addProductToCollections(toAdd, selectedProductId);
      }
      if (toRemove.length) {
        await removeProductFromCollections(toRemove, selectedProductId);
      }
      toast({ title: "Categorias atualizadas" });
      await handleSelectProduct(selectedProductId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao salvar categorias";
      toast({ variant: "destructive", title: "Erro", description: message });
    }
  };

  const syncMediaState = async (items: MediaItem[], mediaIdsToDelete?: string[]) => {
    if (!selectedProductId) return;
    setSyncingMedia(true);
    try {
      const payload = items.map((item, index) => ({ id: item.id, alt: item.alt, position: index + 1 }));
      await updateProductMedia(selectedProductId, payload, mediaIdsToDelete);
      await setMediaMetafield(selectedProductId, payload);
      toast({ title: "Galeria sincronizada" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao sincronizar mídia";
      toast({ variant: "destructive", title: "Erro ao salvar mídia", description: message });
    } finally {
      setSyncingMedia(false);
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

  const handleDeleteMedia = (id: string) => {
    const remaining = mediaItems.filter(item => item.id !== id).map((item, index) => ({ ...item, position: index + 1 }));
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
    if (!selectedProductId) {
      toast({
        variant: "destructive",
        title: "Selecione um produto",
        description: "Crie ou escolha um produto antes de subir imagens.",
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
          prev.map((status, idx) => (idx === index ? { ...status, state: "staging", progress: 10 } : status)),
        );

        const stagedTarget = await generateImageStagedUpload(file);

        setUploadStatuses(prev =>
          prev.map((status, idx) => (idx === index ? { ...status, state: "uploading", progress: 40 } : status)),
        );

        await uploadFileToShopify(file, stagedTarget);

        setUploadStatuses(prev =>
          prev.map((status, idx) => (idx === index ? { ...status, state: "creating", progress: 70 } : status)),
        );

        await createProductMedia(selectedProductId, [
          {
            originalSource: stagedTarget.resourceUrl,
            alt: file.name,
          },
        ]);

        setUploadStatuses(prev =>
          prev.map((status, idx) => (idx === index ? { ...status, state: "creating", progress: 100 } : status)),
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Não foi possível enviar o arquivo.";
        setUploadStatuses(prev =>
          prev.map((status, idx) =>
            idx === index ? { fileName: file.name, state: "error", message: message || "Falha ao subir" } : status,
          ),
        );
        toast({
          variant: "destructive",
          title: "Erro no upload",
          description: message,
        });
      }
    }

    if (selectedProductId) {
      const detail = await fetchAdminProductDetail(selectedProductId);
      setMediaItems(detail.media);
      setProductDetail(detail);
    }
  };

  const renderMediaGallery = () => (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>Galeria do produto</CardTitle>
        <p className="text-sm text-muted-foreground">
          Envie, reordene ou exclua imagens. As legendas são sincronizadas via Admin API.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input ref={fileInputRef} type="file" multiple accept="image/*" onChange={event => handleUpload(event.target.files)} />
          <Button onClick={() => handleUpload()} disabled={!selectedProductId}>
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

        {loadingDetail ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando mídia...
          </div>
        ) : orderedMedia.length === 0 ? (
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
                    <Button variant="outline" size="icon" disabled={index === 0 || syncingMedia} onClick={() => handleReorder(index, "up")}>
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={index === orderedMedia.length - 1 || syncingMedia}
                      onClick={() => handleReorder(index, "down")}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator />
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteMedia(media.id)} disabled={syncingMedia}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {syncingMedia && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Sincronizando com Shopify...
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Button variant="ghost" className="mb-2" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-3">
          <BookImage className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo - Produtos</h1>
            <p className="text-muted-foreground text-sm">
              Crie produtos, defina categorias, opções e gerencie a galeria de imagens.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="space-y-4 xl:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Produtos</CardTitle>
                <Button variant="ghost" size="icon" onClick={loadProducts} disabled={loadingProducts}>
                  {loadingProducts ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Buscar produto</Label>
                  <Input
                    placeholder="Nome ou handle..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Filtrar por status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos</SelectItem>
                      <SelectItem value="ACTIVE">Ativos</SelectItem>
                      <SelectItem value="DRAFT">Rascunhos</SelectItem>
                      <SelectItem value="ARCHIVED">Arquivados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />
                
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Produtos ({filteredProducts.length})
                  </Label>
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 mt-2">
                    {filteredProducts.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum produto encontrado
                      </p>
                    ) : (
                      filteredProducts.map(prod => (
                        <Button
                          key={prod.id}
                          variant={prod.id === selectedProductId ? "secondary" : "outline"}
                          className="w-full justify-between"
                          onClick={() => handleSelectProduct(prod.id)}
                        >
                          <span className="text-left truncate">{prod.title}</span>
                          <Badge variant={prod.status === "ACTIVE" ? "default" : "outline"}>{prod.status}</Badge>
                        </Button>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Novo Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label>Nome</Label>
                <Input value={productForm.title} onChange={e => setProductForm(prev => ({ ...prev, title: e.target.value }))} />

                <Label>Handle (URL)</Label>
                <Input value={productForm.handle} onChange={e => setProductForm(prev => ({ ...prev, handle: e.target.value }))} />

                <Label>Preço do primeiro SKU</Label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                />

                <Label>Status</Label>
                <Select value={productForm.status} onValueChange={value => setProductForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                    <SelectItem value="DRAFT">Rascunho</SelectItem>
                    <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleCreateProduct} disabled={savingProduct || !productForm.title} className="w-full">
                  {savingProduct ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}Criar
                  Produto
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <CardTitle>Dados do produto</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Edite informações gerais, tags, descrição, categorias e opções de cadastro.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={productForm.title}
                      onChange={e => setProductForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título do produto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Handle</Label>
                    <Input
                      value={productForm.handle}
                      onChange={e => setProductForm(prev => ({ ...prev, handle: e.target.value }))}
                      placeholder="ex: meu-produto"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Preço do primeiro SKU</Label>
                    <Input
                      type="number"
                      value={productForm.price}
                      onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="99.90"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fornecedor</Label>
                    <Input
                      value={productForm.vendor}
                      onChange={e => setProductForm(prev => ({ ...prev, vendor: e.target.value }))}
                      placeholder="Marca"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Input
                      value={productForm.productType}
                      onChange={e => setProductForm(prev => ({ ...prev, productType: e.target.value }))}
                      placeholder="Categoria interna"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    value={productForm.tags}
                    onChange={e => setProductForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Ex.: alumínio, perfil"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    rows={4}
                    value={productForm.descriptionHtml}
                    onChange={e => setProductForm(prev => ({ ...prev, descriptionHtml: e.target.value }))}
                    placeholder="Descrição completa (HTML permitido)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={productForm.status}
                      onValueChange={value => setProductForm(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Ativo</SelectItem>
                        <SelectItem value="DRAFT">Rascunho</SelectItem>
                        <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleUpdateProduct}
                      disabled={!selectedProductId || savingProduct}
                      className="gap-2"
                    >
                      {savingProduct ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Salvar alterações
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Categorias</h3>
                      <p className="text-xs text-muted-foreground">Selecione as coleções nas quais o produto deve aparecer.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCollectionsSave} disabled={!selectedProductId}>
                      <Save className="mr-2 h-4 w-4" />Aplicar
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1">
                    {collections.map(collection => {
                      const checked = selectedCollections.includes(collection.id);
                      return (
                        <label key={collection.id} className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={value => {
                              const isChecked = Boolean(value);
                              setSelectedCollections(prev =>
                                isChecked ? [...prev, collection.id] : prev.filter(id => id !== collection.id),
                              );
                            }}
                          />
                          <div>
                            <p className="font-medium leading-tight">{collection.title}</p>
                            <p className="text-xs text-muted-foreground">/{collection.handle}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Opções e variações</h3>
                      <p className="text-xs text-muted-foreground">Configure nomes e valores das opções do produto.</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOptionRows(prev => [...prev, { name: "", values: "" }])}
                    >
                      <Plus className="mr-2 h-4 w-4" />Adicionar opção
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {optionRows.map((opt, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,2fr,auto] gap-3 items-end border rounded-lg p-3">
                        <div className="space-y-2">
                          <Label>Nome</Label>
                          <Input
                            value={opt.name}
                            onChange={e =>
                              setOptionRows(prev => prev.map((row, idx) => (idx === index ? { ...row, name: e.target.value } : row)))
                            }
                            placeholder="Ex.: Cor"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Valores (separados por vírgula)</Label>
                          <Input
                            value={opt.values}
                            onChange={e =>
                              setOptionRows(prev => prev.map((row, idx) => (idx === index ? { ...row, values: e.target.value } : row)))
                            }
                            placeholder="Ex.: Vermelho, Azul"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setOptionRows(prev => prev.filter((_, idx) => idx !== index))}
                            disabled={optionRows.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {renderMediaGallery()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
