import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaBars, FaTimes, FaTwitter, FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';

// Navigation Link Component
const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ href, children, className = '', onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={`px-4 py-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 font-medium ${className}`}
  >
    {children}
  </a>
);

// CTA Button Component
const CTAButton: React.FC<{
  href: string;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}> = ({ href, variant, children, className = '' }) => {
  const baseClasses = "px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = variant === 'primary'
    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl focus:ring-blue-500"
    : "border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white focus:ring-blue-500";

  return (
    <a
      href={href}
      className={`${baseClasses} ${variantClasses} ${className}`}
      role="button"
    >
      {children}
    </a>
  );
};

// Footer Link Component
const FooterLink: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
  >
    {children}
  </a>
);

// Social Link Component
const SocialLink: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
}> = ({ href, icon, label }) => (
  <a
    href={href}
    aria-label={label}
    className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-all duration-300 transform hover:scale-110"
  >
    {icon}
  </a>
);

const LandingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' }
  ];

  const footerLinks = {
    product: [
      { href: '#features', label: 'Features' },
      { href: '#pricing', label: 'Pricing' },
      { href: '#integrations', label: 'Integrations' },
      { href: '#api', label: 'API' }
    ],
    company: [
      { href: '#about', label: 'About Us' },
      { href: '#careers', label: 'Careers' },
      { href: '#blog', label: 'Blog' },
      { href: '#press', label: 'Press' }
    ],
    support: [
      { href: '#help', label: 'Help Center' },
      { href: '#contact', label: 'Contact' },
      { href: '#status', label: 'Status' },
      { href: '#security', label: 'Security' }
    ],
    legal: [
      { href: '#privacy', label: 'Privacy Policy' },
      { href: '#terms', label: 'Terms of Service' },
      { href: '#cookies', label: 'Cookie Policy' },
      { href: '#gdpr', label: 'GDPR' }
    ]
  };

  const socialLinks = [
    { href: 'https://twitter.com/budgettask', icon: <FaTwitter />, label: 'Twitter' },
    { href: 'https://facebook.com/budgettask', icon: <FaFacebook />, label: 'Facebook' },
    { href: 'https://linkedin.com/company/budgettask', icon: <FaLinkedin />, label: 'LinkedIn' },
    { href: 'https://github.com/budgettask', icon: <FaGithub />, label: 'GitHub' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BT</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BudgetTask
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
              
              <div className="flex items-center space-x-4 ml-8">
                <NavLink href="/login" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  Login
                </NavLink>
                
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  <span className="text-xl">
                    {theme === 'light' ? '🌙' : '☀️'}
                  </span>
                </button>
                
                <CTAButton href="/register" variant="primary">
                  Get Started
                </CTAButton>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                aria-label="Toggle theme"
              >
                <span className="text-xl">
                  {theme === 'light' ? '🌙' : '☀️'}
                </span>
              </button>
              
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2 px-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    {link.label}
                  </NavLink>
                ))}
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <NavLink
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Login
                  </NavLink>
                  <div className="mt-4">
                    <CTAButton href="/register" variant="primary" className="w-full text-center">
                      Get Started
                    </CTAButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 pt-20 pb-8">
        <div className="container mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BT</span>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BudgetTask
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Empowering individuals and businesses to take control of their financial future with intelligent budgeting, task management, and savings tools.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <SocialLink key={social.href} {...social} />
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-12">
            <div className="max-w-2xl mx-auto text-center">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Stay Updated
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get the latest financial tips, product updates, and exclusive offers delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                &copy; 2024 BudgetTask. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Made with ❤️ for your financial success
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;