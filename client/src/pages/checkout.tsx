import { useState, useEffect, useRef } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { MapPin, CreditCard, Banknote, Phone, User, MessageSquare } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import Navigation from '@/components/navigation';
import type { Plate, Order } from '@shared/schema';

const orderFormSchema = z.object({
  customerName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  customerPhone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  deliveryAddress: z.string().min(5, 'العنوان يجب أن يكون مفصلاً أكثر'),
  paymentMethod: z.enum(['cash', 'online'], {
    required_error: 'يرجى اختيار طريقة الدفع',
  }),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

declare global {
  interface Window {
    google: any;
  }
}

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/checkout/:plateId');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const plateId = params?.plateId ? parseInt(params.plateId) : null;

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      deliveryAddress: '',
      paymentMethod: 'cash',
      notes: '',
    },
  });

  // Fetch plate data
  const { data: plate, isLoading: plateLoading } = useQuery({
    queryKey: ['/api/plate', plateId],
    enabled: !!plateId,
  });

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const defaultLocation = { lat: 24.7136, lng: 46.6753 }; // Riyadh, Saudi Arabia
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: defaultLocation,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const markerInstance = new window.google.maps.Marker({
        position: defaultLocation,
        map: mapInstance,
        draggable: true,
        title: 'موقع التوصيل',
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setSelectedLocation(defaultLocation);

      // Add click listener to map
      mapInstance.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        markerInstance.setPosition({ lat, lng });
        setSelectedLocation({ lat, lng });
        
        // Reverse geocoding to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            form.setValue('deliveryAddress', results[0].formatted_address);
          }
        });
      });

      // Add drag listener to marker
      markerInstance.addListener('dragend', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSelectedLocation({ lat, lng });
        
        // Reverse geocoding
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            form.setValue('deliveryAddress', results[0].formatted_address);
          }
        });
      });
    };

    // Load Google Maps API
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=REMOVED&libraries=places&language=ar`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [form]);

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: (order: Order) => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'تم إرسال طلبك بنجاح!',
        description: `رقم الطلب: ${order.id}`,
      });
      
      if (order.paymentMethod === 'online') {
        // Redirect to payment processing (Stripe)
        setLocation('/payment/' + order.id);
      } else {
        // Redirect to order confirmation
        setLocation('/order-confirmation/' + order.id);
      }
    },
    onError: () => {
      toast({
        title: 'خطأ في إرسال الطلب',
        description: 'يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: OrderFormValues) => {
    if (!selectedLocation || !plate) {
      toast({
        title: 'يرجى تحديد الموقع',
        description: 'اختر موقع التوصيل على الخريطة',
        variant: 'destructive',
      });
      return;
    }

    createOrderMutation.mutate({
      plateId: plate.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      paymentMethod: data.paymentMethod,
      totalAmount: plate.totalPrice,
      notes: data.notes || null,
    });
  };

  if (!plateId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">خطأ</CardTitle>
            <CardDescription className="text-center">
              لم يتم العثور على الطبق المحدد
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (plateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <Navigation />
      <div className="container mx-auto px-4 max-w-4xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            إتمام الطلب
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            أدخل معلومات التوصيل وطريقة الدفع
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                ملخص الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              {plate && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{plate.name}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <p className="font-medium">السعرات</p>
                        <p>{plate.totalCalories}</p>
                      </div>
                      <div>
                        <p className="font-medium">البروتين</p>
                        <p>{plate.totalProtein}g</p>
                      </div>
                      <div>
                        <p className="font-medium">السعر</p>
                        <p className="text-green-600 font-bold">{plate.totalPrice.toFixed(2)} ر.س</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          الاسم الكامل
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسمك الكامل" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          رقم الهاتف
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="05xxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          عنوان التوصيل
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="حدد الموقع على الخريطة أو أدخل العنوان يدوياً"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>طريقة الدفع</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value="cash" id="cash" />
                              <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                                <Banknote className="h-4 w-4" />
                                نقداً عند التوصيل
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <RadioGroupItem value="online" id="online" />
                              <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                                <CreditCard className="h-4 w-4" />
                                دفع إلكتروني
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          ملاحظات إضافية (اختياري)
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="أي ملاحظات خاصة للطلب..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Google Maps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>حدد موقع التوصيل</CardTitle>
            <CardDescription>
              اضغط على الخريطة أو اسحب العلامة لتحديد موقع التوصيل الدقيق
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={mapRef} className="w-full h-96 rounded-lg border" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}