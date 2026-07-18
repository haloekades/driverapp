import { handleOpenMaps } from '@/utils/mapsExt';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Order } from '../features/orders/api/orderAPI';

export const getStatusLabel = (status: number) => {
    switch (status) {
      case 1: return 'New Order';
      case 2: return 'Order Received';
      case 3: return 'Out of Delivery';
      case 4: return 'Rejected';
      case 5: return 'Completed';
      default: return 'Unknown';
    }
  };

export const OrderCard = ({ item, onPress }: { item: Order, onPress: (order: Order) => void }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.7}>
      <View style={styles.headerRow}>
        <Text style={styles.juiceText} numberOfLines={1}>
          {item.juice} <Text style={styles.dotSeparator}>•</Text> {item.quantity} pcs
        </Text>
        <View style={[styles.badge,
        item.status == 1 ? styles.bgNewOrder :
          item.status == 2 ? styles.bgOrderReceived :
            item.status == 3 ? styles.bgOutOfDelivery :
              item.status == 4 ? styles.bgRejected : styles.bgCompleted]}>
          <Text style={[styles.badgeText, item.status < 4 ? styles.badgeTextInProgress : styles.badgeTextFinished]}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.customerName}>{item.customerName}</Text>

      <View style={styles.addressRow}>
        <Ionicons name="location-sharp" size={16} color="#267a75" style={styles.locationIcon} />
        <Text style={styles.address} numberOfLines={2}>
          {item.address}
        </Text>
      </View>

      {item.status < 4 && (
        <TouchableOpacity
          style={styles.mapsButton}
          onPress={() => handleOpenMaps(item)}
          activeOpacity={0.6}
        >
          <Ionicons name="map-outline" size={14} color="#267a75" />
          <Text style={styles.mapsButtonText}>Open Maps</Text>
        </TouchableOpacity>
      )}

      {item.rejectReason && (
        <View style={styles.rejectContainer}>
          <Text style={styles.rejectLabel}>Reason :</Text>
          <Text style={styles.rejectValue}>{item.rejectReason}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  juiceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
    marginRight: 8
  },
  dotSeparator: {
    color: '#888',
    fontWeight: 'normal',
    marginHorizontal: 2
  },
  customerName: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
    marginBottom: 4
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    width: '100%',
  },
  locationIcon: {
    marginRight: 4,
  },
  address: {
    fontSize: 14,
    color: '#1a2423',
    lineHeight: 16, 
    flex: 1,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    width: '100%',
    marginTop: 16,
    backgroundColor: '#EAF5F4',
    paddingVertical: 10,
    borderRadius: 8,
  },
  mapsButtonText: {
    fontSize: 12,
    color: '#267a75',
    fontWeight: '600',
    marginLeft: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bgNewOrder: { backgroundColor: '#6db1ed' },
  bgOrderReceived: { backgroundColor: '#ebc775' },
  bgOutOfDelivery: { backgroundColor: '#f3a6f5' },
  bgRejected: { backgroundColor: '#db110d' },
  bgCompleted: { backgroundColor: '#259111' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeTextInProgress: { color: '#333' },
  badgeTextFinished: { color: '#fff' },
  rejectReason: {
    marginTop: 8,
    color: '#DC3545',
    fontStyle: 'italic',
    fontSize: 14
  },
  rejectContainer: { marginTop: 16, backgroundColor: '#FFF0F2', padding: 12, borderRadius: 8 },
  rejectLabel: { fontSize: 12, fontWeight: 'bold', color: '#DC3545' },
  rejectValue: { fontSize: 14, color: '#DC3545', marginTop: 2 },
});