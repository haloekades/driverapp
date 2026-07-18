import { getStatusLabel } from '@/components/OrderCard';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { updateOrderStatus } from '@/features/orders/api/orderAPI';
import { useOrderStore } from '@/features/orders/store/useOrderStore';
import { handleOpenMaps } from '@/utils/mapsExt';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const order = useOrderStore((state) => state.selectedOrder);
  const setSelectedOrder = useOrderStore((state) => state.setSelectedOrder);

  const employeeId = useAuthStore((state) => state.employee?.id) || 49;

  const [loading, setLoading] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!order) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: '#267a75' }]}>
        <Text style={[styles.errorText, { color: '#FFF' }]}>Data order tidak ditemukan.</Text>
        <TouchableOpacity style={styles.btnBack} onPress={() => router.back()}>
          <Text style={styles.btnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStatus = order.status;

  const handleUpdateStatus = async (targetStatus: number, reason?: string) => {
    setLoading(true);
    try {
      const payload = {
        status: targetStatus,
        employeeId: employeeId,
        ...(reason && { rejectReason: reason }),
      };

      await updateOrderStatus(id as string, payload);

      setSelectedOrder({
        ...order,
        status: targetStatus,
        ...(reason && { rejectReason: reason })
      });

      setIsRejectModalVisible(false);
      setRejectReason('');

      Alert.alert('Sukses', `Status orderan berhasil diperbarui!`, [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Gagal', error.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backWrapper}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.toolbarTitle}>Order Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.card}>
            <Text style={styles.label}>Order ID :</Text>
            <Text style={styles.value}>#{order.id}</Text>
            <View style={styles.divider} />

            <Text style={styles.label}>Status :</Text>
            <Text style={styles.value}>{getStatusLabel(order.status)}</Text>
            <View style={styles.divider} />

            <Text style={styles.label}>Customer Name :</Text>
            <Text style={styles.value}>{order.customerName}</Text>
            <View style={styles.divider} />

            <Text style={styles.label}>Juice :</Text>
            <Text style={styles.value}>{order.juice}</Text>
            <View style={styles.divider} />

            <Text style={styles.label}>Quantity :</Text>
            <Text style={styles.value}>{order.quantity}</Text>
            <View style={styles.divider} />

            <Text style={styles.label}>Address :</Text>
            <Text style={styles.value}>{order.address}</Text>
            {order.status < 4 && (
              <TouchableOpacity
                style={styles.mapsButton}
                onPress={() => handleOpenMaps(order)}
                activeOpacity={0.6}
              >
                <Ionicons name="map-outline" size={14} color="#267a75" />
                <Text style={styles.mapsButtonText}>Open Maps</Text>
              </TouchableOpacity>
            )}

            {order.rejectReason && (
              <View style={styles.rejectContainer}>
                <Text style={styles.rejectLabel}>Alasan :</Text>
                <Text style={styles.rejectValue}>{order.rejectReason}</Text>
              </View>
            )}
          </View>

        </ScrollView>

        <View style={styles.footerAction}>
          {loading && <ActivityIndicator size="large" color="#267a75" style={{ marginBottom: 10 }} />}

          {!loading && currentStatus === 1 && (
            <View style={styles.rowButtons}>
              <TouchableOpacity
                style={[styles.button, styles.btnReject]}
                onPress={() => setIsRejectModalVisible(true)}
              >
                <Text style={styles.btnText}>Reject Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.btnReceive]}
                onPress={() => handleUpdateStatus(2)}
              >
                <Text style={styles.btnText}>Receive Order</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && currentStatus === 2 && (
            <View style={styles.rowButtons}>
              <TouchableOpacity
                style={[styles.button, styles.btnDelivery]}
                onPress={() => handleUpdateStatus(3)}
              >
                <Text style={styles.btnText}>Start to  Deliver</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && currentStatus === 3 && (
            <View style={styles.rowButtons}>
              <TouchableOpacity
                style={[styles.button, styles.btnComplete]}
                onPress={() => handleUpdateStatus(5)}
              >
                <Text style={styles.btnText}>Complete Order</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={isRejectModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <Text style={styles.modalTitle}>Alasan Penolakan</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Contoh: Lokasi Terlalu jauh"
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
            />
            <View style={styles.modalRowButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.btnCancel]}
                onPress={() => setIsRejectModalVisible(false)}
              >
                <Text style={styles.btnTextCancel}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.btnSubmitReject]}
                onPress={() => {
                  if (!rejectReason.trim()) {
                    Alert.alert('Peringatan', 'Alasan reject wajib diisi!');
                    return;
                  }
                  handleUpdateStatus(4, rejectReason);
                }}
              >
                <Text style={styles.btnText}>Submit Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#267a75'
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  toolbarBackText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  toolbarTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    marginTop: 14,
  },
  scrollContent: {
    padding: 16
  },
  center: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2 },
  orderIdText: { fontSize: 14, color: '#6C757D', marginBottom: 4 },
  customerName: { fontSize: 20, fontWeight: 'bold', color: '#212529', marginBottom: 6 },
  addressText: { fontSize: 14, color: '#495057', lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#495057', marginBottom: 8, paddingLeft: 4 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#212529' },
  itemSub: { fontSize: 14, color: '#6C757D', marginTop: 4 },
  itemTotalPrice: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  rejectContainer: { marginTop: 16, backgroundColor: '#FFF0F2', padding: 12, borderRadius: 8 },
  rejectLabel: { fontSize: 12, fontWeight: 'bold', color: '#DC3545' },
  rejectValue: { fontSize: 14, color: '#DC3545', marginTop: 2 },
  footerAction: { backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderTopColor: '#E9ECEF' },
  rowButtons: { flexDirection: 'row', gap: 12 },
  button: { flex: 1, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnReject: { backgroundColor: '#DC3545' },
  btnReceive: { backgroundColor: '#267a75' },
  btnDelivery: { backgroundColor: '#267a75', width: '100%' },
  btnComplete: { backgroundColor: '#267a75', width: '100%' },
  btnBack: { backgroundColor: '#6C757D', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 12 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  finishedBox: { width: '100%', padding: 14, backgroundColor: '#E9ECEF', borderRadius: 8, alignItems: 'center' },
  finishedText: { color: '#495057', fontWeight: '600' },
  errorText: { fontSize: 16, color: '#6C757D' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, minHeight: 250 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#212529' },
  textInput: { borderWidth: 1, borderColor: '#CED4DA', borderRadius: 8, padding: 12, height: 80, textAlignVertical: 'top', marginBottom: 20 },
  modalRowButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  btnCancel: { backgroundColor: '#E9ECEF' },
  btnSubmitReject: { backgroundColor: '#DC3545' },
  btnTextCancel: { color: '#495057', fontWeight: '600' },
  label: { fontSize: 12, color: '#888', fontWeight: 'bold', marginTop: 10 },
  value: { fontSize: 16, color: '#333', marginBottom: 5, marginTop: 4 },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 8,
    backgroundColor: '#EAF5F4',
    paddingVertical: 12,
    borderRadius: 8,
  },
  mapsButtonText: {
    fontSize: 12,
    color: '#267a75',
    fontWeight: '600',
    marginLeft: 4,
  },
});