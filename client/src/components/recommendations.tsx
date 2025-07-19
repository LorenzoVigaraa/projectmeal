import { Card, CardContent } from "@/components/ui/card";

export default function Recommendations() {
  return (
    <Card className="mt-12">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          <svg className="inline w-6 h-6 text-orange-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          توصيات صحية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center mb-3">
              <span className="text-blue-500 text-lg ml-2">💧</span>
              <h3 className="font-semibold text-gray-900">الترطيب</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">تذكر شرب 8 أكواب ماء يوميًا لصحة أفضل</p>
            <div className="flex items-center text-xs text-blue-600">
              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>3 / 8 أكواب اليوم</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center mb-3">
              <span className="text-green-500 text-lg ml-2">🥬</span>
              <h3 className="font-semibold text-gray-900">الخضروات</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">أضف المزيد من الخضروات الورقية الخضراء</p>
            <div className="flex items-center text-xs text-green-600">
              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>اقتراحات: السبانخ، الجرجير</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center mb-3">
              <span className="text-orange-500 text-lg ml-2">⏰</span>
              <h3 className="font-semibold text-gray-900">التوقيت</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">الوقت المثالي لتناول هذه الوجبة هو الغداء</p>
            <div className="flex items-center text-xs text-orange-600">
              <span className="text-orange-500 ml-1">☀️</span>
              <span>12:00 - 2:00 مساءً</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
