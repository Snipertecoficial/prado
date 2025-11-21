import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw,
  Shield,
  Database,
  Mail,
  Globe
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Prado Store",
    siteDescription: "Loja de produtos em alumínio",
    contactEmail: "contato@prado.com.br",
    supportEmail: "suporte@prado.com.br",
    
    // Shopify Settings
    shopifyDomain: import.meta.env.VITE_SHOPIFY_DOMAIN || "",
    shopifyApiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION || "2024-07",
    
    // Feature Flags
    enableProductReviews: false,
    enableWishlist: false,
    enableNewsletter: true,
    maintenanceMode: false,
    
    // Business Settings
    businessName: "Prado Indústria e Comércio",
    businessAddress: "",
    businessPhone: "",
    businessTaxId: "",
    
    // SEO Settings
    metaTitle: "Prado - Produtos em Alumínio",
    metaDescription: "Sua loja de confiança para produtos em alumínio de alta qualidade",
    metaKeywords: "alumínio, perfis, estruturas, indústria",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real implementation, this would save to a backend API
      // For now, we'll just save to localStorage as a demo
      localStorage.setItem("admin-settings", JSON.stringify(settings));
      
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const stored = localStorage.getItem("admin-settings");
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
        toast({
          title: "Configurações restauradas",
          description: "As configurações foram restauradas para os valores salvos.",
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Button variant="ghost" className="mb-2" onClick={() => navigate("/admin/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Configurações Gerais</h1>
            <p className="text-muted-foreground">Ajuste os parâmetros globais do sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="xl:col-span-2 space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle>Configurações Gerais</CardTitle>
                </div>
                <CardDescription>
                  Informações básicas do site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                    placeholder="Nome do seu site"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descrição do Site</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleChange("siteDescription", e.target.value)}
                    placeholder="Breve descrição do seu site"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>Informações Empresariais</CardTitle>
                </div>
                <CardDescription>
                  Dados da empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Razão Social</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    placeholder="Nome da empresa"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Telefone</Label>
                    <Input
                      id="businessPhone"
                      value={settings.businessPhone}
                      onChange={(e) => handleChange("businessPhone", e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessTaxId">CNPJ</Label>
                    <Input
                      id="businessTaxId"
                      value={settings.businessTaxId}
                      onChange={(e) => handleChange("businessTaxId", e.target.value)}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Endereço</Label>
                  <Textarea
                    id="businessAddress"
                    value={settings.businessAddress}
                    onChange={(e) => handleChange("businessAddress", e.target.value)}
                    placeholder="Endereço completo da empresa"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle>Configurações de E-mail</CardTitle>
                </div>
                <CardDescription>
                  E-mails de contato e suporte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">E-mail de Contato</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                      placeholder="contato@exemplo.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">E-mail de Suporte</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleChange("supportEmail", e.target.value)}
                      placeholder="suporte@exemplo.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações de SEO</CardTitle>
                <CardDescription>
                  Meta tags para otimização de buscas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Título</Label>
                  <Input
                    id="metaTitle"
                    value={settings.metaTitle}
                    onChange={(e) => handleChange("metaTitle", e.target.value)}
                    placeholder="Título para motores de busca"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Descrição</Label>
                  <Textarea
                    id="metaDescription"
                    value={settings.metaDescription}
                    onChange={(e) => handleChange("metaDescription", e.target.value)}
                    placeholder="Descrição para motores de busca"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Palavras-chave</Label>
                  <Input
                    id="metaKeywords"
                    value={settings.metaKeywords}
                    onChange={(e) => handleChange("metaKeywords", e.target.value)}
                    placeholder="palavra1, palavra2, palavra3"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shopify Integration */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Integração Shopify</CardTitle>
                </div>
                <CardDescription>
                  Configurações da API Shopify
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shopifyDomain">Domínio Shopify</Label>
                  <Input
                    id="shopifyDomain"
                    value={settings.shopifyDomain}
                    onChange={(e) => handleChange("shopifyDomain", e.target.value)}
                    placeholder="loja.myshopify.com"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Configure via variáveis de ambiente
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shopifyApiVersion">Versão da API</Label>
                  <Input
                    id="shopifyApiVersion"
                    value={settings.shopifyApiVersion}
                    onChange={(e) => handleChange("shopifyApiVersion", e.target.value)}
                    placeholder="2024-07"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Configure via variáveis de ambiente
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature Flags */}
            <Card>
              <CardHeader>
                <CardTitle>Recursos</CardTitle>
                <CardDescription>
                  Ativar ou desativar funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableProductReviews">Avaliações de Produtos</Label>
                    <p className="text-xs text-muted-foreground">
                      Permitir avaliações nos produtos
                    </p>
                  </div>
                  <Switch
                    id="enableProductReviews"
                    checked={settings.enableProductReviews}
                    onCheckedChange={(checked) => handleChange("enableProductReviews", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableWishlist">Lista de Desejos</Label>
                    <p className="text-xs text-muted-foreground">
                      Permitir salvar produtos favoritos
                    </p>
                  </div>
                  <Switch
                    id="enableWishlist"
                    checked={settings.enableWishlist}
                    onCheckedChange={(checked) => handleChange("enableWishlist", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableNewsletter">Newsletter</Label>
                    <p className="text-xs text-muted-foreground">
                      Exibir formulário de newsletter
                    </p>
                  </div>
                  <Switch
                    id="enableNewsletter"
                    checked={settings.enableNewsletter}
                    onCheckedChange={(checked) => handleChange("enableNewsletter", checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode">Modo Manutenção</Label>
                    <p className="text-xs text-muted-foreground">
                      Ativar tela de manutenção
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Configurações
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={handleReset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restaurar Valores
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
