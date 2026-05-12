import React from 'react';
import { motion } from 'motion/react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  dark?: boolean;
  align?: 'left' | 'center';
  noMargin?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  dark = false, 
  align = 'center',
  noMargin = false 
}) => {
  return (
    <div className={`${noMargin ? 'mb-0' : 'mb-16 md:mb-24'} px-4 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`text-2xl md:text-4xl font-extrabold mb-6 tracking-tight font-display ${dark ? 'text-white' : 'text-slate-900'}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`${dark ? 'text-blue-100' : 'text-slate-500'} ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-3xl'} text-lg`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
