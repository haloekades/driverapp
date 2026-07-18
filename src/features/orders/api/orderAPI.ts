import { apiFetch } from '../../../api/client';

export interface Order {
  id: number;
  customerName: string;
  juice: string;
  quantity: number;
  address: string;
  latitude: string;
  longitude: string;
  status: number;
  rejectReason: string | null;
}

export const fetchOrdersAPI = async (statuses: number[]): Promise<Order[]> => {
  const statusParam = encodeURIComponent(JSON.stringify(statuses));
  return apiFetch(`/orders?statuses=${statusParam}`);
};

export interface UpdateStatusPayload {
  status: number;
  employeeId: number;
  rejectReason?: string;
}

export const updateOrderStatus = async (orderId: string | number, payload: UpdateStatusPayload) => {
  return apiFetch(`/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};