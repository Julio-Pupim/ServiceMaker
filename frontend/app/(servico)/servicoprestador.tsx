import { Ionicons } from "@expo/vector-icons";
import { View,Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { router, useNavigation } from 'expo-router';
import ServicoService from "@/service/ServicoService";


const servicoPrestador = () => {
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    
      const fetchData = async () => {
          try {
              const usuariosData = await ServicoService.getAllServicos();
              setServicos(usuariosData);
          } catch (error) {
              console.error('Erro ao buscar dados:', error);
          }
      };
      fetchData();
  }, []);

  const servicoAgendaClick = () =>{  
   router.navigate('/(tabs)/agenda');
  };
  
  const inicioClick =()=>{
    router.navigate('/(tabs)/inicio');
  };
  return(
<View style={styles.container}>
          <View style={styles.topoTela}>
              <TouchableOpacity onPress={inicioClick}>
                  <Ionicons name="arrow-back-outline" size={30} color="white" />
              </TouchableOpacity>
              <View style={styles.centralTitulo}>
                  <Ionicons name="bag-handle-outline" size={35} color="white" />
                  <Text style={styles.userName}>Prestadores</Text>
              </View>
          </View> 
          <ScrollView>
              {servicos.map(servico => (
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
                      <TouchableOpacity onPress={servicoAgendaClick}>
                          <View style={styles.botaoServicos}>
                              <Text style={styles.textServicos}>Serviços</Text>
                          </View>
                      </TouchableOpacity>
                  </View>
              ))}
          </ScrollView>
      </View>
);
};
  
const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor:'white',
  },
  topoTela:{
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
  header:{
    backgroundColor: '#D9D9D9',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 19,
    height: 120,
    margin: 4,
    borderRadius: 10,
  },
  imagem:{
    flexDirection: 'row',
    width: 60,
    height: 60, 
    borderWidth: 1,
    borderRadius: 10
  },
  nomePrestador:{
    fontSize: 13,
    fontWeight: 'bold',
  },
  infoPrestador:{
    fontSize: 14,
    fontWeight: 'bold',
  },
  textoContainer:{
    justifyContent:'flex-start',
    margin: 10
  },
  posicao:{
    flexDirection: 'row'
  },
  textServicos:{
    fontSize: 12,
    fontWeight: 'bold',
  },
  botaoServicos:{
    backgroundColor: '#FFD700',
    borderRadius: 5,
    marginVertical: 10,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center'
  },
  
});

export default ServicoPrestador;
