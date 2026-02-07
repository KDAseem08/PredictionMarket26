import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import AIChat from '../components/AIChat';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Pricing() {
  const [liquidityPool, setLiquidityPool] = useState({ yes: 500, no: 500 });
  const [tradeAmount, setTradeAmount] = useState(100);
  const [tradeType, setTradeType] = useState('yes');
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    markModuleVisited();
    initializePriceHistory();
  }, []);

  useEffect(() => {
    updatePriceHistory();
  }, [liquidityPool]);

  const initializePriceHistory = () => {
    const history = [];
    for (let i = 0; i <= 10; i++) {
      history.push({
        time: i,
        yesPrice: 0.5,
        noPrice: 0.5,
      });
    }
    setPriceHistory(history);
  };

  const markModuleVisited = async () => {
    try {
      const currentUser = await base44.auth.me();
      const progressRecords = await base44.entities.UserProgress.filter({
        created_by: currentUser.email,
      });

      if (progressRecords.length > 0) {
        await base44.entities.UserProgress.update(progressRecords[0].id, {
          current_module: 'pricing',
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
        if (!completed.includes('pricing')) {
          await base44.entities.UserProgress.update(progress.id, {
            completed_modules: [...completed, 'pricing'],
          });
        }
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const updatePriceHistory = () => {
    const yesPrice = liquidityPool.yes / (liquidityPool.yes + liquidityPool.no);
    const noPrice = liquidityPool.no / (liquidityPool.yes + liquidityPool.no);

    setPriceHistory((prev) => {
      const newHistory = [...prev];
      newHistory.push({
        time: prev.length,
        yesPrice: yesPrice,
        noPrice: noPrice,
      });
      if (newHistory.length > 20) newHistory.shift();
      return newHistory;
    });
  };

  const executeTrade = () => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (tradeType === 'yes') {
      setLiquidityPool({
        yes: liquidityPool.yes + amount,
        no: liquidityPool.no,
      });
    } else {
      setLiquidityPool({
        yes: liquidityPool.yes,
        no: liquidityPool.no + amount,
      });
    }
  };

  const resetPool = () => {
    setLiquidityPool({ yes: 500, no: 500 });
    initializePriceHistory();
  };

  const currentYesPrice = (liquidityPool.yes / (liquidityPool.yes + liquidityPool.no)).toFixed(4);
  const currentNoPrice = (liquidityPool.no / (liquidityPool.yes + liquidityPool.no)).toFixed(4);
  const currentYesProbability = (currentYesPrice * 100).toFixed(1);
  const currentNoProbability = (currentNoPrice * 100).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Contract Pricing</h1>
            <p className="text-slate-400">Understand the mathematics behind how contracts are priced</p>
          </div>
        </div>

        {/* Theory Section */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Automated Market Maker (AMM)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>
              Prediction markets use an <strong className="text-violet-400">Automated Market Maker (AMM)</strong> to set
              prices automatically based on supply and demand.
            </p>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-slate-100 mb-3">Constant Product Formula (Simplified)</h4>
              <div className="bg-slate-950 p-4 rounded font-mono text-sm mb-3">
                <div className="text-indigo-400">Price of YES = YES_Liquidity / (YES_Liquidity + NO_Liquidity)</div>
                <div className="text-rose-400 mt-2">Price of NO = NO_Liquidity / (YES_Liquidity + NO_Liquidity)</div>
              </div>
              <p className="text-sm">
                As more people buy YES contracts, YES liquidity increases, making the YES price go up and the NO price
                go down.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-400 mb-2">📈 When demand for YES increases:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>YES liquidity pool grows</li>
                  <li>YES price increases</li>
                  <li>NO price decreases</li>
                  <li>Probability shifts toward YES</li>
                </ul>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-rose-400 mb-2">📉 When demand for NO increases:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>NO liquidity pool grows</li>
                  <li>NO price increases</li>
                  <li>YES price decreases</li>
                  <li>Probability shifts toward NO</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Simulator */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Interactive Pricing Simulator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-100 mb-4">Current Liquidity Pool</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400">YES Pool:</span>
                      <span className="font-mono text-xl text-slate-100">{liquidityPool.yes.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-rose-400">NO Pool:</span>
                      <span className="font-mono text-xl text-slate-100">{liquidityPool.no.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-100 mb-4">Current Prices</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-3 text-center">
                      <div className="text-xs text-emerald-400 mb-1">YES</div>
                      <div className="text-2xl font-bold text-emerald-400">${currentYesPrice}</div>
                      <div className="text-xs text-slate-400 mt-1">{currentYesProbability}%</div>
                    </div>
                    <div className="bg-rose-500/10 border border-rose-500/30 rounded p-3 text-center">
                      <div className="text-xs text-rose-400 mb-1">NO</div>
                      <div className="text-2xl font-bold text-rose-400">${currentNoPrice}</div>
                      <div className="text-xs text-slate-400 mt-1">{currentNoProbability}%</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-100 mb-4">Execute Trade</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-slate-300">Trade Amount ($)</Label>
                      <Input
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => {
                          setTradeType('yes');
                          executeTrade();
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Buy YES
                      </Button>
                      <Button
                        onClick={() => {
                          setTradeType('no');
                          executeTrade();
                        }}
                        className="bg-rose-600 hover:bg-rose-700"
                      >
                        Buy NO
                      </Button>
                    </div>
                    <Button onClick={resetPool} variant="outline" className="w-full border-slate-700">
                      Reset Pool
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-slate-100 mb-4">Price History</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b' }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} domain={[0, 1]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#cbd5e1' }}
                    />
                    <Area type="monotone" dataKey="yesPrice" stroke="#10b981" fill="#10b98120" name="YES" />
                    <Area type="monotone" dataKey="noPrice" stroke="#f43f5e" fill="#f43f5e20" name="NO" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded">
              <p className="text-sm text-indigo-300">
                💡 <strong>Try this:</strong> Buy YES multiple times and watch the price increase. Notice how each
                subsequent purchase costs more? That's slippage - the price moves as you trade!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={markComplete} className="border-slate-700">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
          <Link to={createPageUrl('MarketDynamics')}>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Next: Market Dynamics
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <AIChat
        moduleContext="Contract Pricing"
        moduleData={{
          topic: 'How AMMs price contracts using liquidity pools',
          keyFormulas: ['Price = Liquidity / Total Liquidity', 'Constant Product Formula'],
        }}
      />
    </div>
  );
}