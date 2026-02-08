import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight, CheckCircle2, Info, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AIChat from '../components/AIChat';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function OpportunityMarkets() {
  // --- Simulation State (The "Brain" of the model) ---
  const [marketPrice, setMarketPrice] = useState(0.40);
  const [trueProbability, setTrueProbability] = useState(0.70);
  const [balance, setBalance] = useState(1000);
  const [history, setHistory] = useState([{ time: 0, price: 0.40, truth: 0.70 }]);

  useEffect(() => {
    markModuleVisited();
  }, []);

  // --- Logic: Executing a "Discovery" Trade ---
  const executeTrade = (amount) => {
    if (balance < amount) return;

    // This math simulates "Price Impact"
    // As you buy, the market price moves closer to the 1.0 (100%) ceiling
    const sensitivity = 2500; 
    const priceChange = (amount / sensitivity);
    const newPrice = Math.min(0.99, marketPrice + priceChange);
    
    setMarketPrice(newPrice);
    setBalance(prev => prev - amount);
    
    setHistory(prev => [...prev, { 
      time: prev.length, 
      price: newPrice, 
      truth: trueProbability 
    }]);
  };

  const simulateNews = () => {
    // Shifts the "Truth" line to create a new gap for the user to exploit
    const newTruth = parseFloat((Math.random() * 0.7 + 0.1).toFixed(2));
    setTrueProbability(newTruth);
    setHistory(prev => [...prev, { 
      time: prev.length, 
      price: marketPrice, 
      truth: newTruth 
    }]);
  };

  // --- Base44 Progress Tracking ---
  const markModuleVisited = async () => {
    try {
      const currentUser = await base44.auth.me();
      const progressRecords = await base44.entities.UserProgress.filter({ created_by: currentUser.email });
      if (progressRecords.length > 0) {
        await base44.entities.UserProgress.update(progressRecords[0].id, { current_module: 'opportunity' });
      }
    } catch (error) { console.error('Error updating progress:', error); }
  };

  const markComplete = async () => {
    try {
      const currentUser = await base44.auth.me();
      const progressRecords = await base44.entities.UserProgress.filter({ created_by: currentUser.email });
      if (progressRecords.length > 0) {
        const progress = progressRecords[0];
        const completed = progress.completed_modules || [];
        if (!completed.includes('opportunity')) {
          await base44.entities.UserProgress.update(progress.id, { completed_modules: [...completed, 'opportunity'] });
        }
      }
    } catch (error) { console.error('Error marking complete:', error); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Opportunity Markets</h1>
            <p className="text-slate-400">Discover how incentives turn opinions into assets</p>
          </div>
        </div>

        {/* Section 1: The Core Concept */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-400" />
              The Concept of Opportunity
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-slate-300">
            <p>
              In traditional markets, "opportunity" is often seen as a lucky break. In prediction markets, 
              opportunity is a <strong>mathematical inefficiency</strong>. When the market price does not match 
              the real-world probability of an event, an opportunity for profit is created.
            </p>
          </CardContent>
        </Card>

        {/* Section 2: LIVE SIMULATOR (The working model) */}
        <Card className="bg-slate-950 border-slate-700 mb-8 overflow-hidden">
          <CardHeader className="bg-slate-900/50 border-b border-slate-800">
            <CardTitle className="text-amber-400 flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5" />
              Real-Time Opportunity Simulator
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Market View</p>
                    <p className="text-3xl font-mono text-white">${marketPrice.toFixed(2)}</p>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <p className="text-xs text-amber-500 font-bold uppercase tracking-widest">Actual Truth</p>
                    <p className="text-3xl font-mono text-amber-400">{(trueProbability * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-lg space-y-4 border border-slate-800">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Your Wallet: <span className="text-emerald-400 font-mono">${balance}</span></span>
                    <button onClick={simulateNews} className="text-amber-400 flex items-center gap-1 hover:text-amber-300 transition-colors">
                      <RefreshCw className="w-3 h-3" /> Randomize News
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => executeTrade(100)} className="bg-amber-500 hover:bg-amber-600 text-black font-bold">Invest $100</Button>
                    <Button onClick={() => executeTrade(250)} className="bg-slate-100 hover:bg-white text-black font-bold">Invest $250</Button>
                  </div>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="h-[250px] bg-slate-900 rounded-xl p-4 border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[0, 1]} hide />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="price" stroke="#f59e0b" fill="#f59e0b10" strokeWidth={3} name="Market Price" />
                    <Area type="step" dataKey="truth" stroke="#475569" fill="transparent" strokeDasharray="5 5" name="The Truth" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
              <p className="text-xs text-slate-400 text-center italic">
                Notice: Buying pushes the orange line. Your goal is to narrow the gap between "Market View" and "Actual Truth."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: The Theory Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Market Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm leading-relaxed">
              Market efficiency occurs when prices reflect all available information. As traders invest in 
              outcomes they believe are likely, they push the price toward the true probability. 
              This "Price Discovery" happens in real-time, reactively turning information into assets.
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100 text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400 text-sm leading-relaxed">
              Opportunity is never without risk. Effective participants manage uncertainty by understanding 
              that a high probability is not a guarantee. They use position sizing to ensure one wrong 
              prediction doesn't end their journey, treating every market as a probabilistic bet.
            </CardContent>
          </Card>
        </div>

        {/* Section 4: Key Takeaways */}
        <Card className="bg-indigo-900/10 border-indigo-500/20 mb-12">
          <CardContent className="pt-6">
            <h3 className="text-indigo-400 font-semibold mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                Opportunities exist wherever market sentiment deviates from statistical reality.
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                Capital acts as a vote of confidence that corrects market errors.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center border-t border-slate-800 pt-8">
          <Button variant="outline" onClick={markComplete} className="border-slate-700 text-slate-400 hover:bg-slate-800">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
          </Button>
          <Link to={createPageUrl('Sandbox')}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              Next: Interactive Sandbox <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </motion.div>

      <AIChat moduleContext="Opportunity Markets Simulation" />
    </div>
  );
}