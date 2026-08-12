import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatAddress } from '../utils/formatters';

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const UserCard = React.memo(({ user }) => {
  const formattedAddress = formatAddress(user.address);
  const initials = getInitials(user.name);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Avatar badge */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {/* User Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username || 'user'}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Email */}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Email:</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {user.email}
        </Text>
      </View>

      {/* Formatted Address */}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Address:</Text>
        <Text style={styles.detailValue} numberOfLines={2}>
          {formattedAddress}
        </Text>
      </View>

      {/* Phone / Company if available */}
      {user.phone && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{user.phone}</Text>
        </View>
      )}

      {user.company?.name && (
        <View style={styles.companyBadge}>
          <Text style={styles.companyText}>🏢 {user.company.name}</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  username: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  detailLabel: {
    width: 70,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  companyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  companyText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
});

export default UserCard;
