import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SmartContractDemo() {
  const [market, setMarket] = useState({
    yesShares: 1000,
    noShares: 1000,
    userBalance: 100,
    userYesShares: 0,
    userNoShares: 0,
  });
  const [tradeAmount, setTradeAmount] = useState(10);
  const [logs, setLogs] = useState([]);

  const buyYes = () => {
    if (tradeAmount > market.userBalance) {
      addLog('❌ Transaction failed: Insufficient balance', 'error');
      return;
    }

    const sharesReceived = (tradeAmount / (market.yesShares / (market.yesShares + market.noShares))).toFixed(2);
    
    addLog(`📝 Contract executing buyYES(${tradeAmount})`, 'pending');
    
    setTimeout(() => {
      setMarket({
        ...market,
        yesShares: market.yesShares + parseFloat(tradeAmount),
        userBalance: market.userBalance - parseFloat(tradeAmount),
        userYesShares: market.userYesShares + parseFloat(sharesReceived),
      });
      addLog(`✅ Bought ${sharesReceived} YES shares for $${tradeAmount}`, 'success');
    }, 1000);
  };

  const buyNo = () => {
    if (tradeAmount > market.userBalance) {
      addLog('❌ Transaction failed: Insufficient balance', 'error');
      return;
    }

    const sharesReceived = (tradeAmount / (market.noShares / (market.yesShares + market.noShares))).toFixed(2);
    
    addLog(`📝 Contract executing buyNO(${tradeAmount})`, 'pending');
    
    setTimeout(() => {
      setMarket({
        ...market,
        noShares: market.noShares + parseFloat(tradeAmount),
        userBalance: market.userBalance - parseFloat(tradeAmount),
        userNoShares: market.userNoShares + parseFloat(sharesReceived),
      });
      addLog(`✅ Bought ${sharesReceived} NO shares for $${tradeAmount}`, 'success');
    }, 1000);
  };

  const addLog = (message, type) => {
    setLogs((prev) => [...prev, { message, type, timestamp: Date.now() }]);
  };

  const yesPrice = (market.yesShares / (market.yesShares + market.noShares)).toFixed(3);
  const noPrice = (market.noShares / (market.yesShares + market.noShares)).toFixed(3);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Smart Contract Code */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100 text-sm flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            Smart Contract (Simplified)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-slate-950 p-3 rounded text-xs overflow-x-auto text-slate-300 font-mono">
{`contract PredictionMarket {
  uint256 yesPool;
  uint256 noPool;
  
  function buyYES(uint256 amount) {
    require(balance >= amount);
    
    // Calculate shares
    uint256 price = yesPool / total;
    uint256 shares = amount / price;
    
    // Update pools
    yesPool += amount;
    
    // Transfer shares
    userShares[msg.sender] += shares;
  }
  
  function resolve(bool outcome) {
    if (outcome) {
      // Pay YES holders $1 per share
      payWinners(yesHolders, 1.0);
    } else {
      // Pay NO holders $1 per share
      payWinners(noHolders, 1.0);
    }
  }
}`}</pre>
        </CardContent>
      </Card>

      {/* Interaction Interface */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100 text-sm flex items-center gap-2">
            <Play className="w-4 h-4 text-emerald-400" />
            Interact with Contract
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Market State */}
          <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
            <div className="text-xs text-slate-400">Contract State:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>YES Pool: <span className="text-emerald-400 font-mono">${market.yesShares.toFixed(0)}</span></div>
              <div>YES Price: <span className="text-emerald-400 font-mono">${yesPrice}</span></div>
              <div>NO Pool: <span className="text-rose-400 font-mono">${market.noShares.toFixed(0)}</span></div>
              <div>NO Price: <span className="text-rose-400 font-mono">${noPrice}</span></div>
            </div>
          </div>

          {/* User State */}
          <div className="bg-slate-800 border border-slate-700 rounded p-3 space-y-2">
            <div className="text-xs text-slate-400">Your Wallet:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Balance: <span className="text-indigo-400 font-mono">${market.userBalance.toFixed(2)}</span></div>
              <div>YES Shares: <span className="text-emerald-400 font-mono">{market.userYesShares.toFixed(2)}</span></div>
              <div>NO Shares: <span className="text-rose-400 font-mono">{market.userNoShares.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Trade Interface */}
          <div className="space-y-2">
            <Input
              type="number"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              placeholder="Amount to spend"
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={buyYes} className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                Buy YES
              </Button>
              <Button onClick={buyNo} className="bg-rose-600 hover:bg-rose-700 text-xs">
                Buy NO
              </Button>
            </div>
          </div>

          {/* Transaction Logs */}
          <div className="bg-slate-950 border border-slate-700 rounded p-3 max-h-32 overflow-y-auto">
            <div className="text-xs text-slate-400 mb-2">Transaction Log:</div>
            <div className="space-y-1">
              {logs.length === 0 && <div className="text-xs text-slate-600">No transactions yet...</div>}
              {logs.slice(-5).map((log, idx) => (
                <motion.div
                  key={log.timestamp}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xs ${
                    log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {log.message}
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}