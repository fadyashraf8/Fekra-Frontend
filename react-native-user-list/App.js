import React, { useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import {
  fetchUsers,
  selectPaginatedUsers,
  selectUserStatus,
  selectUserError,
  selectIsOffline,
} from './src/redux/userSlice';
import UserCard from './src/components/UserCard';
import SearchBar from './src/components/SearchBar';
import PaginationFooter from './src/components/PaginationFooter';

// Main User List View Component
function UserListContent() {
  const dispatch = useDispatch();
  const paginatedUsers = useSelector(selectPaginatedUsers);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const isOffline = useSelector(selectIsOffline);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const renderUserItem = useCallback(({ item }) => {
    return <UserCard user={item} />;
  }, []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // getItemLayout optimization for FlatList
  const getItemLayout = useCallback(
    (_, index) => ({
      length: 160, // Approximate fixed height of each UserCard
      offset: 160 * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>👥 User Directory</Text>
          <Text style={styles.subtitle}>React Native & Redux Toolkit</Text>
        </View>

        {/* Offline Cache Indicator Banner */}
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              📶 Offline Mode • Showing cached data from AsyncStorage
            </Text>
          </View>
        )}

        {/* Search Bar */}
        <SearchBar />

        {/* Loading State */}
        {status === 'loading' && paginatedUsers.length === 0 && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Fetching users...</Text>
          </View>
        )}

        {/* Error State */}
        {status === 'failed' && paginatedUsers.length === 0 && (
          <View style={styles.centerContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleRefresh}>
              <Text style={styles.retryText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty Search Result */}
        {status === 'succeeded' && paginatedUsers.length === 0 && (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No Users Found</Text>
            <Text style={styles.emptyDesc}>Try searching for a different name.</Text>
          </View>
        )}

        {/* Optimized FlatList */}
        {paginatedUsers.length > 0 && (
          <FlatList
            data={paginatedUsers}
            renderItem={renderUserItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
            removeClippedSubviews={true}
            contentContainerStyle={styles.listPadding}
            ListFooterComponent={<PaginationFooter />}
            refreshing={status === 'loading'}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// App Root Wrapper with Redux Provider
export default function App() {
  return (
    <Provider store={store}>
      <UserListContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  offlineBanner: {
    backgroundColor: '#fef3c7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  offlineText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  listPadding: {
    paddingBottom: 24,
  },
});
