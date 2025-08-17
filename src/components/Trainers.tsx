'use client';
import React from 'react';

const Trainers = () => {
  const trainers = [
    {
      name: 'Ali Mahroug',
      title: 'Instructor & Founder',
      bio: 'Experienced Muay Thai instructor with a passion for teaching authentic techniques. Dedicated to helping students develop both physical skills and mental discipline.',
      achievements: ['Muay Thai Specialist', 'Fitness & Conditioning Expert', '3+ Years Teaching Experience'],
      image: '/trainer1.jpg'
    },
    {
      name: 'Thomas Berghenti',
      title: 'Instructor & Founder',
      bio: 'Skilled Muay Thai coach with expertise in both traditional techniques and modern training methods. Committed to student development and safety.',
      achievements: ['Advanced Muay Thai Techniques', 'Fitness & Conditioning Expert', '5+ Years Teaching Experience'],
      image: '/trainer2.jpg'
    }
  ];

  return (
    <section id="trainers" className="py-20 bg-clover-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Meet Our Trainers
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Learn from world-class instructors with decades of combined experience in Muay Thai and martial arts
          </p>
          <div className="w-24 h-1 bg-clover-gold mx-auto rounded-full mt-6"></div>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-clover-gold/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-clover-gold/20"
            >
              {/* Trainer Image */}
              <div className="text-center mb-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mb-4">
                  <div className="text-center text-gray-400">
                    <svg className="w-12 h-12 mx-auto opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{trainer.name}</h3>
                <p className="text-clover-gold font-semibold text-sm">{trainer.title}</p>
              </div>

              {/* Bio */}
              <p className="text-gray-200 text-sm leading-relaxed mb-4">{trainer.bio}</p>

              {/* Achievements */}
              <div className="space-y-2">
                {trainer.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-clover-gold rounded-full flex-shrink-0"></div>
                    <span className="text-gray-300 text-xs">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;
