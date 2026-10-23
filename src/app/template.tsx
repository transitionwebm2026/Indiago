'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE } from '@/lib/motion';

/** Re-mounts on every navigation, giving each page a soft fade-in transition. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, ease: EASE }}>
      {children}
    </motion.div>
  );
}
