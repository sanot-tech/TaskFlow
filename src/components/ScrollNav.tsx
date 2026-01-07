"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ScrollNavProps {
  className?: string;
}

export const ScrollNav: React.FC<ScrollNavProps> = ({ className }) => {
  const scrollToNext = () => {
    const sections = document.querySelectorAll('section, .task-card');
    const currentScroll = window.scrollY;
    
    for (let section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top > 50) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const scrollToPrev = () => {
    const sections = document.querySelectorAll('section, .task-card');
    const currentScroll = window.scrollY;
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top < -50) {
        sections[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={cn("fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2", className)}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          onClick={scrollToPrev}
          className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white p-0"
          size="icon"
          aria-label="Scroll up"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full shadow-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground p-0"
          size="icon"
          aria-label="Scroll to top"
          title="Наверх"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          onClick={scrollToNext}
          className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white p-0"
          size="icon"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
};