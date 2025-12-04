import React from "react";
import type { Paciente } from "../../types/paciente";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
} from "@mui/material";

interface PacientesTableProps {
  pacientes: Paciente[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (paciente: Paciente) => void;
}

const PacientesTable: React.FC<PacientesTableProps> = ({
  pacientes,
  deletingId,
  onDelete,
  onEdit,
}) => {
  const colunas: string[] = [
    "Nome",
    "Email",
    "Telefone",
    "CPF",
    "Data de Nascimento",
    "Ações",
  ];

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
          {pacientes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                sx={{ py: 6, color: "text.secondary" }}
              >
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            pacientes.map((paciente) => (
              <TableRow
                key={paciente.id}
                hover
                sx={{
                  "&:hover": { bgcolor: "#FFF3E0" }, // hover suave em laranja claro
                }}
              >
                <TableCell align="center">{paciente.nome}</TableCell>
                <TableCell align="center">{paciente.email}</TableCell>
                <TableCell align="center">{paciente.telefone || "-"}</TableCell>
                <TableCell align="center">{paciente.cpf}</TableCell>
                <TableCell align="center">
                  {paciente.dataNascimento?.split("T")[0] || "-"}
                </TableCell>
                <TableCell align="center">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column", // botões em coluna
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Tooltip title="Editar">
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: "#FB8C00", // laranja para editar
                          color: "#fff",
                          fontWeight: 600,
                          "&:hover": { bgcolor: "#EF6C00" },
                          width: "90px",
                        }}
                        onClick={() => onEdit(paciente)}
                      >
                        Editar
                      </Button>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: "#E65100", // vermelho-alaranjado para excluir
                          color: "#fff",
                          fontWeight: 600,
                          "&:hover": { bgcolor: "#BF360C" },
                          width: "90px",
                        }}
                        onClick={() => onDelete(paciente.id)}
                        disabled={deletingId === paciente.id}
                      >
                        Excluir
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PacientesTable;
