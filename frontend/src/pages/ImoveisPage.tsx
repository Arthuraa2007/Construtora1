import { useEffect, useState, useCallback, useMemo } from "react";
import type { Imovel } from "../types/imovel";
import { getImoveis, deleteImovel } from "../services/imovelService";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import ImoveisTable from "../components/imoveis/ImoveisTable";
import EditarImovelModal from "../components/imoveis/EditarImovelModal";
import CriarImovelModal from "../components/imoveis/CriarImovelModal";
import { useDebounce } from "../hooks/useDebounce";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

export const ImoveisPage = () => {
  const navigate = useNavigate();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });
  const [imovelEditando, setImovelEditando] = useState<Imovel | null>(null);
  const [abrirModalCriar, setAbrirModalCriar] = useState<boolean>(false);

  useEffect(() => {
    const carregarImoveis = async () => {
      try {
        const data = await getImoveis();
        setImoveis(data);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
        setSnackbar({
          open: true,
          message: "Erro ao buscar imóveis.",
          severity: "error",
        });
      }
    };

    carregarImoveis();
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    setDeletingId(id);

    try {
      await deleteImovel(id);
      setImoveis((prev) => prev.filter((i) => i.id !== id));
      setSnackbar({
        open: true,
        message: "Imóvel removido com sucesso.",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao deletar imóvel:", error);
      setSnackbar({
        open: true,
        message: "Erro ao deletar imóvel.",
        severity: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleOpenEditModal = useCallback((imovel: Imovel) => {
    setImovelEditando(imovel);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setImovelEditando(null);
  }, []);

  const handleSaveImovel = useCallback((imovelAtualizado: Imovel) => {
    setImoveis((prev) =>
      prev.map((i) => (i.id === imovelAtualizado.id ? imovelAtualizado : i))
    );
    setSnackbar({
      open: true,
      message: "Imóvel atualizado com sucesso.",
      severity: "success",
    });
  }, []);

  const handleSucessoCriarImovel = useCallback((novoImovel: Imovel) => {
    setImoveis((prev) => [...prev, novoImovel]);
    setSnackbar({
      open: true,
      message: "Imóvel cadastrado com sucesso.",
      severity: "success",
    });
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const imoveisFiltrados = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return imoveis;

    const termoBusca = debouncedSearchTerm.toLowerCase().trim();

    return imoveis.filter((imovel) => {
      return (
        imovel.nome.toLowerCase().includes(termoBusca) ||
        imovel.endereco.toLowerCase().includes(termoBusca) ||
        String(imovel.valor).includes(termoBusca)
      );
    });
  }, [imoveis, debouncedSearchTerm]);

  return (
    <Box
  display="flex"
  flexDirection="column"
  alignItems="center"
  minHeight="100vh"
  bgcolor="background.default"
  p={3}
>
  <Paper
    elevation={4}
    sx={{
      width: "100%",
      maxWidth: 1000,
      p: 3,
      position: "relative",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)", // fundo suave em laranja
      boxShadow: "0px 6px 20px rgba(255, 111, 0, 0.25)",
    }}
  >
    {/* Botão voltar */}
    <IconButton
      aria-label="voltar"
      onClick={() => navigate("/home")}
      size="small"
      sx={{
        position: "absolute",
        left: 16,
        top: 16,
        color: "#E65100",
        "&:hover": { bgcolor: "#FFE0B2" },
      }}
    >
      <ArrowBackIcon fontSize="small" />
    </IconButton>

    {/* Título */}
    <Typography
      variant="h5"
      fontWeight={700}
      mb={3}
      textAlign="center"
      sx={{ color: "#E65100" }}
    >
      Lista de Imóveis
    </Typography>

    {/* Campo de busca */}
    <TextField
      fullWidth
      placeholder="Buscar por nome, endereço ou valor..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "#FF6F00" }} />
          </InputAdornment>
        ),
      }}
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          "& fieldset": { borderColor: "#FF9800" },
          "&:hover fieldset": { borderColor: "#F57C00" },
          "&.Mui-focused fieldset": { borderColor: "#E65100" },
        },
      }}
    />

    {/* Chip de resultados */}
    {debouncedSearchTerm && (
      <Box mt={1} display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" color="text.secondary">
          Resultados encontrados:
        </Typography>
        <Chip
          label={imoveisFiltrados.length}
          size="small"
          sx={{
            bgcolor: "#FFB74D",
            color: "#fff",
            fontWeight: 600,
          }}
        />
        {imoveisFiltrados.length !== imoveis.length && (
          <Typography variant="body2" color="text.secondary">
            de {imoveis.length} total
          </Typography>
        )}
      </Box>
    )}

    {/* Tabela estilizada */}
   <ImoveisTable
  imoveis={imoveisFiltrados}
  deletingId={deletingId}
  onDelete={handleDelete}
  onEdit={handleOpenEditModal}
/>
    {/* Botão Novo Imóvel */}
    <Box mt={3} display="flex" justifyContent="flex-end">
      <Button
        variant="contained"
        sx={{
          bgcolor: "linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%)",
          color: "#fff",
          fontWeight: 600,
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(255, 111, 0, 0.4)",
          "&:hover": {
            bgcolor: "linear-gradient(135deg, #E65100 0%, #F57C00 100%)",
            boxShadow: "0px 6px 16px rgba(255, 111, 0, 0.6)",
          },
        }}
        onClick={() => setAbrirModalCriar(true)}
      >
        Novo Imóvel
      </Button>
    </Box>

    {/* Snackbar */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        severity={snackbar.severity}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Paper>

  {/* Modal de edição */}
  <EditarImovelModal
    open={imovelEditando !== null}
    imovel={imovelEditando}
    onClose={handleCloseEditModal}
    onSave={handleSaveImovel}
  />

  {/* Modal de criação */}
  <CriarImovelModal
    open={abrirModalCriar}
    onClose={() => setAbrirModalCriar(false)}
    onSuccess={handleSucessoCriarImovel}
  />
</Box>

  );
};

export default ImoveisPage;
