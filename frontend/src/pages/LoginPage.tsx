import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { validateLogin } from "../schemas/validation";
import type { Secretario } from "../types/secretario";
import { login } from "../services/loginService";
import HelmetIcon from "../components/HelmetIcon";
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

const REMEMBER_ME_KEY = "rememberMeLogin";
const REDIRECT_DELAY = 2000;

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msgSucesso, setMsgSucesso] = useState<string>("");
  const [msgErro, setMsgErro] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem(REMEMBER_ME_KEY) === "true";
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      setMsgErro("");
    },
    []
  );

  const handleRememberMeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRememberMe(event.target.checked);
    },
    []
  );

  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validation = validateLogin(formData);

      if (!validation.success) {
        setErrors(validation.errors);
        return;
      }

      setIsLoading(true);
      setMsgErro("");
      setMsgSucesso("");

      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, "true");
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }

      try {
        const secretario: Secretario = await login(
          formData.email,
          formData.senha
        );
        setMsgSucesso(`Bem-vindo(a), ${secretario.nome}!`);

        setTimeout(() => {
          navigate("/home");
        }, REDIRECT_DELAY);
      } catch (error) {
        console.error("Erro no login:", error);
        setMsgErro("Erro ao realizar login. Verifique suas credenciais.");
      } finally {
        setIsLoading(false);
      }
    },
    [formData, navigate, rememberMe]
  );

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
      <Paper
        elevation={4}
        sx={{
          p: 3,
          width: 340,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)", // fundo em tons suaves de laranja
          backdropFilter: "blur(6px)",
          boxShadow: "0px 6px 20px rgba(255, 111, 0, 0.25)",
          opacity: 0,
          animation: `${fadeInUp} 0.6s ease-out forwards`,
          animationDelay: "0.2s",
          zIndex: 1,
        }}
      >
        <Box textAlign="center" mb={2}>
          <HelmetIcon sx={{ fontSize: 48, color: "#FF6F00", mb: 1 }} />
          <Typography variant="h6" component="h2" fontWeight={600} mb={1}>
            Bem-vindo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Faça login para acessar o sistema
          </Typography>
        </Box>

        {msgSucesso && (
          <Alert severity="success" sx={{ mb: 1, bgcolor: "#FFE0B2", color: "#E65100" }}>
            {msgSucesso}
          </Alert>
        )}
        {msgErro && (
          <Alert severity="error" sx={{ mb: 1, bgcolor: "#FFCCBC", color: "#BF360C" }}>
            {msgErro}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#FF9800" },
                "&:hover fieldset": { borderColor: "#F57C00" },
                "&.Mui-focused fieldset": { borderColor: "#E65100" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#E65100" },
            }}
          />

          <TextField
            label="Senha"
            name="senha"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={formData.senha}
            onChange={handleInputChange}
            error={!!errors.senha}
            helperText={errors.senha}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleShowPassword}
                    edge="end"
                    disabled={isLoading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#FF9800" },
                "&:hover fieldset": { borderColor: "#F57C00" },
                "&.Mui-focused fieldset": { borderColor: "#E65100" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#E65100" },
            }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  name="rememberMe"
                  sx={{
                    color: "#FF9800",
                    "&.Mui-checked": { color: "#E65100" },
                  }}
                  disabled={isLoading}
                />
              }
              label="Lembrar-me"
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
            />

            <Typography
              component="a"
              href="/forgot-password"
              variant="body2"
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#FF6F00",
                "&:hover": { textDecoration: "underline", color: "#E65100" },
              }}
            >
              Esqueceu a senha?
            </Typography>
          </Box>

                    <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
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
            disabled={isLoading}
          >
            {isLoading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                <span>Entrando...</span>
              </Box>
            ) : (
              "Entrar"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
