import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, Scale, CheckCircle2, ArrowRight, Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import AIChat from '../components/AIChat';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import StrategySimulator from '../components/strategies/StrategySimulator';

const strategies = [
  {
    id: 'value_betting',
    name: 'Value Betting',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    description: 'Find markets where the price differs from true probability',
    logic: 'If you believe the true probability is higher than the market price, buy. If lower, sell or buy the opposite outcome.',
    example: 'Market says 40% chance of rain, but weather models show 65%. Buy YES contracts for profit.',
    profitCondition: 'Your probability assessment is more accurate than the market',
    steps: [
      'Research and form your own probability estimate',
      'Compare your estimate to the market price',
      'If significant difference exists, place your trade',
      'Size your position based on confidence',
    ],
  },
  {
    id: 'arbitrage',
    name: 'Arbitrage',
    icon: Scale,
    color: 'from-violet-500 to-purple-500',
    description: 'Exploit pricing inefficiencies for risk-free profit',
    logic: 'If YES + NO prices don\'t equal $1, buy/sell to lock in guaranteed profit.',
    example: 'YES trades at $0.65, NO at $0.40. Buy both for $1.05, guaranteed payout is $1.00. Wait... that\'s a loss! Correct arbitrage: if YES=$0.55 and NO=$0.40, you could sell one side high.',
    profitCondition: 'Pricing inefficiency exists (rare in efficient markets)',
    steps: [
      'Monitor YES and NO prices constantly',
      'Identify when sum deviates from $1',
      'Execute simultaneous trades on both sides',
      'Lock in risk-free profit',
    ],
  },
  {
    id: 'event_trading',
    name: 'Event-Based Trading',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    description: 'Trade immediately before/after major news events',
    logic: 'Market prices often lag behind breaking news. Be first to trade on new information.',
    example: 'Debate performance or earnings report drops. Trade before the market fully adjusts.',
    profitCondition: 'You process news faster than other market participants',
    steps: [
      'Monitor for upcoming catalysts',
      'Be ready to trade instantly when news breaks',
      'Act before market fully prices in information',
      'Exit once market adjusts',
    ],
  },
  {
    id: 'long_term_hold',
    name: 'Long-Term Hold',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    description: 'Buy undervalued positions and hold until resolution',
    logic: 'If you have strong conviction about an outcome, buy early and wait for market to catch up.',
    example: 'Election market undervalues a candidate 6 months out. Buy and hold through volatility.',
    profitCondition: 'Your long-term analysis is superior to short-term market noise',
    steps: [
      'Conduct deep fundamental analysis',
      'Enter position when price is attractive',
      'Ignore short-term volatility',
      'Hold until resolution or fundamental change',
    ],
  },
];

export default function Strategies() {
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    markModuleVisited();
  }, []);

  const markModuleVisited = async () => {
    try {
      const currentUser = await base44.auth.me();
      const progressRecords = await base44.entities.UserProgress.filter({
        created_by: currentUser.email,
      });

      if (progressRecords.length > 0) {
        await base44.entities.UserProgress.update(progressRecords[0].id, {
          current_module: 'strategies',
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const markComplete = async () => {
    try {
      const currentUser = await base44.auth.me();
      const progressRecords = await base44.entities.UserProgress.filter({
        created_by: currentUser.email,
      });

      if (progressRecords.length > 0) {
        const progress = progressRecords[0];
        const completed = progress.completed_modules || [];
        if (!completed.includes('strategies')) {
          await base44.entities.UserProgress.update(progress.id, {
            completed_modules: [...completed, 'strategies'],
          });
        }
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const playAnimation = (strategyId) => {
    setSelectedStrategy(strategyId);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Trading Strategies</h1>
            <p className="text-slate-400">Learn different approaches to prediction market trading</p>
          </div>
        </div>

        {/* Strategy Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            const isSelected = selectedStrategy === strategy.id;

            return (
              <Card
                key={strategy.id}
                className={`bg-slate-900 border-2 transition-all cursor-pointer ${
                  isSelected ? 'border-indigo-500' : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${strategy.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAnimation(strategy.id);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Demo
                    </Button>
                  </div>
                  <CardTitle className="text-slate-100">{strategy.name}</CardTitle>
                  <p className="text-sm text-slate-400">{strategy.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-400 mb-1">Core Logic</h4>
                    <p className="text-sm text-slate-300">{strategy.logic}</p>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded p-3">
                    <h4 className="text-sm font-semibold text-violet-400 mb-2">💡 Example</h4>
                    <p className="text-xs text-slate-300">{strategy.example}</p>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-3">
                    <h4 className="text-xs font-semibold text-emerald-400 mb-1">Profit When:</h4>
                    <p className="text-xs text-emerald-300">{strategy.profitCondition}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Interactive Simulator */}
        <AnimatePresence mode="wait">
          {selectedStrategy && (
            <motion.div
              key={`simulator-${selectedStrategy}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <StrategySimulator strategy={strategies.find((s) => s.id === selectedStrategy)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Strategy View */}
        <AnimatePresence mode="wait">
          {selectedStrategy && (
            <motion.div
              key={selectedStrategy}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-slate-900 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-slate-100">
                    How to Execute: {strategies.find((s) => s.id === selectedStrategy)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {strategies
                      .find((s) => s.id === selectedStrategy)
                      ?.steps.map((step, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 bg-slate-800 border border-slate-700 rounded-lg p-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="font-semibold text-indigo-400">{idx + 1}</span>
                          </div>
                          <p className="text-slate-300 text-sm pt-1">{step}</p>
                        </motion.div>
                      ))}
                  </div>

                  {isAnimating && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6 text-center"
                    >
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-indigo-300 font-semibold">Strategy Demo Running...</p>
                      <p className="text-sm text-slate-400 mt-1">
                        In a real implementation, this would show an animated visualization of the strategy in action
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Strategy Comparison */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Strategy Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-2 text-slate-400 font-semibold">Strategy</th>
                    <th className="text-left py-3 px-2 text-slate-400 font-semibold">Time Horizon</th>
                    <th className="text-left py-3 px-2 text-slate-400 font-semibold">Risk Level</th>
                    <th className="text-left py-3 px-2 text-slate-400 font-semibold">Skill Required</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-2 text-slate-100">Value Betting</td>
                    <td className="py-3 px-2 text-slate-300">Medium-Long</td>
                    <td className="py-3 px-2 text-yellow-400">Medium</td>
                    <td className="py-3 px-2 text-slate-300">High - Research</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-2 text-slate-100">Arbitrage</td>
                    <td className="py-3 px-2 text-slate-300">Immediate</td>
                    <td className="py-3 px-2 text-green-400">Very Low</td>
                    <td className="py-3 px-2 text-slate-300">Medium - Speed</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-2 text-slate-100">Event-Based</td>
                    <td className="py-3 px-2 text-slate-300">Short</td>
                    <td className="py-3 px-2 text-orange-400">Medium-High</td>
                    <td className="py-3 px-2 text-slate-300">High - Reaction Speed</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 text-slate-100">Long-Term Hold</td>
                    <td className="py-3 px-2 text-slate-300">Long</td>
                    <td className="py-3 px-2 text-red-400">High</td>
                    <td className="py-3 px-2 text-slate-300">Very High - Analysis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Risk Management Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-slate-100 mb-2">Position Sizing</h4>
                <p className="text-sm text-slate-400">
                  Never risk more than 1-5% of your capital on a single trade. Size positions based on conviction.
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-semibold text-slate-100 mb-2">Diversification</h4>
                <p className="text-sm text-slate-400">
                  Spread risk across multiple uncorrelated markets. Don't put all capital in one event.
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="text-2xl mb-2">⏱️</div>
                <h4 className="font-semibold text-slate-100 mb-2">Time Management</h4>
                <p className="text-sm text-slate-400">
                  Consider time until resolution. Longer timeframes mean more capital lockup and uncertainty.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={markComplete} className="border-slate-700">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
          <Link to={createPageUrl('DeFi')}>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Next: DeFi Integration
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <AIChat
        moduleContext="Trading Strategies"
        moduleData={{
          topic: 'Different trading strategies for prediction markets',
          strategies: strategies.map((s) => s.name),
        }}
      />
    </div>
  );
}