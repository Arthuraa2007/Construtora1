import React from "react";
import type { Imovel } from "../../types/imovel";
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

interface ImoveisTableProps {
  imoveis: Imovel[];
  deletingId: number | null;
  onDelete: (id: number) => void;
  onEdit: (imovel: Imovel) => void;
}

const ImoveisTable: React.FC<ImoveisTableProps> = ({
  imoveis,
  deletingId,
  onDelete,
  onEdit,
}) => {
  const colunas: string[] = [
    "Nome",
    "Endereço",
    "Valor",
    "Descrição",
    "Data de Construção",
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
          {imoveis.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                sx={{ py: 6, color: "text.secondary" }}
              >
                Nenhum imóvel encontrado.
              </TableCell>
            </TableRow>
          ) : (
            imoveis.map((imovel) => (
              <TableRow
                key={imovel.id}
                hover
                sx={{ "&:hover": { bgcolor: "#FFF3E0" } }}
              >
                <TableCell align="center">{imovel.nome}</TableCell>
                <TableCell align="center">{imovel.endereco}</TableCell>
                <TableCell align="center">
                  R$ {imovel.valor.toFixed(2)}
                </TableCell>
                <TableCell align="center">{imovel.descricao || "-"}</TableCell>
                <TableCell align="center">
                  {imovel.dataConstrucao
                    ? imovel.dataConstrucao.split("T")[0]
                    : "-"}
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
                        onClick={() => onEdit(imovel)}
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
                        onClick={() => onDelete(imovel.id)}
                        disabled={deletingId === imovel.id}
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

export default ImoveisTable;
