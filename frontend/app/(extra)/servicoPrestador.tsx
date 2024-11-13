import { Ionicons } from "@expo/vector-icons";
import { View,Text, TouchableOpacity } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import { Pressable } from "react-native";

const servicoPrestador = () => {

const prestadorClick = ()=>{
  router.navigate('/(extra)/prestador')
}
  
const tiposServicos = [
  
    { id: '1', servico: 'Manutenção Geral de Jardins'  },
    { id: '2', servico: 'Paisagismo' },    
    { id: '3', servico: 'Poda de Árvores e Arbustos'  },
    { id: '4', servico: 'Instalação de Sistemas de Irrigação' },    
    { id: '5', servico: 'Preparação do Solo'  },
    { id: '6', servico: 'Instalação de Grama e Tapetes Verdes' },    

]
  return(
    
    <SafeAreaView style={styles.container}>
      <View style = {styles.topoTela}>
        <Pressable onPress={prestadorClick}>
          <Ionicons name="arrow-back-outline" size={30} color="white" />
        </Pressable>
         
         <View style={styles.centralTitulo}>
            <Ionicons name="bag-handle-outline" size={35} color="white" />
            <Text style={styles.userName}>Serviços do Prestadores</Text>
         </View>
      </View> 

      <View>

      </View>

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
container:{
  flex: 1,
 // padding: 16,
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
centralTitulo:{
  margin:'auto',
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'center'
},
userName: {
  color: 'white',
  fontSize: 20,
  fontWeight: 'bold',
  marginLeft: 15,
},

});
export default servicoPrestador;