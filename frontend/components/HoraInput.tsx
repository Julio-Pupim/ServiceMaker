import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';

export const TimeInput = ({ control, name, label }: any) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <>
            {Platform.OS === 'web' ? (
              // Campo para Web
              <input
                type="time"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                style={{
                  borderWidth: 1,
                  padding: 10,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  marginTop: 5,
                  width: '100%',
                }}
              />
            ) : (
              // Campo para Dispositivos Móveis
              <>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                  onPress={() => setShowPicker(true)}
                >
                  <Text>{value || 'Selecione um horário'}</Text>
                </TouchableOpacity>
                {showPicker && (
                  <DateTimePicker
                    value={
                      value
                        ? new Date(`1970-01-01T${value}:00`)
                        : new Date()
                    }
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedTime) => {
                      setShowPicker(false);
                      if (selectedTime) {
                        const hours = selectedTime.getHours()
                          .toString()
                          .padStart(2, '0');
                        const minutes = selectedTime.getMinutes()
                          .toString()
                          .padStart(2, '0');
                        onChange(`${hours}:${minutes}`);
                      }
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      />
    </View>
  );
};
