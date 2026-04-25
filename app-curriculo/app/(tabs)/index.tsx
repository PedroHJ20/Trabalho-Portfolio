import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';
import api from '../../services/api';

export default function TabOneScreen() {
  // O <any[]> avisa o TypeScript que essa lista vai receber dados variados
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter(); 

  useEffect(() => {
    async function fetchPessoas() {
      try {
        const response = await api.get('/pessoas');
        setPessoas(response.data);
      } catch (error) {
        console.error("Erro ao buscar pessoas da API:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPessoas();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2f95dc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Candidatos</Text>
      
      <FlatList
        data={pessoas}
        keyExtractor={(item) => item.id.toString()}
        // O { item: any } silencia o erro do parâmetro
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity 
            style={styles.card}
            // O "as Href" resolve o erro de rota do Expo Router
            onPress={() => router.push(`/perfil/${item.id}` as Href)}
          >
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.resumo}>{item.resumo_perfil}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 20, color: '#333', textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2f95dc', marginBottom: 5 },
  resumo: { fontSize: 14, color: '#666' },
});