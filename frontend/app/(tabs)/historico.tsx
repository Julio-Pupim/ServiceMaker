import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const ServicosLista = () => {
  const servicos = [
    { titulo: 'Conserto de Ar-Condicionado', empresa: 'CoolTech', data: '03/05/2024', avaliacao: 4, custo: 250.0 },
    
    { titulo: 'Desentupimento de Pia', empresa: 'Rápido Desentupidora', data: '27/04/2024', avaliacao: 3, custo: 120.0 },
    
    { titulo: 'Conserto de Portão', empresa: 'Portões Express', data: '15/04/2024', avaliacao: 4, custo: 180.0 },
    
    { titulo: 'Reparação de Carro', empresa: 'AutoMecânica Speedy', data: '10/04/2024', avaliacao: 5, custo: 350.0 },
    
    { titulo: "Limpeza de Caixa D'Água", empresa: 'Água Pura Serviços Hidráulicos', data: '05/04/2024', avaliacao: 4, custo: 200.0 },
    
    { titulo: "Montagem de Móveis", empresa: 'Perobás Montadora de Móveis', data: '21/03/2024', avaliacao: 5, custo: 150.0 },
    
    { titulo: "Instalação de ar condicionado", empresa: 'CoolTech', data: '10/03/2024', avaliacao: 3, custo: 300.0 },
    
    { titulo: "Limpeza de Área de serviço", empresa: 'Clean Limpus', data: '20/02/2024', avaliacao: 5, custo: 75.0 },
    
    { titulo: "Reforma da casa", empresa: 'Renovasi Reformas e Concertos', data: '04/02/2024', avaliacao: 4, custo: 5000.0 },
  ];

  const renderStars = (avaliacao: number) => {
    return (
      <Text style={styles.estrelinhas}>
        {'★'.repeat(avaliacao)}
        {'☆'.repeat(5 - avaliacao)}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={35} color="white" />
        <Text style={styles.nomeUsuario}>Usuário</Text>
      </View>

      <View style={styles.servicesList}>
        {servicos.map((servico, index) => (
          <View key={index} style={styles.servicosContainer}>
            <View style={styles.servicosInfo}>
              <Text style={styles.servicosTitulo}>
                {servico.titulo} <Text style={styles.nomeEmpresa}>({servico.empresa})</Text>
              </Text>
              <Text style={styles.servicosData}><Text style={{ fontWeight: 'bold' }}>Data:</Text> {servico.data}</Text>
              {renderStars(servico.avaliacao)}
            </View>
            <View style={styles.custoText}>
              <Text style={styles.servicoCusto}>Custo: R${servico.custo.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#FBCB1C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  nomeUsuario: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  servicesList: {
    padding: 10,
  },
  servicosContainer: {
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  servicosInfo: {
    flex: 1,
    marginRight: 10,
  },
  servicosTitulo: {
    fontSize: 16,
    color: '#333',
  },
  nomeEmpresa: {
    fontWeight: 'normal',
    color: '#666',
  },
  servicosData: {
    color: '#666',
    fontSize: 14,
    marginVertical: 5,
  },
  estrelinhas: {
    color: '#666',
    fontSize: 14,
    marginVertical: 5,
  },
  servicoCusto: {
    textAlign: 'right',
    color: '#333',
    fontSize: 15,
  },
  custoText: {
    justifyContent: 'center',
  },
});

export default ServicosLista;
