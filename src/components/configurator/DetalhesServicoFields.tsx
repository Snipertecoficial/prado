import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

  // Não mostrar nada se for "sem_servico"
  if (servico === "sem_servico") {
    return null;
  }

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="space-y-2">
        <Label>Detalhes</Label>
        <Select
          value={detalhes.tipoDetalhe || ""}
          onValueChange={(value) => updateField("tipoDetalhe", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="S/ Serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s_servico">S/ Serviço</SelectItem>
            <SelectItem value="furo_uma_extremidade">Furo em uma extremidade</SelectItem>
            <SelectItem value="furo_duas_extremidades">Furo nas duas extremidades</SelectItem>
            <SelectItem value="face_superior">Face Superior</SelectItem>
            <SelectItem value="face_inferior">Face Inferior</SelectItem>
            <SelectItem value="face_lateral_esquerda">Face Lateral Esquerda</SelectItem>
            <SelectItem value="face_lateral_direita">Face Lateral Direita</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="texto-detalhes">Informe os detalhes *</Label>
        <Textarea
          id="texto-detalhes"
          value={detalhes.textoDetalhes || ""}
          onChange={(e) => updateField("textoDetalhes", e.target.value)}
          placeholder="Descreva em que lado é o corte, posição dos furos (X mm da extremidade), quantidade de furos/roscas, etc."
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Campo obrigatório para serviços de usinagem
        </p>
      </div>
    </div>
  );
};

export default DetalhesServicoFields;
