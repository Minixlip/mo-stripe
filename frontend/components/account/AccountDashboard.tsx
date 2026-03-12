'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ActivityIcon,
  BranchIcon,
  DownloadIcon,
  ShieldIcon,
} from '@/components/landing/ui';
import type {
  AccountActivityEntry,
  AccountOverview,
  AccountTransactionDetail,
} from '@/lib/account/account';
import {
  AccountActionConsole,
  getActionMode,
  type ActionMode,
} from './AccountActionConsole';
import { AccountActionModal } from './AccountActionModal';
import { AccountTransactionDetailModal } from './AccountTransactionDetailModal';
import { AccountTransactionSurface } from './AccountTransactionSurface';
import {
  compactDateFormatter,
  formatCurrencyFromPence,
  formatNetCurrencyFromPence,
  longDateFormatter,
  maskAccountId,
} from './accountDisplay';

type AccountDashboardProps = {
  overview: AccountOverview;
  history: AccountActivityEntry[];
  initialTransactionDetail: AccountTransactionDetail | null;
};

const utilityCards = [
  {
    label: 'ROLL WINDOW',
    icon: DownloadIcon,
  },
  {
    label: 'TRANSFER BUS',
    icon: ActivityIcon,
  },
  {
    label: 'AUDIT TRAIL',
    icon: BranchIcon,
  },
] as const;

export function AccountDashboard({
  overview,
  history,
  initialTransactionDetail,
}: AccountDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedAction = searchParams.get('action');

  const [actionMode, setActionMode] = useState<ActionMode>(
    getActionMode(requestedAction),
  );
  const [actionModalOpen, setActionModalOpen] = useState(
    requestedAction !== null,
  );
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(
    initialTransactionDetail?.id ?? history[0]?.id ?? null,
  );

  useEffect(() => {
    if (!requestedAction) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete('action');

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [pathname, requestedAction, router, searchParams]);

  const lastSettledAt = history[0]?.createdAt ?? overview.account.createdAt;
  const visibleFlow = history.reduce(
    (total, item) => total + (item.incoming ? item.amount : -item.amount),
    0,
  );
  const recentTransferCount = history.filter((item) => item.type === 'TRANSFER').length;
  const lastExternalCounterparty =
    history.find((item) => item.counterpartyEmail)?.counterpartyEmail ??
    'system bootstrap';

  function openActionModal(mode: ActionMode) {
    setActionMode(mode);
    setActionModalOpen(true);
  }

  function openTransactionModal(transactionId: string) {
    setSelectedTransactionId(transactionId);
    setTransactionModalOpen(true);
  }

  function openLatestTransactionModal() {
    if (!selectedTransactionId && history[0]) {
      setSelectedTransactionId(history[0].id);
    }

    if (selectedTransactionId || history[0]) {
      setTransactionModalOpen(true);
    }
  }

  return (
    <>
      <div className="page-surface min-h-screen">
        <div className="mx-auto flex w-full max-w-[1960px] flex-col px-4 py-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
          <main className="py-5 lg:py-6 xl:py-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="space-y-5">
                <div className="mono-ui inline-flex flex-wrap items-center border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]">
                  <span className="border-r border-[#0A0A0A] px-4 py-3">Dashboard</span>
                  <span className="px-4 py-3">Personal</span>
                </div>

                <div className="max-w-[54rem] space-y-4">
                  <h1 className="text-balance text-[clamp(3.3rem,6vw,5.7rem)] font-semibold leading-[0.92] tracking-[-0.085em] text-[#0A0A0A]">
                    Ledger overview
                  </h1>
                  <p className="max-w-[52rem] text-[clamp(1.2rem,2.5vw,1.95rem)] leading-[1.45] tracking-[-0.05em] text-[#0A0A0A]/52">
                    High-precision balances, a single personal partition, and a
                    live receipt roll. Every amount aligns because every posting
                    is written before the surface reads it.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openActionModal(actionMode)}
                  className="key-press mono-ui inline-flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[#C7F000] px-6 py-4 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A]"
                >
                  Open actions
                </button>

                <button
                  type="button"
                  onClick={openLatestTransactionModal}
                  disabled={!selectedTransactionId && history.length === 0}
                  className="mono-ui inline-flex items-center justify-center gap-3 border border-[#0A0A0A] bg-[rgba(255,255,255,0.7)] px-6 py-4 text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A] transition-colors duration-150 hover:bg-[#FFFFFF] disabled:cursor-not-allowed disabled:text-[#0A0A0A]/32"
                >
                  Transaction details
                </button>
              </div>
            </div>

            <section className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.38fr)_minmax(360px,0.94fr)]">
              <section className="overflow-hidden border border-[#0A0A0A] bg-[rgba(255,255,255,0.52)] backdrop-blur-[2px]">
                <div className="mono-ui flex flex-wrap items-center justify-between gap-3 border-b border-[#0A0A0A] px-5 py-4 text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                  <div className="flex items-center gap-3">
                    <span>Total balance</span>
                    <span className="text-[#0A0A0A]/55">GBP</span>
                  </div>
                  <span className="inline-flex items-center gap-2 border border-[#0A0A0A] bg-[#F4F3EF] px-4 py-3 text-[11px]">
                    <ShieldIcon className="h-3.5 w-3.5" />
                    audited
                  </span>
                </div>

                <div className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
                  <div className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] p-6">
                    <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/62">
                      Current
                    </div>
                    <div className="mt-7 flex items-end gap-3">
                      <span className="mono-ui text-[clamp(2.8rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.08em] text-[#0A0A0A]">
                        {formatCurrencyFromPence(overview.account.balance)}
                      </span>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="border border-[#0A0A0A] bg-[#F4F3EF]/70 px-4 py-4">
                        <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/55">
                          Recent flow
                        </div>
                        <div className="mono-ui mt-4 text-[1.45rem] font-semibold tracking-[-0.05em] text-[#0A0A0A]">
                          {formatNetCurrencyFromPence(visibleFlow)}
                        </div>
                      </div>

                      <div className="border border-[#0A0A0A] bg-[#F4F3EF]/70 px-4 py-4">
                        <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/55">
                          Last settled
                        </div>
                        <div className="mono-ui mt-4 text-[1.45rem] font-semibold tracking-[-0.05em] text-[#0A0A0A]">
                          {compactDateFormatter.format(new Date(lastSettledAt))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 h-px w-full bg-[#0A0A0A]" />
                    <p className="mono-ui mt-6 text-[12px] uppercase tracking-[0.08em] text-[#0A0A0A]/72">
                      Precision mode: pence-backed ledger numerals.
                    </p>
                  </div>

                  <AccountActionConsole
                    activeMode={actionMode}
                    onOpen={openActionModal}
                  />
                </div>

                <div className="border-t border-[#0A0A0A] p-6">
                  <div className="mono-ui flex flex-wrap items-center justify-between gap-3 border border-[#0A0A0A] bg-[#F4F3EF]/70 px-5 py-4 text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/65">
                    <span>Account partition</span>
                    <span className="underline underline-offset-4">primary personal</span>
                  </div>

                  <div className="mt-5 border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-5 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                      <div className="space-y-4">
                        <div className="mono-ui text-[13px] uppercase tracking-[0.12em] text-[#0A0A0A]">
                          Personal ledger
                        </div>
                        <div className="mono-ui text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]/62">
                          {maskAccountId(overview.account.id)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="mono-ui text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A]/55">
                          Balance
                        </div>
                        <div className="mono-ui mt-4 text-[1.9rem] font-semibold tracking-[-0.06em] text-[#0A0A0A]">
                          {formatCurrencyFromPence(overview.account.balance)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 border-t border-[#0A0A0A]/28 pt-5 text-[15px] leading-7 text-[#0A0A0A]/72 sm:grid-cols-2">
                      <p>
                        Opening credit posted on{' '}
                        <span className="mono-ui text-[#0A0A0A]">
                          {longDateFormatter.format(
                            new Date(overview.account.createdAt),
                          )}
                        </span>
                        .
                      </p>
                      <p>
                        Account owner is resolved from the backend session, not
                        from client-supplied identifiers.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {utilityCards.map((card) => {
                      const Icon = card.icon;

                      return (
                        <div
                          key={card.label}
                          className="border border-[#0A0A0A] bg-[rgba(255,255,255,0.62)] px-4 py-5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="mono-ui text-[12px] uppercase tracking-[0.1em] text-[#0A0A0A]">
                              {card.label}
                            </div>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="mt-5 text-[15px] leading-7 text-[#0A0A0A]/72">
                            {card.label === 'ROLL WINDOW'
                              ? `${history.length} entries loaded`
                              : card.label === 'TRANSFER BUS'
                                ? `${recentTransferCount} transfer events`
                                : lastExternalCounterparty}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <AccountTransactionSurface
                history={history}
                accountCreatedAt={overview.account.createdAt}
                email={overview.email}
                selectedTransactionId={selectedTransactionId}
                onOpenTransaction={openTransactionModal}
                onOpenLatestTransaction={openLatestTransactionModal}
              />
            </section>
          </main>
        </div>
      </div>

      <AccountActionModal
        key={actionMode}
        currentEmail={overview.email}
        mode={actionMode}
        open={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
      />

      <AccountTransactionDetailModal
        key={selectedTransactionId ?? history[0]?.id ?? 'empty'}
        open={transactionModalOpen}
        transactionId={selectedTransactionId ?? history[0]?.id ?? null}
        initialTransactionDetail={initialTransactionDetail}
        onClose={() => setTransactionModalOpen(false)}
      />
    </>
  );
}
