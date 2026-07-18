import { useOrderStore } from '@/features/orders/store/useOrderStore';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { OrderCard } from '../../components/OrderCard';
import { fetchOrdersAPI, Order } from '../../features/orders/api/orderAPI';

export default function HomeScreen() {
  const router = useRouter();
  const setSelectedOrder = useOrderStore((state) => state.setSelectedOrder);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders-home'],
    queryFn: () => fetchOrdersAPI([1, 2, 3]),
  });

  if (isLoading) return <ActivityIndicator style={styles.centered} size="large" />;

  const handlePressOrder = (order: Order) => {
    setSelectedOrder(order);
    router.push(`/order/${order.id}`)
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlashList
          data={data}
          renderItem={({ item }) => <OrderCard item={item} onPress={handlePressOrder} />}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={<Text style={styles.empty}>No active orders found.</Text>}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#267a75'
  },
  content: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    marginTop: 16,
  },
  listContent: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888'
  },
});