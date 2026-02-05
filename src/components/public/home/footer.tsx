'use client';

import React from 'react';
import { ShieldCheck, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-black tracking-tight">SmartSurveyor</span>
            </div>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Empowering landowners and professionals with high-precision digital surveying solutions across Bangladesh.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Quick Links</h4>
            <ul className="space-y-4">
              {['About Us', 'Services', 'Find Surveyor', 'Pricing', 'Testimonials'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground font-semibold hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Legal</h4>
            <ul className="space-y-4">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Security', 'Compliance'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground font-semibold hover:text-primary transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground font-semibold">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@smartsurveyor.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground font-semibold">
                <Phone className="h-5 w-5 text-primary" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-muted-foreground/60">
            © 2026 SmartSurveyor. Built with precision for the future.
          </p>
          <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-muted-foreground/40">
            <span>All Rights Reserved</span>
            <span>Made in Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
