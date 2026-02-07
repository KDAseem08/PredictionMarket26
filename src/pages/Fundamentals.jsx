import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Users, DollarSign, Scale, CheckCircle2, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import AIChat from '../components/AIChat';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Fundamentals() {
  const [probabilityDemo, setProbabilityDemo] = useState(70);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    markModuleVisited();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const markModuleVisited = async () => {
    try {
      const currentUser = await base44.auth.me();
      const progressRecords = await base44.entities.UserProgress.filter({
        created_by: currentUser.email,
      });

      if (progressRecords.length === 0) {
        await base44.entities.UserProgress.create({
          current_module: 'fundamentals',
          completed_modules: [],
        });
      } else {
        await base44.entities.UserProgress.update(progressRecords[0].id, {
          current_module: 'fundamentals',
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
        if (!completed.includes('fundamentals')) {
          await base44.entities.UserProgress.update(progress.id, {
            completed_modules: [...completed, 'fundamentals'],
          });
        }
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const yesPrice = probabilityDemo;
  const noPrice = 100 - probabilityDemo;

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Fundamentals</h1>
            <p className="text-slate-400">Learn what prediction markets are and how they work</p>
          </div>
        </div>

        {/* What Are Prediction Markets */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">What Are Prediction Markets?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>
              A <strong className="text-indigo-400">prediction market</strong> is a place where people can buy and sell{' '}
              <strong className="text-indigo-400">contracts</strong> based on the outcome of future events.
            </p>
            <p>
              Think of it like a stock market, but instead of trading company shares, you're trading on whether something
              will happen or not. For example: "Will it rain tomorrow?" or "Who will win the election?"
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-100 mb-2">Real Example: Polymarket</h4>
              <p className="text-sm">
                On Polymarket, you might see a market asking: <em>"Will Bitcoin reach $100,000 by December 2024?"</em>
              </p>
              <p className="text-sm mt-2">
                People buy "YES" shares if they think it will happen, or "NO" shares if they think it won't. The prices
                of these shares reflect what the crowd collectively believes is the probability.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How Contracts Work */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">How Binary Contracts Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Most prediction markets use <strong className="text-violet-400">binary contracts</strong>:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">YES Contract</h4>
                <p className="text-sm">
                  Pays <strong>$1</strong> if the event happens. <br />
                  Pays <strong>$0</strong> if it doesn't.
                </p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">NO Contract</h4>
                <p className="text-sm">
                  Pays <strong>$1</strong> if the event doesn't happen. <br />
                  Pays <strong>$0</strong> if it does.
                </p>
              </div>
            </div>
            <p className="text-sm pt-2">
              The key insight: <strong>YES price + NO price always equals $1</strong> (ignoring fees). If YES is trading
              at $0.70, NO must be $0.30.
            </p>
          </CardContent>
        </Card>

        {/* Interactive Demo */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-400" />
              Interactive: Price = Probability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-6">
              The price of a contract reflects the <strong className="text-indigo-400">market's belief</strong> about
              the probability. Move the slider to see how prices relate to probability:
            </p>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="mb-6">
                <label className="text-slate-400 text-sm mb-2 block">Market Probability</label>
                <Slider
                  value={[probabilityDemo]}
                  onValueChange={(val) => setProbabilityDemo(val[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="mb-4"
                />
                <div className="text-center text-2xl font-bold text-indigo-400">{probabilityDemo}%</div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4 text-center">
                  <div className="text-sm text-green-400 mb-1">YES Contract Price</div>
                  <div className="text-3xl font-bold text-green-400">${(yesPrice / 100).toFixed(2)}</div>
                  <div className="text-xs text-slate-400 mt-2">
                    If you buy at ${(yesPrice / 100).toFixed(2)} and event happens, you get $1.00
                  </div>
                  <div className="text-xs text-emerald-400 mt-1 font-semibold">
                    Profit: ${(1 - yesPrice / 100).toFixed(2)}
                  </div>
                </div>
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4 text-center">
                  <div className="text-sm text-red-400 mb-1">NO Contract Price</div>
                  <div className="text-3xl font-bold text-red-400">${(noPrice / 100).toFixed(2)}</div>
                  <div className="text-xs text-slate-400 mt-2">
                    If you buy at ${(noPrice / 100).toFixed(2)} and event doesn't happen, you get $1.00
                  </div>
                  <div className="text-xs text-rose-400 mt-1 font-semibold">
                    Profit: ${(1 - noPrice / 100).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded">
                <p className="text-sm text-indigo-300">
                  💡 <strong>Key Insight:</strong> The market price IS the probability. If YES trades at $0.70, the
                  market believes there's a 70% chance the event will happen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why They Work */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-400" />
              Why Prediction Markets Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <DollarSign className="w-8 h-8 text-emerald-400 mb-3" />
                <h4 className="font-semibold text-slate-100 mb-2">Financial Incentive</h4>
                <p className="text-sm text-slate-300">
                  People put real money on their predictions. This incentivizes accuracy and informed trading.
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <Users className="w-8 h-8 text-blue-400 mb-3" />
                <h4 className="font-semibold text-slate-100 mb-2">Wisdom of Crowds</h4>
                <p className="text-sm text-slate-300">
                  Aggregating many independent opinions often produces more accurate forecasts than experts.
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <Scale className="w-8 h-8 text-amber-400 mb-3" />
                <h4 className="font-semibold text-slate-100 mb-2">Self-Correcting</h4>
                <p className="text-sm text-slate-300">
                  If prices don't reflect true probability, traders can profit by correcting them.
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
          <Link to={createPageUrl('Pricing')}>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Next: Contract Pricing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <AIChat
        moduleContext="Fundamentals"
        moduleData={{
          topic: 'What prediction markets are and how binary contracts work',
          keyTerms: ['binary contracts', 'YES/NO shares', 'price = probability'],
        }}
      />
    </div>
  );
}