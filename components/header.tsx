'use client';

import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, ChevronDown, User, LogOut, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Quick Lead Popup states
  const [showQuickPopup, setShowQuickPopup] = useState(false);
  const [quickForm, setQuickForm] = useState({ name: '', mobile: '', city: '', kw: '' });
  const [quickSubmitted, setQuickSubmitted] = useState(false);

  useEffect(() => {
    // Check login status on mount and when storage changes
    const checkLoginStatus = () => {
      const loggedIn = sessionStorage.getItem('employeeLoggedIn') === 'true';
      const data = loggedIn ? JSON.parse(sessionStorage.getItem('employeeData') || '{}') : null;

      // Only show for employee and installer roles
      if (loggedIn && data && (data.role === 'employee' || data.role === 'installer')) {
        setIsLoggedIn(true);
        setUserData(data);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkLoginStatus();

    // Listen for storage changes
    const handleStorageChange = () => checkLoginStatus();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('employeeLoggedIn');
    sessionStorage.removeItem('employeeData');
    setIsLoggedIn(false);
    setUserData(null);
    window.location.href = '/';
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/quick-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quickForm,
          type: 'quick-lead',
          createdAt: new Date().toISOString(),
        }),
      });
      setQuickSubmitted(true);
      setTimeout(() => {
        setShowQuickPopup(false);
        setQuickSubmitted(false);
        setQuickForm({ name: '', mobile: '', city: '', kw: '' });
      }, 1500);
    } catch (error) {
      console.error('Error submitting quick lead:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-muted shadow-sm">
      {/* Top Contact Bar */}
      <div className="bg-primary text-white text-xs sm:text-sm py-1.5 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Phone & Email */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-white/90">
            <a href="tel:9695902026" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone className="w-3.5 h-3.5" /> 9695902026
            </a>
            <span className="text-white/40">|</span>
            <a href="tel:9935857010" className="flex items-center gap-1 hover:text-secondary transition-colors">
              9935857010
            </a>
            <span className="hidden sm:inline text-white/40">|</span>
            <a href="mailto:gargeeenterprisesmld@gmail.com" className="hidden sm:flex items-center gap-1 hover:text-secondary transition-colors">
              <Mail className="w-3.5 h-3.5" /> gargeeenterprisesmld@gmail.com
            </a>
          </div>

          {/* Right: Get Started Quick Popup */}
          <button
            onClick={() => setShowQuickPopup(true)}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-3 sm:px-4 py-1 rounded-md text-xs sm:text-sm font-semibold transition flex items-center gap-1 shadow-sm"
          >
            Get Started
          </button>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center w-56 h-16 gap-2">
            <Image
              src="/gargeelogonobg.png"
              alt="Gargee Solar Logo"
              width={180}
              height={120}
              className="h-16 w-auto object-contain"
              suppressHydrationWarning
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition">
              {t.nav.home}
            </Link>
            <Link href="#services" className="text-foreground hover:text-primary transition">
              {t.nav.services}
            </Link>
            <Link href="#projects" className="text-foreground hover:text-primary transition">
              {t.nav.projects}
            </Link>
            <Link href="#brands" className="text-foreground hover:text-primary transition">
              {t.nav.brands}
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary transition">
              {t.nav.contact}
            </Link>
          </div>

           {/* Login & Menu */}
           <div className="flex items-center gap-4">
            {isLoggedIn && userData ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm font-medium">Hello, {userData.name}</span>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex">
                    <User className="w-4 h-4 mr-2" />
                    Login
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/admin-login">Admin</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/employee-login">Employee</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/installer-login">Engineer</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {isLoggedIn && userData ? (
              <div className="md:hidden flex items-center gap-2">
                <span className="text-sm font-medium">Hello, {userData.name}</span>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <User className="w-4 h-4 mr-2" />
                    Login
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/admin-login">Admin</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/employee-login">Employee</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/installer-login">Engineer</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mt-4 pb-4 md:hidden space-y-3 border-t pt-4">
            <Link
              href="#home"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.home}
            </Link>
            <Link
              href="#services"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.services}
            </Link>
            <Link
              href="/projects"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.projects}
            </Link>
            <Link
              href="#brands"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.brands}
            </Link>
            <Link
              href="#contact"
              className="block text-foreground hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.contact}
            </Link>
          </div>
        )}
      </nav>

      {/* Quick Lead Popup Modal */}
      {showQuickPopup && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setShowQuickPopup(false);
                setQuickSubmitted(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {quickSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Thank You!</h3>
                <p className="text-foreground/70">We will contact you soon.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-primary mb-2">Get Free Quote</h3>
                <p className="text-foreground/70 mb-4">Fill details and we will call you</p>

                <form onSubmit={handleQuickSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Name *"
                      value={quickForm.name}
                      onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                      required
                      className="w-full text-gray-800 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Mobile Number *"
                      value={quickForm.mobile}
                      onChange={(e) => setQuickForm({ ...quickForm, mobile: e.target.value })}
                      required
                      className="w-full text-gray-800 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="City *"
                      value={quickForm.city}
                      onChange={(e) => setQuickForm({ ...quickForm, city: e.target.value })}
                      required
                      className="w-full text-gray-800 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Solar Required (in kW)"
                      value={quickForm.kw}
                      onChange={(e) => setQuickForm({ ...quickForm, kw: e.target.value })}
                      className="w-full text-gray-800 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-white hover:bg-primary/90 py-3"
                  >
                    Submit
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
