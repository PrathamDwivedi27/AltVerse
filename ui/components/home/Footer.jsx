// app/components/Footer.jsx
import { Mail, Twitter, Github, Linkedin, Instagram, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer id='contact' className="w-full py-12 px-4 bg-black text-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Branding */}
        <div>
          <h3 className="text-xl font-bold mb-2">AltVerse</h3>
          <p className="text-sm text-gray-400">Shape Your Universe, Together.</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-2">Contact Us</h3>
          <div className="flex flex-col items-center md:items-start space-y-2">
            <a
              href="mailto:contact@altverse.com"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              contact@altverse.com
            </a>
            <a
              href="tel:+919793629039"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
              +91 97936 29039
            </a>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-bold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="https://github.com/PrathamDwivedi27" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Github />
            </a>
            <a href="https://www.linkedin.com/in/prathamdwivedi/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Instagram />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Twitter />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-8 pt-8 border-t border-gray-800">
        © 2025 AltVerse. All Rights Reserved.
      </div>
    </footer>
  );
}
