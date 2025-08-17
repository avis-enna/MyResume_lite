'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MonochromeIcon from './icons/MonochromeIcon';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/experience', label: 'Experience' },
    { href: '/projects', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-semibold text-lg text-gray-900">
            Siva Reddy
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900"
              aria-label="Open mobile menu"
            >
              <MonochromeIcon name="menu" size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
