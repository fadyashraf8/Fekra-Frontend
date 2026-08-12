import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectSearchQuery, setSearchQuery } from '../redux/userSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);

  return (
    <View style={styles.container}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder="Search users by name..."
        placeholderTextColor="#94a3b8"
        value={searchQuery}
        onChangeText={(text) => dispatch(setSearchQuery(text))}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={() => dispatch(setSearchQuery(''))}
          style={styles.clearBtn}
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '700',
  },
});

export default SearchBar;
