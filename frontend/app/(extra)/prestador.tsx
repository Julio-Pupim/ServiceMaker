import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, StatusBar} from 'react-native';
import React, {useState} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AlignCenter, Navigation } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';


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
      navigation.navigate('');
    };
    
    return(

    <View style = {styles.container}>
      <StatusBar hidden/>
      <View style = {styles.topoTela}>
        <Ionicons name="arrow-back-outline" size={30} color="white"/>
        <View style={styles.userText}>
          <Ionicons name="bag-handle-outline" size={35} color="white" />
          <Text style={styles.userName}>Prestadores</Text>
        </View>
      </View>

        <ScrollView>
           {tipoPrestador.map(prestador => (
            <TouchableOpacity key={prestador.id} style = {styles.header} onPress={prestadorClick}>
              <View style = {styles.posicao}>
              <Image source={require('../../assets/images/prestador.jpg')} 
              style = {styles.imagem}/>
              <View style = {styles.textoContainer}>
                <Text style = {styles.nomePrestador}>Nome:{prestador.nome} </Text>
                <Text style = {styles.infoPrestador}>{prestador.titulo}</Text> 
               </View>
               </View>
             </TouchableOpacity>
           ))}   
        </ScrollView>

    </View>
    );
};
    
const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 16,
        backgroundColor:'#ECF0F1',
        
   
    },
    topoTela:{
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#FFD700',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      padding: 25,
      marginBottom: 2,
    },
    userText: {
      flexDirection: 'row',
      marginHorizontal: 20,
      alignItems: 'center',
      marginRight:300,
  
      
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
        height: 100,
        margin: 4,
        borderRadius: 10,
    },
    imagem:{
        flexDirection: 'row',
        width: 60,
        height: 60, 
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
    }

});
export default Prestadores;