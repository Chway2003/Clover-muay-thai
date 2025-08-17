'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-clover-green/95 backdrop-blur-md border-b border-clover-gold/20 shadow-lg' 
        : 'bg-clover-green/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group" onClick={closeMobileMenu}>
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 overflow-hidden rounded-lg">
              <Image
                src="/clovermya.jpg"
                alt="Clover Muay Thai"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span className="text-lg lg:text-xl font-bold text-white font-display">
              Clover Muay Thai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-clover-gold transition-colors duration-200 font-medium text-sm relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-clover-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-clover-gold transition-colors duration-200 font-medium text-sm relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-clover-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/classes"
              className="text-white hover:text-clover-gold transition-colors duration-200 font-medium text-sm relative group"
            >
              Classes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-clover-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/trainers"
              className="text-white hover:text-clover-gold transition-colors duration-200 font-medium text-sm relative group"
            >
              Trainers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-clover-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contact"
              className="text-white hover:text-clover-gold transition-colors duration-200 font-medium text-sm relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-clover-gold transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contact"
              className="bg-clover-gold text-clover-green px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Join Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
          <div className="py-4 space-y-2 border-t border-white/10">
            <Link
              href="/"
              className="block w-full text-left text-white hover:text-clover-gold transition-colors duration-200 font-medium py-3 px-4 hover:bg-white/5 rounded-lg"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block w-full text-left text-white hover:text-clover-gold transition-colors duration-200 font-medium py-3 px-4 hover:bg-white/5 rounded-lg"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link
              href="/classes"
              className="block w-full text-left text-white hover:text-clover-gold transition-colors duration-200 font-medium py-3 px-4 hover:bg-white/5 rounded-lg"
              onClick={closeMobileMenu}
            >
              Classes
            </Link>
            <Link
              href="/trainers"
              className="block w-full text-left text-white hover:text-clover-gold transition-colors duration-200 font-medium py-3 px-4 hover:bg-white/5 rounded-lg"
              onClick={closeMobileMenu}
            >
              Trainers
            </Link>
            <Link
              href="/contact"
              className="block w-full text-left text-white hover:text-clover-gold transition-colors duration-200 font-medium py-3 px-4 hover:bg-white/5 rounded-lg"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="block w-full text-center bg-clover-gold text-clover-green py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 mt-4"
              onClick={closeMobileMenu}
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
