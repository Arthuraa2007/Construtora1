import { useState, useCallback } from "react";
import type { Imovel } from "../../types/imovel";
import { createImovel } from "../../services/imovelService";
import { validateCreateImovel } from "../../schemas/validation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

interface CriarImovelModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (novoImovel: Imovel) => void;
}

export const CriarImovelModal = ({
  open,
  onClose,
  onSuccess,
}: CriarImovelModalProps) => {
  const INITIAL_FORM_DATA = {
    nome: "",
    endereco: "",
    valor: "",
    descricao: "",
    dataConstrucao: "",
  };

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const handleSave = useCallback(async () => {
    const validation = validateCreateImovel(formData);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setSalvando(true);
    try {
      const novoImovel = await createImovel({
        ...validation.data,
        valor: Number(validation.data.valor),
        descricao: validation.data.descricao || "",
        dataConstrucao: validation.data.dataConstrucao
          ? new Date(validation.data.dataConstrucao)
          : undefined,
      });
      onSuccess(novoImovel);
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Erro ao criar imóvel:", error);
      setErrors({ submit: "Erro ao criar imóvel. Tente novamente." });
    } finally {
      setSalvando(false);
    }
  }, [formData, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
        Cadastrar Novo Imóvel
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Digite o nome do imóvel"
            required
            error={!!errors.nome}
            helperText={errors.nome}
          />

          <TextField
            fullWidth
            label="Endereço"
            name="endereco"
            value={formData.endereco}
            onChange={handleInputChange}
            placeholder="Digite o endereço"
            required
            error={!!errors.endereco}
            helperText={errors.endereco}
          />

          <TextField
            fullWidth
            label="Valor"
            name="valor"
            type="number"
            value={formData.valor}
            onChange={handleInputChange}
            placeholder="Digite o valor"
            required
            error={!!errors.valor}
            helperText={errors.valor}
          />

          <TextField
            fullWidth
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            placeholder="Digite uma descrição (opcional)"
            error={!!errors.descricao}
            helperText={errors.descricao}
          />

          <TextField
            fullWidth
            label="Data de Construção"
            name="dataConstrucao"
            type="date"
            value={formData.dataConstrucao}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.dataConstrucao}
            helperText={errors.dataConstrucao}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={salvando}
        >
          {salvando ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Salvando...
            </>
          ) : (
            "Cadastrar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CriarImovelModal;
