import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ScrollNavProps {
  className?: string;
}

export const ScrollNav: React.FC<ScrollNavProps> = ({ className }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollUp = () => {
    window.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
  };

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div className={cn("fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3", className)}>
      {/* Scroll to Top */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          onClick={scrollToTop}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-cyan-500 border-2 border-cyan-300/50 shadow-lg"
          size="icon"
          aria-label="Scroll to top"
          title="Наверх"
        >
          <ChevronUp className="h-7 w-7" />
        </Button>
      </motion.div>

      {/* Scroll Up a Frame */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          onClick={scrollUp}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-orange-500 border-2 border-orange-300/50 shadow-lg"
          size="icon"
          aria-label="Scroll up"
          title="Вверх"
        >
          <ChevronUp className="h-7 w-7" />
        </Button>
      </motion.div>

      {/* Scroll Down a Frame */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button
          onClick={scrollDown}
          className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-green-500 border-2 border-green-300/50 shadow-lg"
          size="icon"
          aria-label="Scroll down"
          title="Вниз"
        >
          <ChevronDown className="h-7 w-7" />
        </Button>
      </motion.div>
    </div>
  );
};
