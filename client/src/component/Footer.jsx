import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

function Footer() {
  return (
    <footer className="w-full bg-[#131517] border-t border-white/[0.03] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand & Info */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-white hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            nexus<span className="text-white/50 font-normal">+</span>
          </Link>
          <p className="text-[11px] text-white/30 text-center md:text-left max-w-xs">
            Connecting communities, hosting extraordinary experiences, and building network spaces.
          </p>
        </div>

        {/* Middle: Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-white/50">
          <Link to="/" className="hover:text-white transition-colors">
            Discover
          </Link>
          <Link to="/createevent" className="hover:text-white transition-colors">
            Host Event
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Support
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
        </div>

        {/* Right: Social Icons & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/20">
            <span>© {new Date().getFullYear()} Nexus. Made with</span>
            <svg className="w-3 h-3 text-red-500/60 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>for the web.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
