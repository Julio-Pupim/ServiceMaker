import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, StatusBar} from 'react-native';
import React, {useState} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AlignCenter, Navigation } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


const Prestadores = () => {

    const navigation = useNavigation();

    const tipoPrestador = [
        { id: '1', nome: 'Claudemir',titulo: 'Manutenção Geral de Jardins'  },
        { id: '2', nome: 'Julia', titulo: 'Paisagismo' },    
        { id: '3', nome: 'Junior',titulo: 'Poda de Árvores e Arbustos'  },
        { id: '4', nome: 'Ceuma', titulo: 'Instalação de Sistemas de Irrigação' },    
        { id: '5', nome: 'Jurandir',titulo: 'Preparação do Solo'  },
        { id: '6', nome: 'Sebastião', titulo: 'Instalação de Grama e Tapetes Verdes' },    
    ]

    const prestadorClick = () =>{  
      router.navigate('/(extra)/agendamento');
    };

    const inicioClick = () =>{
      router.navigate('/(tabs)/inicio');
    }; 
    
    return(
    
    <SafeAreaView style = {styles.container}>
      
      {/* <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>Usuário</Text>
        </View>
      </View> */}


      <StatusBar hidden/>
      <View style = {styles.topoTela}>
        <TouchableOpacity onPress={inicioClick}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </TouchableOpacity>
         
         <View style={styles.centralTitulo}>
              <Ionicons name="bag-handle-outline" size={35} color="white" />
               <Text style={styles.userName}>Prestadores</Text>
         </View>
      </View> 

        <ScrollView>
           {tipoPrestador.map(prestador => (
            <View>
            <TouchableOpacity key={prestador.id} style = {styles.clicarPrestador} onPress={prestadorClick}>
              <View style = {styles.posicao}>
                <Image source={require('../../assets/images/prestador.jpg')} 
                style = {styles.imagem}/>
                <View style = {styles.textoContainer}>
                  <Text style = {styles.nomePrestador}>Nome:{prestador.nome} </Text>
                  <Text style = {styles.infoPrestador}>{prestador.titulo}</Text> 
               </View>
              </View>
              
             </TouchableOpacity>
             </View>
           ))}   
        </ScrollView>

    </SafeAreaView>
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
    //alignContent: 'center', // Centraliza os elementos no eixo horizontal
    
  },

  centralTitulo: {
   justifyContent:'center',
   //alignContent: 'center',
   flexDirection:'row',
   alignItems: 'center',
   margin: 'auto'
  },

  tituloPrestador: {
    //flexDirection: 'row',
    //alignItems: 'center',
    //justifyContent: 'center',
  },

  icon: {
    marginRight: 8, // Espaçamento entre o ícone e o texto
  },

  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  clicarPrestador: {
    backgroundColor: '#AFAFAF',
    padding: 25,
    marginBottom: 20,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  imagem: {
    width: 60,
    height: 60,
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
    margin: 10,
  },

  posicao: {
    flexDirection: 'row',
  },
});

export default Prestadores;