'use client';

import { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type AccountDialogProps = {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AccountDialog({
  open,
  onClose,
  eyebrow,
  title,
  subtitle,
  children,
}: AccountDialogProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="account-dialog-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.18, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,10,10,0.28)] px-4 py-6 backdrop-blur-[3px] sm:px-6"
          onClick={onClose}
        >
          <motion.div
            aria-describedby={subtitle ? `${titleId}-subtitle` : undefined}
            aria-labelledby={titleId}
            aria-modal="true"
            role="dialog"
            initial={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 24, scale: 0.975, filter: 'blur(6px)' }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.985, filter: 'blur(4px)' }
            }
            transition={{
              duration: reduceMotion ? 0.01 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-[760px] overflow-hidden border border-[#0A0A0A] bg-[#F4F3EF] shadow-[8px_8px_0_#0A0A0A]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mono-ui flex items-start justify-between gap-4 border-b border-[#0A0A0A] px-5 py-5 text-[#0A0A0A]">
              <div className="space-y-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
                  {eyebrow}
                </div>
                <div>
                  <h2
                    id={titleId}
                    className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[0.94] tracking-[-0.07em]"
                  >
                    {title}
                  </h2>
                  {subtitle ? (
                    <p
                      id={`${titleId}-subtitle`}
                      className="mt-3 max-w-[34rem] text-[15px] leading-7 text-[#0A0A0A]/62"
                    >
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="mono-ui inline-flex h-11 min-w-11 items-center justify-center border border-[#0A0A0A] bg-[rgba(255,255,255,0.82)] px-3 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A] transition-colors duration-150 hover:bg-[#FFFFFF]"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(100vh-11rem)] overflow-y-auto p-5 sm:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
