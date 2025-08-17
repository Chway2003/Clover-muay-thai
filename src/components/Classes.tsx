'use client';
import React from 'react';

const Classes = () => {
  const memberships = [
    {
      name: 'Standard Membership',
      description: 'Complete access to all Muay Thai training sessions and classes.',
      features: ['All Muay Thai classes', 'Beginner to Advanced levels', 'Sparring sessions', 'Equipment access'],
      schedule: 'All scheduled classes',
      price: '€60/month'
    },
    {
      name: 'Premium Membership',
      description: 'Everything in Standard plus exclusive access to wellness facilities.',
      features: ['All Muay Thai classes', 'Beginner to Advanced levels', 'Sparring sessions', 'Equipment access', 'Sauna access', 'Cold plunge therapy', 'Priority booking'],
      schedule: 'All scheduled classes + Wellness',
      price: '€90/month'
    }
  ];

  return (
    <section id="classes" className="py-20 bg-clover-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Our Memberships
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Choose the perfect membership plan for your Muay Thai journey
          </p>
          <div className="w-24 h-1 bg-clover-gold mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {memberships.map((membership, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-clover-gold/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-clover-gold/20"
            >
              {/* Content */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{membership.name}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{membership.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {membership.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-clover-gold rounded-full flex-shrink-0"></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                                 {/* Schedule & Price */}
                 <div className="pt-4 border-t border-white/10">
                   <div className="text-center space-y-2">
                     <div className="text-2xl font-bold text-white">{membership.price}</div>
                   </div>
                 </div>

                 {/* Timetable */}
                 <div className="pt-4">
                   <h4 className="text-white font-semibold text-sm mb-3 text-center">Class Times</h4>
                   <div className="space-y-2 text-xs text-gray-300">
                     <div className="flex justify-between">
                       <span>Mon - Thu:</span>
                       <span>6:30 PM - 7:30 PM</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Mon - Thu:</span>
                       <span>7:45 PM - 8:45 PM</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Friday:</span>
                       <span>6:30 PM - 8:00 PM (Sparring)</span>
                     </div>
                   </div>
                 </div>

                                                          {/* Payment Info */}
                 <div className="text-center pt-2 space-y-2">
                   <div className="text-clover-gold font-semibold text-sm">Cash Only</div>
                   <div className="text-green-400 font-medium text-sm">First Class Free!</div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Classes;
