import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import SetorService from '../../service/SetorService';
import UsuarioService from '../../service/UsuarioService';

interface Setor {
    id_prestador: number;
    titulo: string;
}

interface Prestador {
    id: number;
    nome: string;
}

const Prestadores = () => {
    const [prestadores, setPrestadores] = useState<Prestador[]>([]);
    const [setores, setSetor] = useState<Setor[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usuariosData = await UsuarioService.getAllUsuarios();
                const setoresData = await SetorService.getAllSetores();
                setPrestadores(usuariosData);
                setSetor(setoresData);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };
        fetchData();
    }, []);

    const servicoPrestadorClick = (prestadorId: number) => {
      router.push(`/servico/${prestadorId}`);
  };

    const inicioClick = () => {
        router.push('/(tabs)/inicio');
    };

    return (
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
                {prestadores.map(prestador => {
                    const setorAssociado = setores.find(setor => setor.id_prestador === prestador.id);
                    return (
                        <View style={styles.header} key={prestador.id}>
                            <View style={styles.posicao}>
                                <Image
                                    source={require('../../assets/images/prestador.jpg')}
                                    style={styles.imagem}
                                />
                                <View style={styles.textoContainer}>
                                    <Text style={styles.nomePrestador}>Nome: {prestador.nome}</Text>
                                    <Text style={styles.infoPrestador}>
                                        {setorAssociado ? setorAssociado.titulo : 'Setor não disponível'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => servicoPrestadorClick(prestador.id)}>
                                <View style={styles.botaoServicos}>
                                    <Text style={styles.textServicos}>Serviços</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}
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
        justifyContent: 'center',
    },
    userName: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    header: {
        backgroundColor: '#D9D9D9',
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: 19,
        height: 120,
        margin: 4,
        borderRadius: 10,
    },
    imagem: {
        flexDirection: 'row',
        width: 60,
        height: 60,
        borderWidth: 1,
        borderRadius: 10,
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
        alignItems: 'center',
    },
    centralTitulo: {
        margin: 'auto',
        flexDirection: 'row',
    },
});

export default Prestadores;
