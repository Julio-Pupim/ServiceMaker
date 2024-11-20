import React, { useState } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    StyleSheet,
    Pressable,
} from 'react-native';

type AutocompleteInputProps = {
    placeholder: string;
    data: any[];
    value: string;
    onChange: (text: string) => void;
    onSelect: (item: any) => void;
    filterKey: string;
};

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
    placeholder,
    data,
    value,
    onChange,
    onSelect,
    filterKey,
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredData = data.filter((item) =>
        item[filterKey]?.toLowerCase().includes(value?.toLowerCase())
    );

    return (
        <View style={styles.posicao}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={(text) => {
                    onChange(text);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)
                }
            />
            {showSuggestions && filteredData.length > 0 && (
                <FlatList
                    data={filteredData}
                    keyExtractor={(_item, index) => _item.id || index.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.suggestionItem}
                            onPress={() => {
                                console.log("AAAA", item)
                                onSelect(item);
                                setShowSuggestions(false);
                            }}
                        >
                            <Text>{item[filterKey]}</Text>
                        </Pressable>
                    )}
                />
            )}
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
        backgroundColor: '#FFF',
    },
    posicao:{
        paddingLeft:3,
        paddingRight:5
    }
});