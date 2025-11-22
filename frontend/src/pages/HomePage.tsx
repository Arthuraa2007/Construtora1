import { Box, Button, Paper, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AVATAR_SIZE = 120;

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box position="relative" minHeight="100vh" width="100vw">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={2} sx={{ p: 3, width: 320 }}>
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
              Construtora
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
    </Box>
  );
};

export default Home;
