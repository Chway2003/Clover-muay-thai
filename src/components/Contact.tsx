'use client';
import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    classType: 'beginner'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Structured data for business location
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Clover Muay Thai",
    "description": "Professional Muay Thai training facility in Dublin",
    "url": "https://clovermuaythai.com",
    "telephone": "+353 83 372 6141",
    "email": "clovermuaythai@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "14 Miltown Road",
      "addressLocality": "Dublin",
      "postalCode": "D06 AK57",
      "addressCountry": "IE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 53.3225,
      "longitude": -6.2675
    },
    "openingHours": [
      "Mo-Th 18:30-21:30",
      "Fr 18:30-20:00"
    ],
    "sameAs": [
      "https://instagram.com/clover_muaythai"
    ]
  };

  // Inject structured data into page head
  React.useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Using FormSubmit service to send emails
      const response = await fetch('https://formsubmit.co/clovermuaythai@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          classType: formData.classType,
          _subject: `New Contact Form Submission from ${formData.name}`,
          _captcha: false
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          classType: 'beginner'
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-clover-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Contact Us
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Ready to start your Muay Thai journey? Contact us today for a free consultation and trial session
          </p>
          <div className="w-24 h-1 bg-clover-gold mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Contact Information</h3>
              <p className="text-gray-200 text-lg leading-relaxed mb-8">
                Visit our state-of-the-art facility or reach out to us for any questions about our programs.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-clover-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-clover-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">Address</h4>
                  <p className="text-gray-300 leading-relaxed">
                    14 Miltown Road<br />
                    Dublin 6 (Behind Autovision)<br />
                    Eircode: D06 AK57<br />
                    Ireland
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-clover-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-clover-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">Phone</h4>
                  <p className="text-gray-300">+353 83 372 6141</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-clover-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-clover-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">Email</h4>
                  <p className="text-gray-300">clovermuaythai@gmail.com</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-clover-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-clover-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">Hours</h4>
                  <p className="text-gray-300">
                    Monday - Thursday: 6:30 PM - 9:30 PM<br />
                    Friday: 6:30 PM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>

                         {/* Social Media */}
             <div>
               <h4 className="text-white font-semibold text-lg mb-4">Follow Us</h4>
               <div className="flex space-x-4">
                 <a
                   href="https://instagram.com/clover_muaythai"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-12 h-12 bg-clover-gold rounded-lg flex items-center justify-center hover:bg-yellow-400 transition-all duration-300"
                 >
                   <svg className="w-6 h-6 text-clover-green" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                   </svg>
                 </a>
               </div>
             </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-clover-gold focus:ring-2 focus:ring-clover-gold/20 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-clover-gold focus:ring-2 focus:ring-clover-gold/20 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-white font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-clover-gold focus:ring-2 focus:ring-clover-gold/20 transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="classType" className="block text-white font-medium mb-2">
                    Class Type
                  </label>
                  <select
                    id="classType"
                    name="classType"
                    value={formData.classType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-clover-gold focus:ring-2 focus:ring-clover-gold/20 transition-all duration-300"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="kids">Kids Muay Thai</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-clover-gold focus:ring-2 focus:ring-clover-gold/20 transition-all duration-300 resize-none"
                  placeholder="Tell us about your goals and any questions you have..."
                />
              </div>

                             <button
                 type="submit"
                 disabled={isSubmitting}
                 className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                   isSubmitting 
                     ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                     : 'bg-clover-gold text-clover-green hover:shadow-lg transform hover:scale-105'
                 }`}
               >
                 {isSubmitting ? 'Sending...' : 'Send Message'}
               </button>

               {/* Status Messages */}
               {submitStatus === 'success' && (
                 <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-center">
                   ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
                 </div>
               )}
               
               {submitStatus === 'error' && (
                 <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-center">
                   ❌ There was an error sending your message. Please try again or contact us directly at clovermuaythai@gmail.com
                 </div>
               )}
            </form>
          </div>
        </div>

                 {/* Map Section */}
         <div className="mt-20">
           <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
             <h3 className="text-2xl font-bold text-white mb-6 text-center">Find Us</h3>
             
             {/* Location Link */}
             <div className="text-center mb-6">
               <a
                 href="https://maps.google.com/?q=14+Miltown+Road+Dublin+6+D06+AK57+Ireland"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center space-x-3 bg-clover-gold text-clover-green px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
               >
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                 </svg>
                 <span>📍 14 Miltown Road, Dublin 6 D06 AK57</span>
               </a>
             </div>
             
             <div className="aspect-video rounded-2xl overflow-hidden">
               <iframe
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2381.5!2d-6.2675!3d53.3225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e80ea27ac2f%3A0xa00c7a997309672!2s14+Miltown+Rd%2C+Dublin+6%2C+D06+AK57%2C+Ireland!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                 width="100%"
                 height="100%"
                 style={{ border: 0 }}
                 allowFullScreen
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Clover Muay Thai Location"
                 className="w-full h-full"
               ></iframe>
             </div>
             <div className="mt-4 text-center">
               <a
                 href="https://maps.google.com/?q=14+Miltown+Road+Dublin+6+D06+AK57+Ireland"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center space-x-2 text-clover-gold hover:text-yellow-400 transition-colors duration-300"
               >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                 </svg>
                 <span>Open in Google Maps</span>
               </a>
             </div>
           </div>
         </div>
      </div>
    </section>
  );
};

export default Contact;
