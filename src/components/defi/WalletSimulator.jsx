import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletSimulator({ onWalletCreated }) {
  const [wallet, setWallet] = useState(null);
  const [copied, setCopied] = useState(false);

  const createWallet = () => {
    const address = `0x${Math.random().toString(16).substr(2, 40)}`;
    const newWallet = {
      address,
      balance: 1000,
      network: 'Polygon',
      created: new Date().toISOString(),
    };
    setWallet(newWallet);
    onWalletCreated?.(newWallet);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-indigo-400" />
          Your Practice Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!wallet ? (
          <div className="text-center py-8">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-4">Create a practice wallet to interact with DeFi markets</p>
            <Button onClick={createWallet} className="bg-indigo-600 hover:bg-indigo-700">
              Create Wallet
            </Button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border-2 border-indigo-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">Wallet Address</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyAddress}
                  className="h-6 px-2 text-xs"
                >
                  {copied ? (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
              <div className="font-mono text-xs text-slate-300 break-all">{wallet.address}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 border border-slate-700 rounded p-3">
                <div className="text-xs text-slate-400 mb-1">Balance</div>
                <div className="text-xl font-bold text-emerald-400">${wallet.balance}</div>
                <div className="text-xs text-slate-500">USDC</div>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded p-3">
                <div className="text-xs text-slate-400 mb-1">Network</div>
                <div className="text-xl font-bold text-violet-400">{wallet.network}</div>
                <div className="text-xs text-slate-500">Testnet</div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-3 text-xs text-emerald-300">
              ✅ Wallet created! This is a practice wallet with fake money. Use it to interact with all the demos below.
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}