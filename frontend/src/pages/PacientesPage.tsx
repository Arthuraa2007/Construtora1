import { useEffect, useState, useCallback, useMemo } from "react";
import type { Paciente } from "../types/paciente";
import { getPacientes, deletePaciente } from "../services/pacienteService";
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
import PacientesTable from "../components/pacientes/PacientesTable";
import EditarPacienteModal from "../components/pacientes/EditarPacienteModal";
import CriarPacienteModal from "../components/pacientes/CriarPacienteModal";
import { useDebounce } from "../hooks/useDebounce";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

export const PacientesPage = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(
    null
  );
  const [abrirModalCriar, setAbrirModalCriar] = useState<boolean>(false);

  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        const data = await getPacientes();
        setPacientes(data);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        setSnackbar({
          open: true,
          message: "Erro ao buscar pacientes.",
          severity: "error",
        });
      }
    };

    carregarPacientes();
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    setDeletingId(id);

    try {
      await deletePaciente(id);
      setPacientes((prev) => prev.filter((p) => p.id !== id));
      setSnackbar({
        open: true,
        message: "Cliente removido com sucesso.",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      setSnackbar({
        open: true,
        message: "Erro ao deletar cliente.",
        severity: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleOpenEditModal = useCallback((paciente: Paciente) => {
    setPacienteEditando(paciente);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setPacienteEditando(null);
  }, []);

  const handleSavePaciente = useCallback((pacienteAtualizado: Paciente) => {
    setPacientes((prev) =>
      prev.map((p) => (p.id === pacienteAtualizado.id ? pacienteAtualizado : p))
    );
    setSnackbar({
      open: true,
      message: "Cliente atualizado com sucesso.",
      severity: "success",
    });
  }, []);

  const handleSucessoCriarPaciente = useCallback((novoPaciente: Paciente) => {
    setPacientes((prev) => [...prev, novoPaciente]);
    setSnackbar({
      open: true,
      message: "Cliente cadastrado com sucesso.",
      severity: "success",
    });
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const pacientesFiltrados = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return pacientes;

    const termoBusca = debouncedSearchTerm.toLowerCase().trim();

    return pacientes.filter((paciente) => {
      return (
        paciente.nome.toLowerCase().includes(termoBusca) ||
        paciente.email.toLowerCase().includes(termoBusca) ||
        paciente.cpf.includes(termoBusca) ||
        (paciente.telefone?.includes(termoBusca) ?? false)
      );
    });
  }, [pacientes, debouncedSearchTerm]);

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
    Lista de Clientes
  </Typography>

  {/* Campo de busca estilizado */}
  <TextField
    fullWidth
    placeholder="Buscar por nome, email, CPF ou telefone..."
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
        label={pacientesFiltrados.length}
        size="small"
        sx={{
          bgcolor: "#FFB74D",
          color: "#fff",
          fontWeight: 600,
        }}
      />
      {pacientesFiltrados.length !== pacientes.length && (
        <Typography variant="body2" color="text.secondary">
          de {pacientes.length} total
        </Typography>
      )}
    </Box>
  )}

  {/* Tabela estilizada */}
  <PacientesTable
    pacientes={pacientesFiltrados}
    deletingId={deletingId}
    onDelete={handleDelete}
    onEdit={handleOpenEditModal}
    sx={{
    "& thead": {
      bgcolor: "#FF9800",
    },
    "& thead th": {
      color: "#fff",
      fontWeight: 600,
    },
    "& tbody tr:hover": {
      bgcolor: "#FFF3E0",
    },
  }}
  />

  {/* Botão Novo Cliente */}
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
      Novo Cliente
    </Button>
  </Box>

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

      <EditarPacienteModal
        open={pacienteEditando !== null}
        paciente={pacienteEditando}
        onClose={handleCloseEditModal}
        onSave={handleSavePaciente}
      />

      <CriarPacienteModal
        open={abrirModalCriar}
        onClose={() => setAbrirModalCriar(false)}
        onSuccess={handleSucessoCriarPaciente}
      />
    </Box>
  );
};

export default PacientesPage;