import React, { useState, useCallback } from 'react';

// Chave que será usada para armazenar o estado no localStorage
const REMEMBER_ME_KEY = 'shouldRememberMe';

/**
 * Hook personalizado para gerenciar o estado "Lembrar-me" e o localStorage.
 */
function useRememberMe() {
  // 1. Inicializa o estado lendo do localStorage
  const [isChecked, setIsChecked] = useState<boolean>(() => {
    // Verifica se a chave existe e é 'true' no armazenamento local
    const storedValue = localStorage.getItem(REMEMBER_ME_KEY);
    return storedValue === 'true';
  });

  // 2. Função para alternar (toggle) o estado e atualizar o localStorage
  const handleToggle = useCallback(() => {
    setIsChecked(prev => {
      const newState = !prev;
      if (newState) {
        // Se o usuário marcou, armazena 'true'
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      } else {
        // Se o usuário desmarcou, remove a chave
        localStorage.removeItem(REMEMBER_ME_KEY);
      }
      return newState;
    });
  }, []);

  return { isChecked, handleToggle, REMEMBER_ME_KEY };
}

/**
 * Componente funcional para a opção "Lembrar-me".
 */
const RememberMeCheckbox: React.FC = () => {
  const { isChecked, handleToggle } = useRememberMe();

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
      <input
        type="checkbox"
        id="rememberMe"
        checked={isChecked}
        onChange={handleToggle}
        style={{ marginRight: '8px' }}
      />
      <label htmlFor="rememberMe">
        Lembrar-me (Manter-me conectado)
      </label>
    </div>
  );
};

export default RememberMeCheckbox;