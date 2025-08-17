'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-clover-green relative pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        {/* Logo */}
        <div className="mb-8 flex justify-center animate-fade-in">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 group">
            <Image
              src="/clovermya.jpg"
              alt="Clover Muay Thai Logo"
              fill
              className="object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 rounded-2xl bg-clover-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>

        {/* Club Name */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 font-display animate-slide-up">
          Clover Muay Thai
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
          Master the art of Muay Thai in a supportive, professional environment. 
          From beginners to advanced fighters, discover your potential.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in animation-delay-400">
          <Link
            href="/contact"
            className="inline-block bg-clover-gold text-clover-green px-8 py-4 text-lg font-bold rounded-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-clover-gold/30 border-2 border-transparent hover:border-clover-gold/50"
          >
            Join Now
          </Link>
        </div>



        {/* Quick Navigation */}
        <div className="mt-16 flex flex-wrap justify-center gap-4 animate-fade-in animation-delay-800">
          <Link
            href="/about"
            className="px-6 py-3 border-2 border-clover-gold text-clover-gold rounded-lg hover:bg-clover-gold hover:text-clover-green transition-all duration-300 transform hover:scale-105"
          >
            Learn More
          </Link>
          <Link
            href="/classes"
            className="px-6 py-3 border-2 border-clover-gold text-clover-gold rounded-lg hover:bg-clover-gold hover:text-clover-green transition-all duration-300 transform hover:scale-105"
          >
            View Classes
          </Link>
          <Link
            href="/trainers"
            className="px-6 py-3 border-2 border-clover-gold text-clover-gold rounded-lg hover:bg-clover-gold hover:text-clover-green transition-all duration-300 transform hover:scale-105"
          >
            Meet Trainers
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 border-2 border-clover-gold rounded-full flex justify-center">
          <div className="w-1 h-3 bg-clover-gold rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
