import AsyncStorage from '@react-native-async-storage/async-storage';

export const obterNomeUsuario = async () => {
  try {
    let nome = 'Usuário'; // Valor padrão
    if (typeof window !== 'undefined' && window.localStorage) {
      // Ambiente navegador
      const nomeArmazenado = window.localStorage.getItem('nome_usuario');
      if (nomeArmazenado) {
        nome = nomeArmazenado;
      }
    } else {
      // Ambiente móvel
      const nomeArmazenado = await AsyncStorage.getItem('nome_usuario');
      if (nomeArmazenado) {
        nome = nomeArmazenado;
      }
    }
    return nome;
  } catch (error) {
    console.error('Erro ao recuperar o nome do usuário:', error);
    return 'Usuário'; // Valor padrão em caso de erro
  }
};