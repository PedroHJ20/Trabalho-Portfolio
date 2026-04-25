import axios from 'axios';

const api = axios.create({
  // Cole aqui o seu link real do Vercel (sem a barra / no final)
  baseURL: 'https://trabalho-portfolio-one.vercel.app' 
});

export default api;