import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Boxes, Plus, Trash2, Play, RotateCcw, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import AIChat from '../components/AIChat';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Sandbox() {
  const [market, setMarket] = useState({
    yesPool: 1000,
    noPool: 1000,
    totalVolume: 0,
  });
  const [traders, setTraders] = useState([]);
  const [priceHistory, setPriceHistory] = useState([{ time: 0, yesPrice: 0.5, noPrice: 0.5 }]);
  const [currentTime, setCurrentTime] = useState(0);

  // New trader form
  const [newTrader, setNewTrader] = useState({
    name: '',
    action: 'buy_yes',
    amount: 100,
    timing: 0,
  });

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
          current_module: 'sandbox',
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
        if (!completed.includes('sandbox')) {
          await base44.entities.UserProgress.update(progress.id, {
            completed_modules: [...completed, 'sandbox'],
          });
        }
      }
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const addTrader = () => {
    if (!newTrader.name) return;

    setTraders([
      ...traders,
      {
        id: Date.now(),
        ...newTrader,
        amount: parseFloat(newTrader.amount),
        timing: parseFloat(newTrader.timing),
        executed: false,
        profit: 0,
      },
    ]);

    setNewTrader({
      name: '',
      action: 'buy_yes',
      amount: 100,
      timing: traders.length + 1,
    });
  };

  const removeTrader = (id) => {
    setTraders(traders.filter((t) => t.id !== id));
  };

  const runSimulation = () => {
    // Reset market
    let currentMarket = { yesPool: 1000, noPool: 1000, totalVolume: 0 };
    let history = [{ time: 0, yesPrice: 0.5, noPrice: 0.5 }];
    let time = 0;

    // Sort traders by timing
    const sortedTraders = [...traders].sort((a, b) => a.timing - b.timing);

    sortedTraders.forEach((trader, idx) => {
      time = trader.timing;

      // Execute trade
      if (trader.action === 'buy_yes') {
        currentMarket.yesPool += trader.amount;
      } else if (trader.action === 'buy_no') {
        currentMarket.noPool += trader.amount;
      } else if (trader.action === 'sell_yes') {
        currentMarket.yesPool = Math.max(100, currentMarket.yesPool - trader.amount);
      } else if (trader.action === 'sell_no') {
        currentMarket.noPool = Math.max(100, currentMarket.noPool - trader.amount);
      }

      currentMarket.totalVolume += trader.amount;

      // Calculate prices
      const total = currentMarket.yesPool + currentMarket.noPool;
      const yesPrice = currentMarket.yesPool / total;
      const noPrice = currentMarket.noPool / total;

      history.push({
        time,
        yesPrice,
        noPrice,
        trader: trader.name,
      });
    });

    setMarket(currentMarket);
    setPriceHistory(history);
    setCurrentTime(time);

    // Mark traders as executed
    setTraders(traders.map((t) => ({ ...t, executed: true })));
  };

  const resetSimulation = () => {
    setMarket({ yesPool: 1000, noPool: 1000, totalVolume: 0 });
    setPriceHistory([{ time: 0, yesPrice: 0.5, noPrice: 0.5 }]);
    setCurrentTime(0);
    setTraders([]);
  };

  const currentYesPrice = (market.yesPool / (market.yesPool + market.noPool)).toFixed(4);
  const currentNoPrice = (market.noPool / (market.yesPool + market.noPool)).toFixed(4);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Boxes className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Interactive Sandbox</h1>
            <p className="text-slate-400">Simulate complete markets with multiple traders</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Trader Setup */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900 border-slate-700 mb-4">
              <CardHeader>
                <CardTitle className="text-slate-100 text-lg">Add Trader</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-slate-300 text-sm">Trader Name</Label>
                  <Input
                    value={newTrader.name}
                    onChange={(e) => setNewTrader({ ...newTrader, name: e.target.value })}
                    placeholder="e.g., Alice"
                    className="bg-slate-800 border-slate-700 text-slate-100 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-slate-300 text-sm">Action</Label>
                  <Select value={newTrader.action} onValueChange={(val) => setNewTrader({ ...newTrader, action: val })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy_yes">Buy YES</SelectItem>
                      <SelectItem value="buy_no">Buy NO</SelectItem>
                      <SelectItem value="sell_yes">Sell YES</SelectItem>
                      <SelectItem value="sell_no">Sell NO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300 text-sm">Amount ($)</Label>
                  <Input
                    type="number"
                    value={newTrader.amount}
                    onChange={(e) => setNewTrader({ ...newTrader, amount: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-slate-300 text-sm">Execute at Time</Label>
                  <Input
                    type="number"
                    value={newTrader.timing}
                    onChange={(e) => setNewTrader({ ...newTrader, timing: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100 mt-1"
                  />
                </div>

                <Button onClick={addTrader} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trader
                </Button>
              </CardContent>
            </Card>

            {/* Traders List */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100 text-lg">Traders Queue ({traders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {traders.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">No traders added yet</p>
                  )}
                  {traders.map((trader) => (
                    <div
                      key={trader.id}
                      className="bg-slate-800 border border-slate-700 rounded p-3 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-slate-100 text-sm">{trader.name}</div>
                        <div className="text-xs text-slate-400">
                          {trader.action.replace('_', ' ').toUpperCase()} ${trader.amount} at t={trader.timing}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeTrader(trader.id)}
                        className="h-8 w-8 text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2 space-y-4">
            {/* Controls */}
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Button onClick={runSimulation} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </Button>
                  <Button onClick={resetSimulation} variant="outline" className="flex-1 border-slate-700">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Market Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-xs text-slate-400 mb-1">YES Price</div>
                  <div className="text-2xl font-bold text-emerald-400">${currentYesPrice}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Pool: ${market.yesPool.toFixed(0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-xs text-slate-400 mb-1">NO Price</div>
                  <div className="text-2xl font-bold text-rose-400">${currentNoPrice}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Pool: ${market.noPool.toFixed(0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-xs text-slate-400 mb-1">Total Volume</div>
                  <div className="text-2xl font-bold text-indigo-400">${market.totalVolume.toFixed(0)}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {traders.filter((t) => t.executed).length} trades executed
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Chart */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  Price Evolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b' }} label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} domain={[0, 1]} label={{ value: 'Price', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#cbd5e1' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="yesPrice" stroke="#10b981" strokeWidth={2} name="YES" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="noPrice" stroke="#f43f5e" strokeWidth={2} name="NO" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="bg-indigo-500/10 border-indigo-500/20 mb-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-indigo-300 mb-2">💡 How to Use the Sandbox</h3>
            <ol className="text-sm text-indigo-200 space-y-1 list-decimal list-inside">
              <li>Add multiple traders with different actions and amounts</li>
              <li>Set execution times to create a sequence of trades</li>
              <li>Click "Run Simulation" to see how prices evolve</li>
              <li>Watch how each trade affects the market price</li>
              <li>Experiment with different scenarios to understand market dynamics</li>
            </ol>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={markComplete} className="border-slate-700">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
          <Link to={createPageUrl('Strategies')}>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Next: Trading Strategies
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <AIChat
        moduleContext="Interactive Sandbox"
        moduleData={{
          topic: 'Simulating complete markets with multiple traders',
        }}
      />
    </div>
  );
}