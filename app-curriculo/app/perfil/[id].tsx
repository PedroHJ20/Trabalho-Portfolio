import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import api from '../../services/api';

export default function PerfilCompleto() {
  const { id } = useLocalSearchParams();
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompleto() {
      try {
        const response = await api.get(`/pessoas/${id}/completo`);
        setDados(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompleto();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f95dc" />
      </View>
    );
  }

  if (!dados) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar o currículo.</Text>
      </View>
    );
  }

  const pessoaInfo = dados.nome ? dados : (dados['0'] || {});

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Currículo Completo' }} />

      <View style={styles.header}>
        <Text style={styles.nome}>{pessoaInfo.nome || 'Nome não encontrado'}</Text>
        <Text style={styles.resumo}>{pessoaInfo.resumo_perfil || 'Nenhum resumo disponível.'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Experiências Profissionais</Text>
      {dados.experiencias_profissionais && dados.experiencias_profissionais.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma experiência cadastrada.</Text>
      ) : null}
      
      {dados.experiencias_profissionais && dados.experiencias_profissionais.map((exp: any) => (
        <View key={exp.id} style={styles.itemCard}>
          <Text style={styles.itemTitle}>{exp.cargo}</Text>
          <Text style={styles.itemDesc}>{exp.empresa}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
      {dados.experiencias_academicas && dados.experiencias_academicas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma formação cadastrada.</Text>
      ) : null}
      
      {dados.experiencias_academicas && dados.experiencias_academicas.map((acad: any) => (
        <View key={acad.id} style={styles.itemCard}>
          <Text style={styles.itemTitle}>{acad.curso}</Text>
          <Text style={styles.itemDate}>{acad.instituicao}</Text>
          <Text style={styles.itemDesc}>{acad.periodo}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Projetos</Text>
      {dados.projetos && dados.projetos.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum projeto cadastrado.</Text>
      ) : null}
      
      {dados.projetos && dados.projetos.map((proj: any) => {
        // Agora verifica pelo titulo correto do banco de dados
        if (!proj.titulo) return null; 
        
        return (
          <View key={proj.id} style={styles.itemCard}>
            <Text style={styles.itemTitle}>{proj.titulo}</Text>
            <Text style={styles.itemDesc}>{proj.tecnologias}</Text>
          </View>
        );
      })}
      
      <View style={styles.footerSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#2f95dc', marginBottom: 10, textAlign: 'center' },
  resumo: { fontSize: 16, color: '#444', textAlign: 'center', lineHeight: 22 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 5 },
  itemCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#2f95dc' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemDate: { fontSize: 14, color: '#888', marginTop: 2, marginBottom: 5 },
  itemDesc: { fontSize: 14, color: '#555' },
  emptyText: { fontSize: 14, color: '#888', fontStyle: 'italic', marginBottom: 15 },
  footerSpace: { height: 50 }
});