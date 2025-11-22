import { useEffect, useState, useCallback, useMemo } from "react";
import type { Paciente } from "../types/pacientes";
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
import PacientesTable from "../components/pacientes/ClienteTable";
import EditarPacienteModal from "../components/pacientes/EditarClienteModal";
import CriarPacienteModal from "../components/pacientes/CriarClienteModal";
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
  const [abrirModalCriar, setAbrirModalCriar] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(
    null
  );

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  // ============================
  // Carregar lista inicial
  // ============================
  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        const data = await getPacientes();
        setPacientes(data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        abrirSnackbar("Erro ao buscar clientes.", "error");
      }
    };

    carregarPacientes();
  }, []);

  // ============================
  // Snackbar Helper
  // ============================
  const abrirSnackbar = (
    message: string,
    severity: SnackbarState["severity"]
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  // ============================
  // Deletar Paciente
  // ============================
  const handleDelete = useCallback(async (id: number) => {
    setDeletingId(id);

    try {
      await deletePaciente(id);
      setPacientes((prev) => prev.filter((p) => p.id !== id));
      abrirSnackbar("Cliente removido com sucesso.", "success");
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      abrirSnackbar("Erro ao deletar cliente.", "error");
    } finally {
      setDeletingId(null);
    }
  }, []);

  // ============================
  // Editar Paciente
  // ============================
  const handleOpenEditModal = useCallback(
    (paciente: Paciente) => setPacienteEditando(paciente),
    []
  );
  const handleCloseEditModal = useCallback(
    () => setPacienteEditando(null),
    []
  );

  const handleSavePaciente = useCallback(
    (pacienteAtualizado: Paciente) => {
      setPacientes((prev) =>
        prev.map((p) => (p.id === pacienteAtualizado.id ? pacienteAtualizado : p))
      );
      abrirSnackbar("Cliente atualizado com sucesso.", "success");
    },
    []
  );

  // ============================
  // Criar Paciente
  // ============================
  const handleSucessoCriarPaciente = useCallback(
    (novoPaciente: Paciente) => {
      setPacientes((prev) => [...prev, novoPaciente]);
      abrirSnackbar("Cliente cadastrado com sucesso.", "success");
    },
    []
  );

  // ============================
  // Busca com debounce
  // ============================
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const pacientesFiltrados = useMemo(() => {
    const termo = debouncedSearchTerm.toLowerCase().trim();
    if (!termo) return pacientes;

    return pacientes.filter((p) => {
      const nome = p.nome?.toLowerCase() ?? "";
      const email = p.email?.toLowerCase() ?? "";
      const cpf = p.cpf?.toLowerCase() ?? "";
      const telefone = p.telefone ?? "";

      return (
        nome.includes(termo) ||
        email.includes(termo) ||
        cpf.includes(termo) ||
        telefone.includes(termo)
      );
    });
  }, [pacientes, debouncedSearchTerm]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" p={3}>
      <Paper
        elevation={3}
        sx={(theme) => ({
          width: "100%",
          maxWidth: 1000,
          p: 3,
          position: "relative",
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 2,
        })}
      >
        <IconButton
          onClick={() => navigate("/home")}
          sx={{ position: "absolute", left: 16, top: 16 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
          Lista de Clientes
        </Typography>

        {/* Campo de Busca */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Buscar por nome, email, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          {debouncedSearchTerm && (
            <Box mt={1} display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" color="text.secondary">
                Resultados encontrados:
              </Typography>
              <Chip
                label={pacientesFiltrados.length}
                size="small"
                color="primary"
                variant="outlined"
              />
              {pacientesFiltrados.length !== pacientes.length && (
                <Typography variant="body2" color="text.secondary">
                  de {pacientes.length} total
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Tabela */}
        <PacientesTable
          pacientes={pacientesFiltrados}
          deletingId={deletingId}
          onDelete={handleDelete}
          onEdit={handleOpenEditModal}
        />

        {/* Botão Novo Cliente */}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={() => setAbrirModalCriar(true)}>
            Novo Cliente
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
            severity={snackbar.severity}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>

      {/* Modais */}
      <EditarPacienteModal
        open={!!pacienteEditando}
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
