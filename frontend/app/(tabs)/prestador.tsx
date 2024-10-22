import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import { AlignCenter } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';


const Prestadores = () => {

    const tipoPrestador = [
        { id: '1', nome: 'Claudemir',titulo: 'Serviços de jardinagem'  },
        { id: '2', nome: 'Julia', titulo: 'Eletricista' },    
    ]
    return(
    <ScrollView style = {styles.container}>
        
        <View style = {styles.header}>
          <Image source={require('../../assets/images/prestador.jpg')} 
          style = {styles.imagem}/>
          {tipoPrestador.map(prestador => (
             <Text style = {styles.textoInfo}>{prestador.nome} </Text>
           ))}
            
        </View>

    </ScrollView>
    );
};
    
const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 16,
        backgroundColor:'#1a1a1a',
        

    },
    header:{
        backgroundColor: '#ffd700',

        padding: 19,
        height: 100,
        width: 359
        
    },
    imagem:{
        width: 60,
        height: 60
    },
    textoInfo:{
      fontSize: 16,
      fontWeight: 'bold',
    },
});
export default Prestadores;