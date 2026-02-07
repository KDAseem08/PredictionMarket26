import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Play, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';

export default function StrategySimulator({ strategy }) {
  const [scenario, setScenario] = useState('ideal');
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const scenarios = {
    value_betting: {
      ideal: {
        name: 'Ideal Scenario',
        description: 'You identify a mispriced market early',
        initialPrice: 0.35,
        trueProb: 0.65,
        marketEvents: [
          { time: 1, price: 0.35, event: 'You buy at $0.35' },
          { time: 2, price: 0.38, event: 'Market starts to adjust' },
          { time: 3, price: 0.45, event: 'More traders notice' },
          { time: 4, price: 0.55, event: 'Price approaches true value' },
          { time: 5, price: 0.63, event: 'Market corrects' },
          { time: 6, price: 0.65, event: 'Event resolves YES' },
        ],
        buyPrice: 0.35,
        outcome: 'win',
        profit: 0.65,
      },
      bad: {
        name: 'Bad Scenario',
        description: 'Your analysis was wrong',
        initialPrice: 0.35,
        trueProb: 0.20,
        marketEvents: [
          { time: 1, price: 0.35, event: 'You buy at $0.35 (overconfident)' },
          { time: 2, price: 0.33, event: 'Price drops slightly' },
          { time: 3, price: 0.28, event: 'New information emerges' },
          { time: 4, price: 0.22, event: 'Market realizes overpriced' },
          { time: 5, price: 0.18, event: 'Price reflects true probability' },
          { time: 6, price: 0, event: 'Event resolves NO - you lose' },
        ],
        buyPrice: 0.35,
        outcome: 'loss',
        profit: -0.35,
      },
    },
    arbitrage: {
      ideal: {
        name: 'Ideal Scenario',
        description: 'Perfect arbitrage opportunity',
        initialPrice: 0.60,
        marketEvents: [
          { time: 1, price: 0.60, event: 'YES = $0.60, NO = $0.35 (sum = $0.95)' },
          { time: 2, price: 0.60, event: 'You buy both for $0.95 total' },
          { time: 3, price: 0.57, event: 'Market adjusts toward $1.00' },
          { time: 4, price: 0.53, event: 'Prices normalizing' },
          { time: 5, price: 0.50, event: 'Back to equilibrium' },
          { time: 6, price: 0.50, event: 'Resolves - you get $1.00' },
        ],
        buyPrice: 0.95,
        outcome: 'win',
        profit: 0.05,
      },
      bad: {
        name: 'Bad Scenario',
        description: 'Opportunity disappears too fast',
        initialPrice: 0.60,
        marketEvents: [
          { time: 1, price: 0.60, event: 'YES = $0.60, NO = $0.35' },
          { time: 2, price: 0.58, event: 'You start buying...' },
          { time: 3, price: 0.54, event: 'Bots execute faster' },
          { time: 4, price: 0.51, event: 'Opportunity closed' },
          { time: 5, price: 0.50, event: 'You bought at $0.57 + $0.47 = $1.04' },
          { time: 6, price: 0.50, event: 'You get $1.00 - lost $0.04 to slippage' },
        ],
        buyPrice: 1.04,
        outcome: 'loss',
        profit: -0.04,
      },
    },
    event_trading: {
      ideal: {
        name: 'Ideal Scenario',
        description: 'React faster than the market',
        initialPrice: 0.45,
        marketEvents: [
          { time: 1, price: 0.45, event: 'Market stable at $0.45' },
          { time: 2, price: 0.46, event: 'Breaking news drops!' },
          { time: 3, price: 0.55, event: 'You buy immediately at $0.55' },
          { time: 4, price: 0.68, event: 'Rest of market reacts' },
          { time: 5, price: 0.78, event: 'Full adjustment' },
          { time: 6, price: 0.85, event: 'You sell at $0.85' },
        ],
        buyPrice: 0.55,
        outcome: 'win',
        profit: 0.30,
      },
      bad: {
        name: 'Bad Scenario',
        description: 'Too slow or news misleading',
        initialPrice: 0.45,
        marketEvents: [
          { time: 1, price: 0.45, event: 'Market stable' },
          { time: 2, price: 0.52, event: 'News appears positive' },
          { time: 3, price: 0.65, event: 'You buy at $0.65' },
          { time: 4, price: 0.58, event: 'Clarification: news less significant' },
          { time: 5, price: 0.48, event: 'Market reverses' },
          { time: 6, price: 0.40, event: 'You exit at loss' },
        ],
        buyPrice: 0.65,
        outcome: 'loss',
        profit: -0.25,
      },
    },
    long_term_hold: {
      ideal: {
        name: 'Ideal Scenario',
        description: 'Conviction proven right',
        initialPrice: 0.30,
        marketEvents: [
          { time: 1, price: 0.30, event: 'Buy early at $0.30' },
          { time: 2, price: 0.28, event: 'Short-term volatility down' },
          { time: 3, price: 0.35, event: 'Slow upward trend' },
          { time: 4, price: 0.42, event: 'Market catching up' },
          { time: 5, price: 0.55, event: 'Strong fundamentals show' },
          { time: 6, price: 1.0, event: 'Resolves YES - conviction paid off' },
        ],
        buyPrice: 0.30,
        outcome: 'win',
        profit: 0.70,
      },
      bad: {
        name: 'Bad Scenario',
        description: 'Wrong thesis + opportunity cost',
        initialPrice: 0.30,
        marketEvents: [
          { time: 1, price: 0.30, event: 'Buy at $0.30' },
          { time: 2, price: 0.32, event: 'Slight movement' },
          { time: 3, price: 0.28, event: 'Doubts emerge' },
          { time: 4, price: 0.22, event: 'Fundamentals weaken' },
          { time: 5, price: 0.15, event: 'Capital locked for months' },
          { time: 6, price: 0, event: 'Resolves NO - total loss + time wasted' },
        ],
        buyPrice: 0.30,
        outcome: 'loss',
        profit: -0.30,
      },
    },
  };

  const runSimulation = () => {
    const data = scenarios[strategy.id]?.[scenario];
    if (!data) return;

    setIsRunning(true);
    setHistory([]);
    setResult(null);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < data.marketEvents.length) {
        setHistory((prev) => [...prev, data.marketEvents[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setResult(data);
      }
    }, 800);
  };

  const reset = () => {
    setHistory([]);
    setResult(null);
  };

  const currentData = scenarios[strategy.id]?.[scenario];

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100">Practice: {strategy.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scenario Selector */}
        <div className="flex gap-2">
          <Button
            onClick={() => setScenario('ideal')}
            variant={scenario === 'ideal' ? 'default' : 'outline'}
            className={scenario === 'ideal' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-slate-700'}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Ideal Scenario
          </Button>
          <Button
            onClick={() => setScenario('bad')}
            variant={scenario === 'bad' ? 'default' : 'outline'}
            className={scenario === 'bad' ? 'bg-red-600 hover:bg-red-700' : 'border-slate-700'}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Bad Scenario
          </Button>
        </div>

        {currentData && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-semibold text-slate-100 mb-1">{currentData.name}</h4>
            <p className="text-sm text-slate-400">{currentData.description}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Run Simulation
          </Button>
          <Button onClick={reset} variant="outline" className="border-slate-700">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Event Timeline */}
        {history.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
            {history.map((event, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-400 font-semibold">{event.time}</span>
                </div>
                <div className="flex-1">
                  <div className="text-slate-300">{event.event}</div>
                  <div className="text-xs text-slate-500">Price: ${event.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        {history.length > 0 && currentData && (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b' }} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} domain={[0, 1]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              />
              <ReferenceLine y={currentData.buyPrice} stroke="#f59e0b" strokeDasharray="3 3" label="Entry" />
              <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Result */}
        {result && (
          <div
            className={`border-2 rounded-lg p-4 ${
              result.outcome === 'win'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <h4
              className={`font-semibold mb-2 ${result.outcome === 'win' ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {result.outcome === 'win' ? '✅ Profitable Trade' : '❌ Loss'}
            </h4>
            <div className="text-sm text-slate-300 space-y-1">
              <div>Entry: ${result.buyPrice.toFixed(2)}</div>
              <div>Exit: ${result.outcome === 'win' ? '1.00' : '0.00'}</div>
              <div className="font-semibold">
                P&L: {result.profit > 0 ? '+' : ''}${result.profit.toFixed(2)} (
                {((result.profit / result.buyPrice) * 100).toFixed(1)}%)
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}