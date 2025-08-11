import axios from 'axios';
const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function fetchScoresSeries({ id, days='30', vs='usd' }){
  const { data } = await axios.get(`${base}/api/scores/series`, { params: { id, days, vs } });
  return data;
}
export async function fetchFactors({ id, days='90' }){
  const { data } = await axios.get(`${base}/api/factors`, { params: { id, days } });
  return data;
}
export async function fetchIndicators({ id, days='90', vs='usd' }){
  const { data } = await axios.get(`${base}/api/indicators`, { params: { id, days, vs } });
  return data;
}
