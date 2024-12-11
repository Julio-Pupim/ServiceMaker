import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, StatusBar, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/components/contextoApi';
import ReservaService from '@/service/ReservaService';
import { SwipeListView } from 'react-native-swipe-list-view';


const Agenda = () => {
  const { user } = useAuth();
  const { idPrestador, idServico } = useLocalSearchParams();
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [reservas, setReservas] = useState<any[]>([]);
  const [datasComReservas, setDatasComReservas] = useState<string[]>([]);
  const [markedDates, setMarkedDates] = useState({});


  const fetchReservasPorMes = async (dataMes: string) => {
    try {
      const response = await ReservaService.getReservaByMesAndUsuario(dataMes, user?.id);
      // Supondo que o response retorne um array de strings no formato YYYY-MM-DD
      console.log(response)
      setDatasComReservas(response);
    } catch (error) {
      console.error('Erro ao buscar dados de reservas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as reservas.');
    }
  };
  useEffect(() => {
    if (!selectedDate) {
      console.warn('Nenhuma data selecionada.');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await ReservaService.getReservaByDataAndUsuario(selectedDate, user?.id);
        setReservas(response);
      } catch (error) {
        console.error('Erro ao buscar dados de reservas:', error);
        Alert.alert('Erro', 'Não foi possível carregar as reservas.');
      }
    };

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    fetchReservasPorMes(today);
  }, []);


  useEffect(() => {
    const marcarDatas = () => {
      const newMarkedDates: any = {};

      // Marca todas as datas que possuem reservas
      datasComReservas.forEach((date) => {
        console.log(date);
        newMarkedDates[date] = {
          marked: true,
          dots: [{ key: 'reserva', color: 'blue', selectedDotColor: 'blue' }]
        };
      });

      // Destaca a data selecionada
      if (selectedDate) {
        newMarkedDates[selectedDate] = {
          ...newMarkedDates[selectedDate],
          selected: true,
          selectedColor: '#00ADF5'
        };
      }

      setMarkedDates(newMarkedDates);
    };

    marcarDatas();
  }, [datasComReservas, selectedDate]);


  const agandamentoClick = (dataAgendamento: string) => {
    router.push({ pathname: "/(agenda)/agendamento", params: { idPrestador: idPrestador, idServico: idServico, dataAgendamento: dataAgendamento } })
  }

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const aceitaReserva = async (reservaId: any) => {
    try {
      const entity = await ReservaService.getReservaById(reservaId);
      entity.status = "CONFIRMADA";
      await ReservaService.updateReserva(entity.id, entity);

      // Atualiza o estado local
      setReservas((prevReservas) =>
        prevReservas.map((reserva) =>
          reserva.id === reservaId ? { ...reserva, status: "CONFIRMADA" } : reserva
        )
      );
    } catch (error) {
      console.error('Erro ao aceitar a reserva:', error);
      Alert.alert('Erro', 'Não foi possível confirmar a reserva.');
    }
  };

  const recusaReserva = async (reservaId: any) => {
    Alert.alert('Excluir', `Excluir reserva: ${reservaId}`);
    await ReservaService.deleteReserva(reservaId)

    setReservas((prevReservas) =>
      prevReservas.filter((reserva) => reserva.id !== reservaId)
    );
  };

  const renderItem = ({ item, index }: any) => {
    const textColor = item.status === 'PENDENTE' ? 'red' : item.status === 'CONFIRMADA' ? 'green' : '#000';
    return (
      <View style={styles.rowFront}>
        <Text style={[styles.reservaText, { color: textColor }]}>
          {`Reserva: ${index + 1} - Prestador: ${item.nomePrestador} - Cliente: ${item.nomeCliente} - Horário: ${item.horarioInicio.split(':').slice(0, 2).join(':')} - Preço: ${item.servico.preco}`}
        </Text>
      </View>
    );
  };

  const renderHiddenItem = ({ item }: any) => (
    <View style={styles.rowBack}>
      <Pressable style={[styles.backButton, styles.editButton]} onPress={() => aceitaReserva(item.id)}>
        <Text style={styles.backText}>Aceitar</Text>
      </Pressable>
      <Pressable style={[styles.backButton, styles.deleteButton]} onPress={() => recusaReserva(item.id)}>
        <Text style={styles.backText}>Recusar</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <View style={styles.userText}>
          <Ionicons name="person-circle-outline" size={35} color="white" />
          <Text style={styles.userName}>{user?.nome}</Text>
        </View>
      </View>

      <Text style={styles.title}>Agenda</Text>
      <Calendar
        style={styles.calendar}
        onDayPress={handleDayPress}
        current={today}
        markedDates={markedDates}
        onMonthChange={(month: any) => {
          const mesAtual = month.month;
          const anoAtual = month.year;
          const dataConsulta = `${anoAtual}-${mesAtual < 10 ? '0' + mesAtual : mesAtual}-01`;
          fetchReservasPorMes(dataConsulta);
        }}

        markingType={'multi-dot'}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00ADF5',
          todayTextColor: '#00ADF5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          arrowColor: 'black',
          monthTextColor: 'black',
        }}
      />

      <SwipeListView
        data={reservas}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-150}
        disableLeftSwipe={user?.role === "ROLE_CLIENTE"}
        disableRightSwipe
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.reservasContainer}
      />

      {/* Botão de agendar no final da lista */}
      <Pressable style={styles.agendarButton} onPress={() => agandamentoClick(selectedDate)}>
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.agendarButtonText}>Agendar</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FBCB1C',
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  calendar: {
    marginBottom: 20,
  },
  tasks: {
    paddingHorizontal: 20,
  },
  task: {
    fontSize: 16,
    marginVertical: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: -150,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cronogramaButton: {
    position: 'absolute',
    bottom: -70,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  backIcon: {
    paddingRight: 15,
  },
  reservasContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
    flexGrow: 1
  },
  noReservasText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  reservaItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  agendarButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  agendarButtonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
  },
  rowFront: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 5,
    marginBottom: 10,
  },

  reservaText: {
    fontSize: 16,
    flexShrink: 1
  },
  backButton: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  editButton: {
    backgroundColor: '#5cb85c',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
  },
  backText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default Agenda;
