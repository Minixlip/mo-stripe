'use client';

import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  TransferIcon,
} from '@/components/landing/ui';

export type ActionMode = 'deposit' | 'withdraw' | 'transfer';

type AccountActionConsoleProps = {
  activeMode: ActionMode;
  onOpen: (mode: ActionMode) => void;
};

export function getActionMode(value: string | null): ActionMode {
  if (value === 'deposit' || value === 'withdraw' || value === 'transfer') {
    return value;
  }

  return 'deposit';
}

export function AccountActionConsole({
  activeMode,
  onOpen,
}: AccountActionConsoleProps) {
  return (
    <div
      id="action-console"
      className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] p-5"
    >
      <div className="mono-ui flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/65">
        <span>Quick actions</span>
        <span>dialog mode</span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onOpen('deposit')}
          className={[
            'mono-ui inline-flex items-center justify-center gap-3 border px-4 py-4 text-[13px] uppercase tracking-[0.12em] transition-colors duration-150',
            activeMode === 'deposit'
              ? 'border-[#0A0A0A] bg-[#F4F3EF] text-[#0A0A0A]'
              : 'border-[#0A0A0A] bg-[rgba(255,255,255,0.82)] text-[#0A0A0A] hover:bg-[#FFFFFF]',
          ].join(' ')}
        >
          <ArrowRightIcon className="h-3.5 w-3.5 rotate-[-45deg]" />
          Deposit
        </button>

        <button
          type="button"
          onClick={() => onOpen('withdraw')}
          className={[
            'mono-ui inline-flex items-center justify-center gap-3 border px-4 py-4 text-[13px] uppercase tracking-[0.12em] transition-colors duration-150',
            activeMode === 'withdraw'
              ? 'border-[#0A0A0A] bg-[#F4F3EF] text-[#0A0A0A]'
              : 'border-[#0A0A0A] bg-[rgba(255,255,255,0.82)] text-[#0A0A0A] hover:bg-[#FFFFFF]',
          ].join(' ')}
        >
          <ArrowUpRightIcon className="h-3.5 w-3.5" />
          Withdraw
        </button>

        <button
          type="button"
          onClick={() => onOpen('transfer')}
          className={[
            'mono-ui inline-flex items-center justify-center gap-3 border px-4 py-4 text-[13px] uppercase tracking-[0.12em] transition-colors duration-150',
            activeMode === 'transfer'
              ? 'border-[#0A0A0A] bg-[#C7F000] text-[#0A0A0A]'
              : 'border-[#0A0A0A] bg-[rgba(255,255,255,0.82)] text-[#0A0A0A] hover:bg-[#FFFFFF]',
          ].join(' ')}
        >
          <TransferIcon className="h-4 w-4" />
          Transfer
        </button>
      </div>

      <div className="mt-5 space-y-4 border-t border-[#0A0A0A] pt-5">
        <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/58">
          Focused execution
        </div>
        <p className="text-[14px] leading-6 text-[#0A0A0A]/65">
          Actions open in a dedicated modal so the ledger surface stays readable
          while the write flow stays explicit.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border border-[#0A0A0A] bg-[#F4F3EF]/72 px-3 py-3">
            <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
              Deposit
            </div>
            <div className="mt-2 text-[13px] leading-6 text-[#0A0A0A]/70">
              Credit your account in GBP.
            </div>
          </div>
          <div className="border border-[#0A0A0A] bg-[#F4F3EF]/72 px-3 py-3">
            <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
              Withdraw
            </div>
            <div className="mt-2 text-[13px] leading-6 text-[#0A0A0A]/70">
              Overdraft checks happen at commit time.
            </div>
          </div>
          <div className="border border-[#0A0A0A] bg-[#F4F3EF]/72 px-3 py-3">
            <div className="mono-ui text-[10px] uppercase tracking-[0.14em] text-[#0A0A0A]/48">
              Transfer
            </div>
            <div className="mt-2 text-[13px] leading-6 text-[#0A0A0A]/70">
              Move funds to another registered user.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
