import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  CircularProgress,
  Box,
} from "@mui/material";
import type { Consulta } from "../../types/consulta";

interface ConsultasTableProps {
  consultas: Consulta[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (consulta: Consulta) => void;
  loading: boolean;
}

export const ConsultasTable = ({
  consultas,
  deletingId,
  onDelete,
  onEdit,
  loading,
}: ConsultasTableProps) => {
  const formatarDataHora = (dataHora: string) => {
    const date = new Date(dataHora);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const colunas: string[] = [
    "Data de Construção",
    "Cliente",
    "CPF",
    "Atendente",
    "Cargo",
    "Imóvel",
    "Ações",
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        mt: 4,
        borderRadius: "12px",
        boxShadow: "0px 6px 20px rgba(255, 111, 0, 0.25)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#FF9800" }}>
            {colunas.map((coluna) => (
              <TableCell
                key={coluna}
                align="center"
                sx={{ color: "#fff", fontWeight: 600 }}
              >
                {coluna}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {consultas.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                align="center"
                sx={{ py: 6, color: "text.secondary" }}
              >
                Nenhum Imóvel encontrado.
              </TableCell>
            </TableRow>
          ) : (
            consultas.map((consulta) => (
              <TableRow
  key={consulta.id}
  hover
  sx={{ "&:hover": { bgcolor: "#FFF3E0" } }}
>
  <TableCell align="center">
    {formatarDataHora(consulta.dataHora)}
  </TableCell>
  <TableCell align="center">
    {consulta.paciente?.nome || "-"}
  </TableCell>
  <TableCell align="center">
    {consulta.paciente?.cpf || "-"}
  </TableCell>
  <TableCell align="center">
    {consulta.medico?.nome || "-"}
  </TableCell>
  <TableCell align="center">
    {consulta.medico?.especialidade || "-"}
  </TableCell>
  <TableCell align="center">
    {consulta.imovel
      ? `${consulta.imovel.nome} - ${consulta.imovel.endereco}`
      : "-"}
  </TableCell>
  <TableCell align="center">
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // botões em coluna
        alignItems: "center",
        gap: 1,
      }}
    >
      <Tooltip title="Editar">
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#FB8C00",
            color: "#fff",
            fontWeight: 600,
            "&:hover": { bgcolor: "#EF6C00" },
            width: "90px",
          }}
          onClick={() => onEdit(consulta)}
        >
          Editar
        </Button>
      </Tooltip>
      <Tooltip title="Excluir">
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: "#E65100",
            color: "#fff",
            fontWeight: 600,
            "&:hover": { bgcolor: "#BF360C" },
            width: "90px",
          }}
          onClick={() => onDelete(consulta.id)}
          disabled={deletingId === consulta.id}
        >
          Excluir
        </Button>
      </Tooltip>
    </Box>
  </TableCell>
</TableRow>

            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
