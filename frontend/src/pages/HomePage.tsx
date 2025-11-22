import { Box, Button, Paper, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@mui/material/styles";

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

const AVATAR_SIZE = 120;

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
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
    backgroundImage: "url('https://png.pngtree.com/thumb_back/fw800/background/20240611/pngtree-construction-cranes-and-building-silhouettes-image_15747530.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: " brightness(0.85)",
    transform: "scale(1.12)",
    zIndex: 0,
  },
}}
    >
    <Paper
        elevation={2}
        sx={{
          p: 3,
          width: 320,
          zIndex: 1,
          position: "relative",
          overflow: "hidden",
          opacity: 0,
          animation: `${fadeInUp} 0.6s ease-out forwards`,
          animationDelay: "0.2s",
        }}
      >
          <Box textAlign="center" mb={2}>
            <Box display="flex" justifyContent="center" mb={1}>
              <Avatar
                src="https://files.imagetourl.net/uploads/1763825337369-c6fce0dc-2501-4c7b-90dd-fe3677f3703b.png"
                alt="construtora logo"
                sx={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  bgcolor: "transparent",
                 
                }}
                slotProps={{ img: { loading: "lazy" } }}
              />
            </Box>
            <Typography variant="h5" component="h1" fontWeight={600} mb={2}>
              Construtora Inova
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              type="button"
              onClick={() => navigate("/pacientes")}
            >
              Clientes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              type="button"
              onClick={() => navigate("/consultas")}
            >
              Imóveis 
            </Button>
          </Box>
        </Paper>
      </Box>
  );
};

export default Home;
