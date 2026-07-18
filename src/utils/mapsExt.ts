import { Order } from "@/features/orders/api/orderAPI";
import { Alert, Linking } from "react-native";

export const handleOpenMaps = (order: Order) => {
    if (order.latitude && order.longitude) {
      const nativeMapsUrl = `google.navigation:q=${order.latitude},${order.longitude}`;
      const webFallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`;

      Linking.canOpenURL(nativeMapsUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(nativeMapsUrl);
          } else {
            return Linking.openURL(webFallbackUrl);
          }
        })
        .catch(() => {
          Alert.alert('Gagal', 'Tidak dapat membuka rute navigasi.');
        });
    } else {
      const query = encodeURIComponent(order.address);
      const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
      Linking.openURL(fallbackUrl);
    }
  };