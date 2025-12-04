import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/material/styles";
import GroupIcon from "@mui/icons-material/Group";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AddBusinessIcon from "@mui/icons-material/AddBusiness"; // ícone para cadastro de imóveis

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ICON_SIZE = 120;

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"
      sx={{
        position: "relative",
        overflow: "hidden",
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
          zIndex: 0,
        },
      }}
    >
      <Paper elevation={4}
        sx={{
          p: 3,
          width: 340,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
          backdropFilter: "blur(6px)",
          boxShadow: "0px 6px 20px rgba(255, 111, 0, 0.25)",
          opacity: 0,
          animation: `${fadeInUp} 0.6s ease-out forwards`,
          animationDelay: "0.2s",
          zIndex: 1,
        }}
      >
        <Box textAlign="center" mb={2}>
          <EngineeringIcon sx={{ fontSize: ICON_SIZE, color: "#FF6F00", mb: 1 }} />
          <Typography variant="h5" component="h1" fontWeight={600} mb={2} sx={{ color: "#E65100" }}>
            Construtora Inova
          </Typography>

          {/* Botão Clientes */}
          <Button
            variant="contained"
            fullWidth
            startIcon={<GroupIcon sx={{ fontSize: 40 }} />}
            sx={{
              mb: 2,
              bgcolor: "linear-gradient(135deg, #FF6F00 0%, #FF8F00 100%)",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "8px",
            }}
            onClick={() => navigate("/pacientes")}
          >
            Clientes
          </Button>

          {/* Botão Imóveis */}
          <Button
            variant="contained"
            fullWidth
            startIcon={<HomeWorkIcon sx={{ fontSize: 40 }} />}
            sx={{
              mb: 2,
              bgcolor: "linear-gradient(135deg, #FFA726 0%, #FB8C00 100%)",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "8px",
            }}
            onClick={() => navigate("/consultas")}
          >
            Imóveis para os Clientes
          </Button>

          {/* Novo Botão Cadastro de Imóveis */}
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddBusinessIcon sx={{ fontSize: 40 }} />}
            sx={{
              bgcolor: "linear-gradient(135deg, #FF7043 0%, #FF8A65 100%)",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "8px",
            }}
            onClick={() => navigate("/cadastro-imoveis")}
          >
            Cadastro de Imóveis
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
