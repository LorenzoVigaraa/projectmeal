import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, Home, Package } from 'lucide-react';

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/orders', label: 'الطلبات', icon: Package },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ص</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">صحني</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-2 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-1 space-x-reverse"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}