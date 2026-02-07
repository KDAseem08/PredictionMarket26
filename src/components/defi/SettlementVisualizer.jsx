import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

export default function SettlementVisualizer() {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const traders = [
    { name: 'Alice', yesShares: 100, noShares: 0, spent: 65 },
    { name: 'Bob', yesShares: 0, noShares: 150, spent: 52 },
    { name: 'Carol', yesShares: 80, noShares: 0, spent: 48 },
    { name: 'David', yesShares: 0, noShares: 100, spent: 38 },
  ];

  const steps = [
    {
      title: 'Market Active',
      description: 'Traders buy YES and NO shares',
      detail: 'Total liquidity: $1000 | YES holders: 2 | NO holders: 2',
    },
    {
      title: 'Event Occurs',
      description: 'Real-world event happens',
      detail: 'Question: "Will Bitcoin hit $100k?" → Bitcoin reaches $105k ✅',
    },
    {
      title: 'Oracle Reports',
      description: 'Trusted oracle submits outcome to blockchain',
      detail: 'Oracle confirms: YES (Bitcoin reached $100k)',
    },
    {
      title: 'Smart Contract Resolves',
      description: 'Contract automatically calculates payouts',
      detail: 'YES shares = $1 each | NO shares = $0 each',
    },
    {
      title: 'Settlement Complete',
      description: 'Winners automatically receive funds',
      detail: 'Funds transferred to YES holders. NO holders lose stake.',
    },
  ];

  const runSettlement = () => {
    setIsRunning(true);
    setStep(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setStep(currentStep);
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 1500);
  };

  const reset = () => {
    setStep(0);
  };

  const calculatePayout = (trader) => {
    if (step < 4) return null;
    const payout = trader.yesShares * 1.0;
    const profit = payout - trader.spent;
    return { payout, profit };
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100">Settlement Process Visualization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={runSettlement}
            disabled={isRunning}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Run Settlement
          </Button>
          <Button onClick={reset} variant="outline" className="border-slate-700">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: step >= idx ? 1 : 0.3,
                scale: step === idx ? 1.02 : 1,
              }}
              className={`border-2 rounded-lg p-4 transition-all ${
                step >= idx
                  ? 'bg-indigo-500/10 border-indigo-500/30'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step >= idx ? 'bg-indigo-500' : 'bg-slate-700'
                  }`}
                >
                  <span className="text-white font-semibold text-sm">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-100 mb-1">{s.title}</h4>
                  <p className="text-sm text-slate-400 mb-2">{s.description}</p>
                  {step >= idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-indigo-300 bg-slate-900 rounded p-2"
                    >
                      {s.detail}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trader Results */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-4"
          >
            <h4 className="font-semibold text-slate-100 mb-3">Final Settlement</h4>
            <div className="space-y-2">
              {traders.map((trader) => {
                const result = calculatePayout(trader);
                const isWinner = trader.yesShares > 0;
                return (
                  <div
                    key={trader.name}
                    className={`flex items-center justify-between p-3 rounded border ${
                      isWinner
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isWinner ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="font-semibold text-slate-100">{trader.name}</span>
                    </div>
                    <div className="text-right text-sm">
                      {isWinner ? (
                        <>
                          <div className="text-emerald-400 font-semibold">
                            +${result.profit.toFixed(2)}
                          </div>
                          <div className="text-xs text-slate-500">
                            Payout: ${result.payout} (spent ${trader.spent})
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-red-400 font-semibold">-${trader.spent}</div>
                          <div className="text-xs text-slate-500">NO shares = $0</div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {step >= steps.length && (
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3 text-xs text-indigo-300">
            💡 <strong>Notice:</strong> Everything happened automatically via smart contracts. No intermediary handled the money or decided payouts. This is trustless settlement.
          </div>
        )}
      </CardContent>
    </Card>
  );
}