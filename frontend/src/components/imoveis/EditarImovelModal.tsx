// src/components/imoveis/EditarImovelModal.tsx
import { useState, useEffect, useCallback } from "react";
import type { Imovel } from "../../types/imovel";
import { updateImovel } from "../../services/imovelService";
import { validateUpdateImovel } from "../../schemas/validation";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, CircularProgress } from "@mui/material";

interface EditarImovelModalProps {
  open: boolean;
  imovel: Imovel | null;
  onClose: () => void;
  onSave: (imovelAtualizado: Imovel) => void;
}

type ImovelForm = {
  nome?: string;
  endereco?: string;
  valor?: string | number;
  descricao?: string;
  dataConstrucao?: string;
};

export const EditarImovelModal = ({ open, imovel, onClose, onSave }: EditarImovelModalProps) => {
  const INITIAL_FORM_DATA: ImovelForm = {
    nome: "",
    endereco: "",
    valor: "",
    descricao: "",
    dataConstrucao: "",
  };

  const [formData, setFormData] = useState<ImovelForm>(INITIAL_FORM_DATA);
  const [salvando, setSalvando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (imovel && open) {
      setFormData({
        nome: imovel.nome,
        endereco: imovel.endereco,
        valor: imovel.valor, // pode ser número ou string; schema irá coerçar
        descricao: imovel.descricao ?? "",
        dataConstrucao: imovel.dataConstrucao ? imovel.dataConstrucao.split("T")[0] : "",
      });
      setErrors({});
    }
  }, [imovel, open]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSave = useCallback(async () => {
    const validation = validateUpdateImovel(formData);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    if (!imovel) return;

    setSalvando(true);
    try {
      // Service recebe dados parciais e ID separado
      const dadosParciais = validation.data;
      await updateImovel(imovel.id, dadosParciais);

      // Merge para retornar Imovel completo ao onSave
      const imovelAtualizado: Imovel = {
        ...imovel,
        ...({
          ...dadosParciais,
          // garantir tipo de valor como number
          valor: typeof dadosParciais.valor === "number" ? dadosParciais.valor : imovel.valor,
          // normalizar data para string (YYYY-MM-DD)
          dataConstrucao:
            typeof dadosParciais.dataConstrucao === "string" && dadosParciais.dataConstrucao.length > 0
              ? `${dadosParciais.dataConstrucao}T00:00:00.000Z`
              : imovel.dataConstrucao,
        } as Partial<Imovel>),
      };

      onSave(imovelAtualizado);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
      setErrors({ submit: "Erro ao salvar imóvel. Tente novamente." });
    } finally {
      setSalvando(false);
    }
  }, [formData, imovel, onSave, onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>Editar Imóvel</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField fullWidth label="Nome" name="nome" value={formData.nome ?? ""} onChange={handleInputChange} error={!!errors.nome} helperText={errors.nome} />
          <TextField fullWidth label="Endereço" name="endereco" value={formData.endereco ?? ""} onChange={handleInputChange} error={!!errors.endereco} helperText={errors.endereco} />
          <TextField fullWidth label="Valor" name="valor" type="number" value={String(formData.valor ?? "")} onChange={handleInputChange} error={!!errors.valor} helperText={errors.valor} />
          <TextField fullWidth label="Descrição" name="descricao" value={formData.descricao ?? ""} onChange={handleInputChange} error={!!errors.descricao} helperText={errors.descricao} />
          <TextField fullWidth label="Data de Construção" name="dataConstrucao" type="date" value={formData.dataConstrucao ?? ""} onChange={handleInputChange} InputLabelProps={{ shrink: true }} error={!!errors.dataConstrucao} helperText={errors.dataConstrucao} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={salvando}>
          {salvando ? (<><CircularProgress size={20} sx={{ mr: 1 }} /> Salvando...</>) : ("Salvar")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarImovelModal;
