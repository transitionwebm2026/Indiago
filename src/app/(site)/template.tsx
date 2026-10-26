'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE, useEntranceAnimation } from '@/lib/motion';

/** Re-mounts on every navigation, giving each page a soft fade-in (skipped on the first load). */
export default function Template({ children }: { children: ReactNode }) {
  const animate = useEntranceAnimation();
  return (
    <motion.div initial={animate ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.7, ease: EASE }}>
      {children}
    </motion.div>
  );
}
