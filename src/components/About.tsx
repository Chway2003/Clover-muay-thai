'use client';
import React from 'react';
import Link from 'next/link';

const About = () => {
  return (
    <section className="section bg-clover-green">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            About Clover Muay Thai
          </h2>
          <div className="section-divider"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 fade-in">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Where Tradition Meets Modern Excellence
              </h3>
                             <p className="text-lg text-gray-200 leading-relaxed">
                 Welcome to Clover Muay Thai, where Muay Thai enthusiasts come together to train, learn, and grow. 
                 Our club is dedicated to providing authentic Muay Thai training in a supportive and professional environment.
               </p>
               <p className="text-lg text-gray-200 leading-relaxed">
                 Whether you're a complete beginner or an experienced fighter, our classes are designed to help you 
                 develop your skills, build confidence, and achieve your martial arts goals. Join our community of 
                 passionate Muay Thai practitioners.
               </p>
            </div>

            {/* Class Schedule */}
            <div className="pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Weekly Class Schedule</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-clover-gold rounded-full"></div>
                  <span className="text-gray-200">Monday - Thursday: 6:30 PM - 7:30 PM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-clover-gold rounded-full"></div>
                  <span className="text-gray-200">Monday - Thursday: 7:45 PM - 8:45 PM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-clover-gold rounded-full"></div>
                  <span className="text-gray-200">Friday: 6:30 PM - 7:30 PM (Sparring)</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/classes" className="btn-primary">
                View Our Classes
              </Link>
              <Link href="/contact" className="btn-outline">
                Get In Touch
              </Link>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative slide-up">
            <div className="card p-8">
              {/* Gym image */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img 
                  src="/gym-image.jpg" 
                  alt="Clover Muay Thai Training Facility" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
