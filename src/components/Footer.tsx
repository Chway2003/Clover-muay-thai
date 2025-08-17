'use client';
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Classes', href: '/classes' },
    { name: 'Trainers', href: '/trainers' },
    { name: 'Contact', href: '/contact' }
  ];

  const classTypes = [
    'Beginner Muay Thai',
    'Intermediate Training',
    'Advanced Techniques',
    'Kids Programs',
    'Private Sessions'
  ];

  const contactInfo = [
    '14 Miltown Road',
    'Dublin 6 (Behind Autovision)',
    'Eircode: D06 AK57',
    'Ireland',
    'Phone: +353 83 372 6141',
    'Email: clovermuaythai@gmail.com'
  ];

  const socialLinks = [
    { name: 'Instagram', icon: 'instagram', href: 'https://instagram.com/clover_muaythai' }
  ];

  return (
    <footer className="bg-clover-green border-t border-clover-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-clover-gold font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white hover:text-clover-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Class Types */}
          <div>
            <h4 className="text-clover-gold font-bold text-lg mb-4">Class Types</h4>
            <ul className="space-y-2">
              {classTypes.map((classType) => (
                <li key={classType}>
                  <Link
                    href="/classes"
                    className="text-white hover:text-clover-gold transition-colors duration-300 cursor-pointer"
                  >
                    {classType}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-clover-gold font-bold text-lg mb-4">Contact Info</h4>
            <div className="space-y-2 text-white text-sm">
              {contactInfo.map((info, index) => (
                <p key={index}>{info}</p>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-clover-gold font-bold text-lg mb-4">Stay Updated</h4>
            <p className="text-white text-sm mb-4">
              Subscribe to our newsletter for class updates and special offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 bg-white/10 border border-clover-gold/30 rounded-lg text-white placeholder-white/60 focus:border-clover-gold focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="w-full bg-clover-gold text-clover-green px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-clover-gold/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-white text-sm">
              © {currentYear} Clover Muay Thai. All rights reserved.
            </div>
            
                         {/* Social Media */}
             <div className="flex space-x-4">
               {socialLinks.map((social) => (
                 <a
                   key={social.name}
                   href={social.href}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-10 h-10 bg-clover-gold rounded-full flex items-center justify-center hover:bg-yellow-400 transition-all duration-300"
                 >
                   <svg className="w-5 h-5 text-clover-green" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                   </svg>
                 </a>
               ))}
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
