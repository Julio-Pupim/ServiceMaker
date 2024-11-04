import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DetalharServicoProps = {
  nome: string;
  data: string;
  nomePrestador: string;
  local: string;
  descricaoServico: string;
  custo: string;
}

export default function DetalharServico({
  nome,
  data,
  nomePrestador,
  local,
  descricaoServico,
  custo
}: DetalharServicoProps) {
  return (
    <SafeAreaView style={estilos.container}>
      <View style={estilos.header}>
        <View style={estilos.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={estilos.userName}>Usuário</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={estilos.scrollViewContainer}>
        <View style={estilos.formulario}>
          
          {/* Nome */}
          <View style={estilos.containerInput}>
            <Text style={estilos.label}>Nome:</Text>
            <Text style={estilos.input}>{nome}</Text>
          </View>

          {/* Data */}
          <View style={estilos.containerInput}>
            <Text style={estilos.label}>Data:</Text>
            <Text style={estilos.input}>{data}</Text>
          </View>

          {/* Nome do Prestador */}
          <View style={estilos.containerInput}>
            <Text style={estilos.label}>Nome do Prestador:</Text>
            <Text style={estilos.input}>{nomePrestador}</Text>
          </View>

          {/* Local */}
          <View style={estilos.containerInput}>
            <Text style={estilos.label}>Local:</Text>
            <Text style={estilos.input}>{local}</Text>
          </View>

          {/* Descrição do Serviço */}
          <View style={estilos.containerInput}>
            <Text style={estilos.label}>Descrição do Serviço:</Text>
            <Text style={[estilos.input, { height: 100, textAlignVertical: 'top' }]}>{descricaoServico}</Text>
          </View>

          {/* Custo */}
          <View style={estilos.containerInput}>
            <Text style={estilos.label}>Custo:</Text>
            <Text style={estilos.input}>{custo}</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FFD700',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    marginBottom: 20,
  },
  userText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  scrollViewContainer: {
    paddingBottom: 100,
  },
  formulario: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  containerInput: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
});
