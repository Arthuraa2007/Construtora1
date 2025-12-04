import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { ConsultasTable } from "../components/consultas/ConsultasTable";
import { CriarConsultaModal } from "../components/consultas/CriarConsultaModal";
import { EditarConsultaModal } from "../components/consultas/EditarConsultaModal";
import {
  getConsultas,
  deleteConsulta,
  updateConsulta,
  createConsulta,
} from "../services/consultaService";
import type { Consulta } from "../types/consulta";
import { useDebounce } from "../hooks/useDebounce";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

export const ConsultasPage = () => {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] =
    useState<Consulta | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const carregarConsultas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConsultas();
      setConsultas(data);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
      setSnackbar({
        open: true,
        message: "Erro ao buscar consultas.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarConsultas();
  }, [carregarConsultas]);

  const handleDelete = useCallback(async (id: number) => {
    setDeletingId(id);

    try {
      await deleteConsulta(id);
      setConsultas((prev) => prev.filter((c) => c.id !== id));
      setSnackbar({
        open: true,
        message: "Imóvel removido com sucesso.",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      setSnackbar({
        open: true,
        message: "Erro ao deletar imóvel.",
        severity: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleOpenEditModal = useCallback((consulta: Consulta) => {
    setConsultaSelecionada(consulta);
    setModalEditarOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setConsultaSelecionada(null);
    setModalEditarOpen(false);
  }, []);

  const handleSaveEdit = useCallback(
    async (id: number, dados: Partial<Consulta>) => {
      try {
        await updateConsulta(id, dados);
        await carregarConsultas();
        setSnackbar({
          open: true,
          message: "Imovel atualizado com sucesso.",
          severity: "success",
        });
      } catch (error) {
        console.error("Erro ao atualizar imóvel:", error);
        setSnackbar({
          open: true,
          message: "Erro ao atualizar imóvel.",
          severity: "error",
        });
        throw error;
      }
    },
    [carregarConsultas]
  );

  const handleSucessoCriarConsulta = useCallback(
    async (dados: {
      dataHora: string;
      motivo?: string;
      pacienteId: number;
      medicoId: number;
    }) => {
      try {
        await createConsulta(dados);
        await carregarConsultas();
        setSnackbar({
          open: true,
          message: "Imóvel cadastrado com sucesso.",
          severity: "success",
        });
      } catch (error) {
        console.error("Erro ao criar imóvel:", error);
        setSnackbar({
          open: true,
          message: "Erro ao criar imóvel.",
          severity: "error",
        });
        throw error;
      }
    },
    [carregarConsultas]
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const consultasFiltradas = useMemo(() => {
    let resultado = [...consultas];

    // Filtro de busca por texto
    if (debouncedSearchTerm.trim()) {
      const termoBusca = debouncedSearchTerm.toLowerCase().trim();
      resultado = resultado.filter((consulta) => {
        return (
          consulta.paciente?.nome.toLowerCase().includes(termoBusca) ||
          consulta.paciente?.cpf.includes(termoBusca) ||
          consulta.medico?.nome.toLowerCase().includes(termoBusca) ||
          consulta.medico?.especialidade.toLowerCase().includes(termoBusca) ||
          (consulta.motivo?.toLowerCase().includes(termoBusca) ?? false)
        );
      });
    }

    // Filtro por período de data
    if (filtroData) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      resultado = resultado.filter((consulta) => {
        const dataConsulta = new Date(consulta.dataHora);
        dataConsulta.setHours(0, 0, 0, 0);

        switch (filtroData) {
          case "hoje": {
            return dataConsulta.getTime() === hoje.getTime();
          }
          case "semana": {
            const fimSemana = new Date(hoje);
            fimSemana.setDate(hoje.getDate() + 7);
            return dataConsulta >= hoje && dataConsulta <= fimSemana;
          }
          case "mes": {
            return (
              dataConsulta.getMonth() === hoje.getMonth() &&
              dataConsulta.getFullYear() === hoje.getFullYear()
            );
          }
          case "passadas": {
            return dataConsulta < hoje;
          }
          case "futuras": {
            return dataConsulta > hoje;
          }
          default:
            return true;
        }
      });
    }

    return resultado;
  }, [consultas, debouncedSearchTerm, filtroData]);

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
      maxWidth: 1400,
      p: 3,
      position: "relative",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)", // fundo suave em laranja
      boxShadow: "0px 6px 20px rgba(255, 111, 0, 0.25)",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage:
          "url('https://png.pngtree.com/thumb_back/fw800/background/20240611/pngtree-construction-cranes-and-building-silhouettes-image_15747530.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.85)",
        transform: "scale(1.12)",
        zIndex: -1,
      },
    }}
  >
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

    <Typography
      variant="h5"
      fontWeight={700}
      mb={3}
      textAlign="center"
      sx={{ color: "#E65100" }}
    >
      Gerenciar Imóveis
    </Typography>

    {/* Barra de busca e filtro */}
    <Box
      display="flex"
      gap={2}
      mb={3}
      flexDirection={{ xs: "column", md: "row" }}
    >
      <Box flex={1}>
        <TextField
          fullWidth
          placeholder="Buscar por imóveis..."
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
      </Box>
      <Box width={{ xs: "100%", md: 300 }}>
        <TextField
          select
          fullWidth
          label="Filtrar por período"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": { borderColor: "#FF9800" },
              "&:hover fieldset": { borderColor: "#F57C00" },
              "&.Mui-focused fieldset": { borderColor: "#E65100" },
            },
          }}
        >
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="hoje">Hoje</MenuItem>
          <MenuItem value="semana">Próximos 7 dias</MenuItem>
          <MenuItem value="mes">Este mês</MenuItem>
          <MenuItem value="futuras">Futuras</MenuItem>
          <MenuItem value="passadas">Passadas</MenuItem>
        </TextField>
      </Box>
    </Box>

    {/* Resultados */}
    {(debouncedSearchTerm || filtroData) && (
      <Box mb={2} display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" color="text.secondary">
          Resultados encontrados:
        </Typography>
        <Chip
          label={consultasFiltradas.length}
          size="small"
          sx={{
            bgcolor: "#FFB74D",
            color: "#fff",
            fontWeight: 600,
          }}
        />
        {consultasFiltradas.length !== consultas.length && (
          <Typography variant="body2" color="text.secondary">
            de {consultas.length} total
          </Typography>
        )}
      </Box>
    )}

    {/* Tabela de consultas */}
    <ConsultasTable
      consultas={consultasFiltradas}
      deletingId={deletingId}
      onDelete={handleDelete}
      onEdit={handleOpenEditModal}
      loading={loading}
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
        onClick={() => setModalCriarOpen(true)}
      >
        Cadastrar Novo Imóvel
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

  {/* Modais */}
  <CriarConsultaModal
    open={modalCriarOpen}
    onClose={() => setModalCriarOpen(false)}
    onSave={handleSucessoCriarConsulta}
  />

  <EditarConsultaModal
    open={modalEditarOpen}
    onClose={handleCloseEditModal}
    onSave={handleSaveEdit}
    consulta={consultaSelecionada}
  />
</Box>

  );
};
