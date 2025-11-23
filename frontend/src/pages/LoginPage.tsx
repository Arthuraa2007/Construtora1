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
  FormControlLabel, // ⬅️ Novo: Para o Checkbox
  Checkbox, // ⬅️ Novo: Para o Checkbox
  IconButton, // ⬅️ Novo: Para o ícone de olho
  InputAdornment, // ⬅️ Novo: Para o Adorno do input
} from "@mui/material";
import {
  Visibility, // ⬅️ Novo: Ícone
  VisibilityOff, // ⬅️ Novo: Ícone
} from "@mui/icons-material";
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

// Chave para persistência no localStorage
const REMEMBER_ME_KEY = 'rememberMeLogin';

const REDIRECT_DELAY = 2000;

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msgSucesso, setMsgSucesso] = useState<string>("");
  const [msgErro, setMsgErro] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // 1. 🔑 Estado para "Lembrar-me"
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    // Inicializa lendo do localStorage, se existir
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  });

  // 2. 👁️ Estado para a visibilidade da senha
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

  // 3. 🔑 Handler para o Checkbox "Lembrar-me"
  const handleRememberMeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRememberMe(event.target.checked);
    },
    []
  );

  // 4. 👁️ Handler para alternar a visibilidade da senha
  const handleShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
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

      // Lógica de Persistência antes da requisição (opcional, mas bom)
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
        // Você usaria esta informação no backend para gerar um token de longa duração
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
        // Backend geraria um token de curta duração
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
    [formData, navigate, rememberMe] // Adicionar rememberMe às dependências
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
          <HelmetIcon sx={{ fontSize: 40, color: "#FF8C42", mb: 1 }} />
          <Typography variant="h6" component="h2" fontWeight={600} mb={1}>
            Bem-vindo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Faça login para acessar o sistema
          </Typography>
        </Box>
        {msgSucesso && <Alert severity="success" sx={{ mb: 1 }}>{msgSucesso}</Alert>}
        {msgErro && <Alert severity="error" sx={{ mb: 1 }}>{msgErro}</Alert>}
        
        <Box component="form" noValidate onSubmit={handleSubmit}>
          
          {/* Campo Email (sem alterações) */}
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
          />
          
          {/* 👁️ Campo Senha com Toggle de Visibilidade */}
          <TextField
            label="Senha"
            name="senha"
            // 👁️ Alterna o tipo baseado no estado showPassword
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={formData.senha}
            onChange={handleInputChange}
            error={!!errors.senha}
            helperText={errors.senha}
            disabled={isLoading}
            InputProps={{
              // 👁️ Adorno de Input no final (trailing)
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleShowPassword}
                    edge="end"
                    disabled={isLoading}
                  >
                    {/* 👁️ Mostra o ícone apropriado */}
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* 🔑 Checkbox "Lembrar-me" e Link "Esqueceu a senha?" */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
             <FormControlLabel
                control={
                    <Checkbox 
                        checked={rememberMe} 
                        onChange={handleRememberMeChange} 
                        name="rememberMe" 
                        color="primary" 
                        disabled={isLoading}
                    />
                }
                label="Lembrar-me"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
             />
             {/* 💡 Novo: Link "Esqueceu a senha?" */}
             <Typography 
                 component="a" 
                 href="/forgot-password" 
                 variant="body2" 
                 color="primary" 
                 sx={{ textDecoration: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
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
              bgcolor: "#FFB266",
              "&:hover": { bgcolor: "#e6a85a" },
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