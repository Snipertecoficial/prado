import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { 
  LayoutDashboard, 
  Package, 
  Images, 
  Settings, 
  LogOut,
  ShoppingBag,
  Upload,
  Cog
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      title: "Gerenciamento de Produtos",
      description: "Adicionar, editar e excluir produtos do catálogo",
      icon: Package,
      path: "/admin/products",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Galeria de Imagens",
      description: "Upload e gerenciamento de imagens de produtos",
      icon: Images,
      path: "/admin/media",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Configurador",
      description: "Configurações do sistema de orçamento",
      icon: Cog,
      path: "/admin/configurator",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Configurações Gerais",
      description: "Ajustar parâmetros globais do sistema",
      icon: Settings,
      path: "/admin/settings",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const stats = [
    {
      title: "Produtos",
      value: "—",
      description: "Total no catálogo",
      icon: ShoppingBag,
      color: "text-blue-600"
    },
    {
      title: "Imagens",
      value: "—",
      description: "Total de mídias",
      icon: Upload,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              <p className="text-muted-foreground">Gerencie produtos, imagens e configurações do sistema</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Menu */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Menu Principal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item, index) => (
              <Card 
                key={index} 
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                onClick={() => navigate(item.path)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bgColor}`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as funções mais utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/admin/products")}>
              <Package className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/media")}>
              <Upload className="mr-2 h-4 w-4" />
              Upload de Imagens
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card className="bg-slate-50 dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plataforma:</span>
              <span className="font-medium">Shopify Admin API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versão da API:</span>
              <span className="font-medium">2024-07</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Framework:</span>
              <span className="font-medium">React + TypeScript + Tailwind CSS</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
