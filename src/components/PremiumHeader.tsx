import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Zap, Target, Settings, User, Smile, HelpCircle } from "lucide-react";
import { ProfileComponentsWrapper } from "./ProfileComponentsWrapper";

interface PremiumHeaderProps {
  profile: any;
  isLoading: boolean;
  letterFonts: string[];
}

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({ 
  profile, 
  isLoading, 
  letterFonts 
}) => {
  return (
    <header className="w-full max-w-6xl flex justify-center items-center mb-8 quantum-symmetry quantum-depth quantum-metallographic flex-center-all">
      <div className="flex flex-col items-center w-full flex-center-all">
        {/* Main Title and Navigation Buttons */}
        <div className="flex flex-col items-center mb-6 w-full flex-center-all">
          <div className="flex items-center justify-center space-x-6 mb-4 flex-center-all">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="flex-center-all"
            >
              <h1 className="text-4xl font-bold text-primary flex items-center space-x-2 select-none relative group quantum-animated flex-center-all">
                {/* Animated border with shimmer effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shimmer flex-center-all"></div>
                <div className="relative z-10 border-2 border-primary rounded-lg px-4 py-2 bg-background/30 backdrop-blur-sm shadow-lg flex-center-all">
                  <div className="flex items-center space-x-2 flex-center-all">
                    <motion.span
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                      className="flex-center-all"
                    >
                      <Zap className="h-8 w-8 text-yellow-500 flex-center-all" />
                    </motion.span>
                    <span className="flex font-google-sans-flex-medium flex-center-all">
                      {"TodoList".split("").map((letter, index) => (
                        <motion.span
                          key={index}
                          style={{ fontFamily: `${letterFonts[index]}, sans-serif` }}
                          className="transition-all duration-500 ease-in-out inline-block select-none flex-center-all"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </span>
                    <motion.span
                      animate={{ rotate: [0, -5, 0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                      className="flex-center-all"
                    >
                      <Target className="h-8 w-8 text-blue-500 flex-center-all" />
                    </motion.span>
                  </div>
                </div>
              </h1>
            </motion.div>
            
            {/* Profile Section */}
            <div className="flex-center-all">
              <ProfileComponentsWrapper profile={profile} isLoading={isLoading} />
            </div>
          </div>
          
          {/* Navigation Buttons Row */}
          <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl flex-center-all">
            <Link to="/" className="flex-center-all">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-premium-button flex items-center px-4 py-2 text-sm flex-center-all"
              >
                <BookOpen className="h-4 w-4 mr-2 flex-center-all" /> Home
              </motion.button>
            </Link>
            
            <Link to="/guide" className="flex-center-all">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-premium-button flex items-center px-4 py-2 text-sm flex-center-all"
              >
                <BookOpen className="h-4 w-4 mr-2 flex-center-all" /> Guide
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-premium-button flex items-center px-4 py-2 text-sm flex-center-all"
              onClick={() => document.body.classList.toggle('light')}
            >
              <Settings className="h-4 w-4 mr-2 flex-center-all" /> Theme
            </motion.button>
          </div>
        </div>
        
        {/* Description with subtle background */}
        <motion.div
          className="flex justify-center mb-4 w-full flex-center-all"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="px-4 py-2 bg-primary/10 rounded-lg backdrop-blur-sm border border-primary/20 flex-center-all">
            <p className="text-muted-foreground select-none flex-responsive-text flex-center-all">Your ultimate task management solution for 2025</p>
          </div>
        </motion.div>
      </div>
    </header>
  );
};