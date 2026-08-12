import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadMoreUsers, selectHasMoreUsers } from '../redux/userSlice';

const PaginationFooter = () => {
  const dispatch = useDispatch();
  const hasMore = useSelector(selectHasMoreUsers);

  if (!hasMore) {
    return (
      <View style={styles.footerContainer}>
        <Text style={styles.endText}>✓ All users loaded</Text>
      </View>
    );
  }

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={() => dispatch(loadMoreUsers())}
        activeOpacity={0.8}
      >
        <Text style={styles.loadMoreText}>Load More Users</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadMoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  endText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default PaginationFooter;
