import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from 'expo-router';
import ServicoService from "@/service/ServicoService";
import { useAuth } from "@/components/contextoApi";


const ServicoPrestador = () => {
  const [servicos, setServicos] = useState([]);
  const { user } = useAuth();

  const idPrestador: any = useLocalSearchParams();

  useEffect(() => {

    if (!idPrestador.id) {
      console.warn('Nenhum idPrestador fornecido.');
      return;
    }
  
    const fetchData = async () => {
      try {
        console.log(idPrestador)
        const usuariosData = await ServicoService.getServicosByPrestador(idPrestador.id);
        setServicos(usuariosData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);


  const servicoAgendaClick = (idServico: number) => {
    router.push({ pathname: "/(tabs)/agenda", params: { idPrestador: idPrestador.id, idServico: idServico } })

  };

  const inicioClick = () => {
    router.navigate('/(tabs)/inicio');
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userText}>
          <TouchableOpacity onPress={inicioClick}>
            <Ionicons name="arrow-back-outline" size={30} style={styles.backIcon}
              color="white"
            />
          </TouchableOpacity>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{user?.nome}</Text>
        </View>
      </View>

      <Text style={styles.title}>Serviços do Prestador</Text>

      <ScrollView>
        {servicos.map((servico: any) => (
          <View style={styles.header} key={servico.id}>
            <View style={styles.posicao}>
              <View style={styles.textoContainer}>
                <Text style={styles.nomePrestador}>Nome: {servico.descricao}</Text>
                <Text style={styles.infoPrestador}>
                  {servico.tempoServico}
                </Text>
                <Text style={styles.infoPrestador}>
                  {servico.preco}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => servicoAgendaClick(servico.id)}>
              <View style={styles.botaoServicos}>
                <Text style={styles.textServicos}>Agendamento</Text>
              </View>
            </TouchableOpacity>
          </View>
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
  header: {
    backgroundColor: '#FBCB1C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 25,
    marginBottom: 20,
  },
  imagem: {
    flexDirection: 'row',
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 10
  },
  nomePrestador: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  infoPrestador: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textoContainer: {
    justifyContent: 'flex-start',
    margin: 10
  },
  posicao: {
    flexDirection: 'row'
  },
  textServicos: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  botaoServicos: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    marginVertical: 10,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center'
  },

  backIcon: {
    paddingRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default ServicoPrestador;
