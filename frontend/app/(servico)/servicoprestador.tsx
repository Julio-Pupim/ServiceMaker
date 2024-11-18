import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';

const ServicoPrestador = () => {

  const prestadorClick = () => {
    router.navigate('/(servico)/prestador');
  }

  const agendamentoClick = () => {
    router.navigate('/(agenda)/agendamento');
  }

  const tiposServicos = [
    { id: '1', servico: 'Manutenção Geral de Jardins' },
    { id: '2', servico: 'Paisagismo' },
    { id: '3', servico: 'Poda de Árvores e Arbustos' },
    { id: '4', servico: 'Instalação de Sistemas de Irrigação' },
    { id: '5', servico: 'Preparação do Solo' },
    { id: '6', servico: 'Instalação de Grama e Tapetes Verdes' },
  ];

  const nomePrestador = [
    { id: '1', nome: 'Pedro' },
    { id: '2', nome: 'Rafael' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topoTela}>
        <TouchableOpacity onPress={prestadorClick}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.centralTitulo}>
          <Ionicons name="bag-handle-outline" size={35} color="white" />
          <Text style={styles.userName}>Serviços do Prestador</Text>
        </View>
      </View>

      {nomePrestador.map((nome) => (
        <View style={styles.titulo} key={nome.id}>
          <Text>{nome.nome}</Text>
        </View>
      ))}

      <ScrollView>
        {tiposServicos.map((tipos, index) => (
          <TouchableOpacity key={tipos.id} onPress={agendamentoClick}>
            <View style={styles.tipoServicos}>
              <Text style={styles.textoServico}>
                {index + 1} - Serviço {tipos.servico}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topoTela: {
    backgroundColor: '#FBCB1C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centralTitulo: {
    margin: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  tipoServicos: {
    backgroundColor: '#f0f0f0',
    margin: 4,
    padding: 19,
  },
  textoServico: {
    fontWeight: 'bold',
  },
  titulo: {
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 20,
  },
});

export default ServicoPrestador;
