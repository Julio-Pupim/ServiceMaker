import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, StatusBar} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';


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

    const servicoPrestadorClick = () =>{  
     router.navigate('/(servico)/servicoprestador');
    };
    
    const inicioClick =()=>{
      router.navigate('/(tabs)/inicio');
    };
    
    return(

    <View style = {styles.container}>
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
            <View style = {styles.header}>
              <View style = {styles.posicao}>
                <Image source={require('../../assets/images/prestador.jpg')} 
                style = {styles.imagem}/>
                <View style = {styles.textoContainer}>
                  <Text style = {styles.nomePrestador}>Nome:{prestador.nome} </Text>
                  <Text style = {styles.infoPrestador}>{prestador.titulo}</Text> 
                </View>
              </View>
              <TouchableOpacity key={prestador.id} onPress={servicoPrestadorClick}>
                <View style={styles.botaoServicos} >
                  <Text  style={styles.textServicos}>Mais serviços</Text>
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
    centralTitulo:{
      margin:'auto',
      flexDirection:'row',
      //alignItems:'center',
      //justifyContent:'center'
    }
});
export default Prestadores;