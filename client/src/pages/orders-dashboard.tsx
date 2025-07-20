import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  MapPin, 
  Phone, 
  User, 
  CreditCard,
  Banknote,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import Navigation from '@/components/navigation';
import type { Order, Plate } from '@shared/schema';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  preparing: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const statusLabels = {
  pending: 'في الانتظار',
  confirmed: 'مؤكد',
  preparing: 'قيد التحضير',
  delivered: 'تم التوصيل',
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Package,
  delivered: Truck,
};

interface OrderWithPlate extends Order {
  plate?: Plate;
}

export default function OrdersDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Fetch all orders
  const { data: orders, isLoading, refetch } = useQuery<OrderWithPlate[]>({
    queryKey: ['/api/orders'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest('PATCH', `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'تم تحديث حالة الطلب',
        description: 'تم تحديث حالة الطلب بنجاح',
      });
    },
    onError: () => {
      toast({
        title: 'خطأ في تحديث الحالة',
        description: 'يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    },
  });

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const openInMaps = (latitude: number, longitude: number, address: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(mapsUrl, '_blank');
  };

  const filteredOrders = orders?.filter(order => 
    selectedStatus === 'all' || order.status === selectedStatus
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <Navigation />
      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              لوحة إدارة الطلبات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              إدارة ومتابعة جميع الطلبات الواردة
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطلبات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="confirmed">مؤكد</SelectItem>
                <SelectItem value="preparing">قيد التحضير</SelectItem>
                <SelectItem value="delivered">تم التوصيل</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              size="icon"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(statusLabels).map(([status, label]) => {
            const count = orders?.filter(order => order.status === status).length || 0;
            const Icon = statusIcons[status as keyof typeof statusIcons];
            
            return (
              <Card key={status}>
                <CardContent className="flex items-center p-6">
                  <Icon className="h-8 w-8 text-primary ml-4" />
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedStatus === 'all' ? 'لا توجد طلبات حالياً' : `لا توجد طلبات ${statusLabels[selectedStatus as keyof typeof statusLabels]}`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-5 w-5" />
                          <CardTitle className="text-lg">طلب رقم #{order.id}</CardTitle>
                        </div>
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(order.createdAt), 'PPp', { locale: ar })}
                        </p>
                        <Select 
                          value={order.status} 
                          onValueChange={(newStatus) => handleStatusUpdate(order.id, newStatus)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">في الانتظار</SelectItem>
                            <SelectItem value="confirmed">مؤكد</SelectItem>
                            <SelectItem value="preparing">قيد التحضير</SelectItem>
                            <SelectItem value="delivered">تم التوصيل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Customer Info */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                          معلومات العميل
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{order.customerName}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <a 
                            href={`tel:${order.customerPhone}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {order.customerPhone}
                          </a>
                        </div>
                        
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-gray-700 dark:text-gray-300 mb-1">
                              {order.deliveryAddress}
                            </p>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto text-blue-600 dark:text-blue-400"
                              onClick={() => openInMaps(order.latitude, order.longitude, order.deliveryAddress)}
                            >
                              فتح في الخرائط
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                          تفاصيل الطلب
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span>طبق رقم #{order.plateId}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          {order.paymentMethod === 'cash' ? (
                            <Banknote className="h-4 w-4 text-gray-500" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-gray-500" />
                          )}
                          <span>
                            {order.paymentMethod === 'cash' ? 'نقداً عند التوصيل' : 'دفع إلكتروني'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            المبلغ الكلي: {order.totalAmount.toFixed(2)} ر.س
                          </span>
                        </div>
                        
                        {order.notes && (
                          <div className="flex items-start gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                {order.notes}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                          إجراءات سريعة
                        </h3>
                        
                        <div className="space-y-2">
                          {order.status === 'pending' && (
                            <Button
                              onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                              className="w-full"
                              size="sm"
                            >
                              تأكيد الطلب
                            </Button>
                          )}
                          
                          {order.status === 'confirmed' && (
                            <Button
                              onClick={() => handleStatusUpdate(order.id, 'preparing')}
                              className="w-full"
                              size="sm"
                            >
                              بدء التحضير
                            </Button>
                          )}
                          
                          {order.status === 'preparing' && (
                            <Button
                              onClick={() => handleStatusUpdate(order.id, 'delivered')}
                              className="w-full"
                              size="sm"
                            >
                              تم التوصيل
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => openInMaps(order.latitude, order.longitude, order.deliveryAddress)}
                          >
                            عرض الموقع
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}