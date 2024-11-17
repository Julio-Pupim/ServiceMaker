import React from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type AutocompleteInputProps = {
  placeholder: string;
  data: any[];
  value: string;
  onChange: (text: string) => void;
  onSelect: (item: any) => void;
  filterKey: string; // Nome da chave a ser filtrada (ex: 'nome')
};

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  placeholder,
  data,
  value,
  onChange,
  onSelect,
  filterKey,
}) => {
  const filteredData = data.filter((item) =>
    item[filterKey].toLowerCase().includes(value.toLowerCase())
  );

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => onSelect(item)}
          >
            <Text>{item[filterKey]}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
});
