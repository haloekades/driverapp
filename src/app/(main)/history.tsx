import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OrderCard } from '../../components/OrderCard';
import { fetchOrdersAPI, Order } from '../../features/orders/api/orderAPI';
import { useOrderStore } from '../../features/orders/store/useOrderStore';

export default function HistoryScreen() {
  const router = useRouter();
  const setSelectedOrder = useOrderStore((state) => state.setSelectedOrder);

  const [selectedStatus, setSelectedStatus] = useState<number>(5);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders-history', selectedStatus],
    queryFn: () => fetchOrdersAPI([selectedStatus]),
  });

  const handlePressOrder = (order: Order) => {
    setSelectedOrder(order);
    router.push(`/order/${order.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.chip, styles.flexEqual, selectedStatus === 5 && styles.chipActive]}
            onPress={() => setSelectedStatus(5)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, selectedStatus === 5 && styles.chipTextActive]}>
              Completed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, styles.flexEqual, selectedStatus === 4 && styles.chipActive]}
            onPress={() => setSelectedStatus(4)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, selectedStatus === 4 && styles.chipTextActive]}>
              Rejected
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator style={styles.centered} size="large" color="#267a75" />
        ) : (
          <FlashList
            data={data}
            renderItem={({ item }) => <OrderCard item={item} onPress={handlePressOrder} />}
            onRefresh={refetch}
            refreshing={isLoading}
            ListEmptyComponent={<Text style={styles.empty}>No history orders found.</Text>}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#267a75',
  },
  filterContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 10,
  },
  flexEqual: {
    flex: 1, 
  },
  chip: {
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  chipActive: {
    backgroundColor: '#267a75',
    borderColor: '#267a75',
  },
  chipText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    marginTop: 14,
  },
  listContent: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
});