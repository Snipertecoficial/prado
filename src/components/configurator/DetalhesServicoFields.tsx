import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipoServico, DetalhesServico } from "@/types/product";

interface DetalhesServicoFieldsProps {
  servico: TipoServico;
  detalhes?: DetalhesServico;
  onChange: (detalhes: DetalhesServico) => void;
}

const DetalhesServicoFields = ({ servico, detalhes = {}, onChange }: DetalhesServicoFieldsProps) => {
  const updateField = (field: keyof DetalhesServico, value: any) => {
    onChange({ ...detalhes, [field]: value });
  };

  // Serviços que requerem distância X mm e face
  if (servico === "furo_chave_allen_xmm_vertical" || servico === "furo_chave_allen_xmm_horizontal") {
    return (
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="space-y-2">
          <Label>Distância da face (mm) *</Label>
          <Input
            type="number"
            value={detalhes.distanciaXMm || ""}
            onChange={(e) => updateField("distanciaXMm", parseInt(e.target.value))}
            placeholder="Informe a distância em mm"
          />
        </div>
        <div className="space-y-2">
          <Label>Face do perfil *</Label>
          <Select
            value={detalhes.face || ""}
            onValueChange={(value) => updateField("face", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a face" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="face_superior">Face Superior</SelectItem>
              <SelectItem value="face_inferior">Face Inferior</SelectItem>
              <SelectItem value="face_lateral_esquerda">Face Lateral Esquerda</SelectItem>
              <SelectItem value="face_lateral_direita">Face Lateral Direita</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  // Serviço de Rosca
  if (servico === "rosca" || servico === "furo_conexao_rosca") {
    return (
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="space-y-2">
          <Label>Tipo de Rosca *</Label>
          <Select
            value={detalhes.tipoRosca || ""}
            onValueChange={(value) => updateField("tipoRosca", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de rosca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M3">M3 (Ø2,5mm)</SelectItem>
              <SelectItem value="M4">M4 (Ø3,3mm)</SelectItem>
              <SelectItem value="M5">M5 (Ø4,6mm)</SelectItem>
              <SelectItem value="M6">M6 (Ø5,0mm)</SelectItem>
              <SelectItem value="M8">M8 (Ø6,8mm)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Compatível com Canal 6 do perfil
          </p>
        </div>
        <div className="space-y-2">
          <Label>Profundidade (mm)</Label>
          <Input
            type="number"
            value={detalhes.profundidade || ""}
            onChange={(e) => updateField("profundidade", parseInt(e.target.value))}
            placeholder="Profundidade da rosca (opcional)"
          />
        </div>
      </div>
    );
  }

  // Serviço de Corte em Ângulo
  if (servico === "corte_angulo") {
    return (
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="space-y-2">
          <Label>Ângulo de Corte (graus) *</Label>
          <Input
            type="number"
            value={detalhes.angulo || ""}
            onChange={(e) => updateField("angulo", parseInt(e.target.value))}
            placeholder="Ex: 45"
            min="1"
            max="89"
          />
          <p className="text-xs text-muted-foreground">
            Ângulo entre 1° e 89°
          </p>
        </div>
        <div className="space-y-2">
          <Label>Extremidade *</Label>
          <Select
            value={detalhes.extremidade || ""}
            onValueChange={(value) => updateField("extremidade", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a extremidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inicio">Início do perfil</SelectItem>
              <SelectItem value="fim">Fim do perfil</SelectItem>
              <SelectItem value="ambas">Ambas as extremidades</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return null;
};

export default DetalhesServicoFields;
