import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, DollarSign } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import AIChat from '../components/AIChat';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const participantTypes = [
  {
    name: 'Informed Traders',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    description: 'Have private information or superior analysis',
    motivation: 'Profit from knowledge advantage',
    behavior: 'Buy when they know the market is mispriced',
    example: 'A political analyst who knows a candidate has strong ground support buys YES shares.',
  },
  {
    name: 'Arbitrageurs',
    icon: TrendingUp,
    color: 'from-violet-500 to-purple-500',
    description: 'Look for pricing inefficiencies across markets',
    motivation: 'Risk-free profit from price differences',
    behavior: 'Correct mispricings by trading both sides',
    example: 'If YES trades at $0.65 and NO at $0.40 (sum > $1), they sell both for guaranteed profit.',
  },
  {
    name: 'Liquidity Providers',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    description: 'Provide capital to the market',
    motivation: 'Earn fees from trades',
    behavior: 'Add liquidity to both sides of the market',
    example: 'They deposit funds to earn a share of trading fees, keeping markets active.',
  },
  {
    name: 'Noise Traders',
    icon: AlertCircle,
    color: 'from-orange-500 to-red-500',
    description: 'Trade without information advantage',
    motivation: 'Entertainment, emotion, or speculation',
    behavior: 'Random or sentiment-driven trading',
    example: 'Someone bets on their favorite team to win regardless of the odds.',
  },
];

export default function MarketDynamics() {
  const [selectedParticipant, setSelectedParticipant] = useState(null);

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
          current_module: 'dynamics',
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
        if (!completed.includes('dynamics')) {
          await base44.entities.UserProgress.update(progress.id, {
            completed_modules: [...completed, 'dynamics'],
          });
        }
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Market Dynamics</h1>
            <p className="text-slate-400">Understand who participates and why markets self-correct</p>
          </div>
        </div>

        {/* Market Participants */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Types of Market Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-6">
              Different participants have different motivations and play different roles in making markets efficient.
              Click each to learn more:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {participantTypes.map((participant, idx) => {
                const Icon = participant.icon;
                const isSelected = selectedParticipant === idx;

                return (
                  <motion.button
                    key={idx}
                    onClick={() => setSelectedParticipant(isSelected ? null : idx)}
                    className={`text-left bg-slate-800 border-2 rounded-lg p-4 transition-all hover:border-slate-600 ${
                      isSelected ? 'border-indigo-500' : 'border-slate-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${participant.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-100 mb-1">{participant.name}</h3>
                        <p className="text-sm text-slate-400">{participant.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Detailed View */}
            {selectedParticipant !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4"
              >
                <div>
                  <h4 className="text-sm font-semibold text-indigo-400 mb-1">Primary Motivation</h4>
                  <p className="text-slate-300">{participantTypes[selectedParticipant].motivation}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-violet-400 mb-1">Typical Behavior</h4>
                  <p className="text-slate-300">{participantTypes[selectedParticipant].behavior}</p>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded p-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-2">📌 Example Scenario</h4>
                  <p className="text-sm text-slate-300">{participantTypes[selectedParticipant].example}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* How Markets Self-Correct */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">How Markets Self-Correct</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>
              Prediction markets are <strong className="text-indigo-400">self-correcting</strong> because participants
              have financial incentives to identify and exploit mispricings.
            </p>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-100 mb-3">Example: Market Correction in Action</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 text-red-400 font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Initial Mispricing</p>
                    <p className="text-sm text-slate-400">
                      Market: "Will Bitcoin hit $100k?" trades at YES = $0.30 (30% probability), but insider research
                      suggests 60% is more accurate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 text-yellow-400 font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Informed Traders Act</p>
                    <p className="text-sm text-slate-400">
                      Traders with research see the opportunity and buy YES at $0.30, expecting to profit when the true
                      probability is revealed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Price Adjusts</p>
                    <p className="text-sm text-slate-400">
                      As informed traders buy YES, the price increases from $0.30 → $0.45 → $0.58, reflecting the more
                      accurate probability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400 font-semibold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">Equilibrium Reached</p>
                    <p className="text-sm text-slate-400">
                      Eventually, the price stabilizes around $0.60 when no more profitable opportunities exist. The
                      market now reflects informed consensus.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
              <p className="text-sm text-indigo-300">
                💡 <strong>Key Insight:</strong> The market price converges to the true probability because anyone who
                believes it's wrong can profit by correcting it. This creates a powerful feedback loop for accuracy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Incentive Alignment */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Incentive Alignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="text-2xl mb-2">💰</div>
                <h4 className="font-semibold text-slate-100 mb-2">Profit Motive</h4>
                <p className="text-sm text-slate-400">
                  Traders earn money by being right. The more accurate your prediction, the more you can profit.
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="text-2xl mb-2">⚖️</div>
                <h4 className="font-semibold text-slate-100 mb-2">Risk/Reward Balance</h4>
                <p className="text-sm text-slate-400">
                  Higher conviction = larger position. Traders put more money where they're more confident.
                </p>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="font-semibold text-slate-100 mb-2">Continuous Update</h4>
                <p className="text-sm text-slate-400">
                  New information causes immediate price changes as traders race to incorporate it first.
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
          <Link to={createPageUrl('Sandbox')}>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Next: Interactive Sandbox
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <AIChat
        moduleContext="Market Dynamics"
        moduleData={{
          topic: 'Different market participants and how markets self-correct through incentives',
          keyTypes: ['Informed Traders', 'Arbitrageurs', 'Liquidity Providers', 'Noise Traders'],
        }}
      />
    </div>
  );
}