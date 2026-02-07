import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Layers, FileCode, Wallet as WalletIcon, ArrowRight, CheckCircle2, Home } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import AIChat from '../components/AIChat';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import WalletSimulator from '../components/defi/WalletSimulator';
import BlockchainVisualizer from '../components/defi/BlockchainVisualizer';
import SmartContractDemo from '../components/defi/SmartContractDemo';
import SettlementVisualizer from '../components/defi/SettlementVisualizer';

export default function DeFi() {
  const [hasWallet, setHasWallet] = useState(false);

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
          current_module: 'defi',
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
        if (!completed.includes('defi')) {
          await base44.entities.UserProgress.update(progress.id, {
            completed_modules: [...completed, 'defi'],
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
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">DeFi Integration</h1>
            <p className="text-slate-400">Build your understanding from the ground up with interactive demos</p>
          </div>
        </div>

        {/* Step 1: What is a Blockchain? */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Step 1: Understanding Blockchain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-slate-300">
              <p>
                Think of a <strong className="text-indigo-400">blockchain</strong> as a <strong>shared spreadsheet that nobody can cheat on</strong>.
              </p>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-slate-100 mb-2">🏦 Traditional Database (Bank)</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Bank owns the database</li>
                  <li>Only bank can see all transactions</li>
                  <li>You trust the bank won't make errors or freeze your account</li>
                  <li>Example: Bank says you have $1,000, you have to believe them</li>
                </ul>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-300 mb-2">⛓️ Blockchain (Shared Ledger)</h4>
                <ul className="text-sm space-y-1 list-disc list-inside text-indigo-200">
                  <li>Thousands of computers hold identical copies</li>
                  <li>Everyone can see all transactions (it's public)</li>
                  <li>No single entity can alter history</li>
                  <li>Example: Everyone can verify you have $1,000 - it's recorded permanently</li>
                </ul>
              </div>
            </div>

            <BlockchainVisualizer />
          </CardContent>
        </Card>

        {/* Step 2: Create Your Wallet */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <WalletIcon className="w-5 h-5 text-violet-400" />
              Step 2: Your Digital Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-slate-300 space-y-2">
              <p>
                A <strong className="text-violet-400">wallet</strong> is like your account, but YOU control it completely. No bank can freeze it.
              </p>
              <p className="text-sm">
                <strong>Wallet address example:</strong> <code className="text-xs bg-slate-800 px-2 py-1 rounded">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</code>
              </p>
              <p className="text-sm text-slate-400">
                This is like your bank account number, but it's cryptographically secure and you don't need permission from anyone to create one.
              </p>
            </div>

            <WalletSimulator onWalletCreated={() => setHasWallet(true)} />
          </CardContent>
        </Card>

        {/* Step 3: Smart Contracts */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-emerald-400" />
              Step 3: Smart Contracts (The Magic)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-slate-300 space-y-3">
              <p>
                A <strong className="text-emerald-400">smart contract</strong> is <strong>code that runs automatically</strong> on the blockchain.
              </p>
              
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-slate-100 mb-3">📋 Traditional Contract</h4>
                <p className="text-sm mb-2"><em>"If Bitcoin hits $100k by Dec 31, Alice pays Bob $500"</em></p>
                <ul className="text-sm space-y-1 list-disc list-inside text-slate-400">
                  <li>Written on paper</li>
                  <li>Requires trust that Alice will pay</li>
                  <li>Might need a lawyer if dispute arises</li>
                  <li>Bob has to chase Alice for payment</li>
                </ul>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-300 mb-3">⚡ Smart Contract</h4>
                <p className="text-sm mb-2 text-emerald-200"><em>Same deal, but in code</em></p>
                <ul className="text-sm space-y-1 list-disc list-inside text-emerald-200">
                  <li>Code deployed on blockchain</li>
                  <li>Alice deposits $500 into contract upfront (she can't back out)</li>
                  <li>Contract automatically checks Bitcoin price on Dec 31</li>
                  <li>If price ≥ $100k: Bob automatically receives $500. If not: Alice gets refund</li>
                  <li>NO LAWYERS. NO TRUST NEEDED. AUTOMATIC.</li>
                </ul>
              </div>
            </div>

            <SmartContractDemo />
          </CardContent>
        </Card>

        {/* Step 4: How Prediction Markets Use DeFi */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Step 4: Prediction Markets on Blockchain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Now let's put it all together. Here's a REAL example with actual numbers:
            </p>

            <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-2 border-indigo-500/30 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-indigo-300 text-lg">📊 Live Market Example</h4>
              
              <div className="space-y-3 text-sm">
                <div className="bg-slate-900 rounded p-3">
                  <strong className="text-slate-100">Market Question:</strong>
                  <div className="text-indigo-300 mt-1">"Will Bitcoin reach $100,000 by Dec 31, 2026?"</div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="bg-slate-900 rounded p-3">
                    <div className="text-xs text-slate-400 mb-1">Liquidity Pools</div>
                    <div className="text-emerald-400 font-semibold">YES: $45,000</div>
                    <div className="text-rose-400 font-semibold">NO: $55,000</div>
                  </div>
                  <div className="bg-slate-900 rounded p-3">
                    <div className="text-xs text-slate-400 mb-1">Current Prices</div>
                    <div className="text-emerald-400 font-semibold">YES: $0.45</div>
                    <div className="text-rose-400 font-semibold">NO: $0.55</div>
                  </div>
                  <div className="bg-slate-900 rounded p-3">
                    <div className="text-xs text-slate-400 mb-1">Market's Belief</div>
                    <div className="text-indigo-400 font-semibold">45% chance YES</div>
                    <div className="text-slate-500 text-xs">55% chance NO</div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded p-4 space-y-2">
                  <div className="font-semibold text-slate-100">🎯 Scenario: You Think It Will Happen</div>
                  <div className="text-slate-300">
                    <div>1. You spend <span className="text-emerald-400 font-semibold">$100</span> to buy YES shares</div>
                    <div>2. At $0.45 per share, you get <span className="text-emerald-400 font-semibold">222 YES shares</span></div>
                    <div className="mt-2 text-xs text-slate-400">Smart contract updates:</div>
                    <div className="text-xs">   • YES pool: $45,000 → <span className="text-emerald-400">$45,100</span></div>
                    <div className="text-xs">   • YES price: $0.45 → <span className="text-emerald-400">$0.451</span> (slight increase)</div>
                    <div className="mt-2">3. Dec 31, 2026 arrives: Bitcoin = <span className="text-emerald-400 font-semibold">$102,000 ✅</span></div>
                    <div>4. Smart contract resolves: YES shares = $1 each</div>
                    <div className="mt-2 bg-emerald-500/20 border border-emerald-500/40 rounded p-2">
                      <div className="text-emerald-300">💰 <strong>Your Result:</strong></div>
                      <div className="text-emerald-400">222 shares × $1 = <span className="font-bold text-xl">$222</span></div>
                      <div className="text-emerald-400 font-semibold">Profit: $122 (122% return!)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded p-4 space-y-2">
                  <div className="font-semibold text-slate-100">❌ Alternate: If You Were Wrong</div>
                  <div className="text-slate-300">
                    <div>• Bitcoin only reaches $95,000 (didn't hit $100k)</div>
                    <div>• Smart contract resolves: YES shares = <span className="text-red-400">$0</span></div>
                    <div className="mt-2 bg-red-500/20 border border-red-500/40 rounded p-2">
                      <div className="text-red-400">💸 Your 222 shares are now worth: <span className="font-bold">$0</span></div>
                      <div className="text-red-400 font-semibold">Loss: -$100 (you lose your entire investment)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 5: Settlement Process */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Step 5: Automatic Settlement (The Beautiful Part)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Watch how the entire settlement happens <strong className="text-indigo-400">automatically</strong> without any humans involved:
            </p>

            <SettlementVisualizer />
          </CardContent>
        </Card>

        {/* Why This Matters */}
        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Why DeFi Changes Everything</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2">❌ Centralized (e.g., Regular Betting Site)</h4>
                  <ul className="text-sm space-y-1.5 text-slate-300">
                    <li>• Company holds your money</li>
                    <li>• You can't verify the odds are fair</li>
                    <li>• They can freeze your account</li>
                    <li>• Might not pay out if they go bankrupt</li>
                    <li>• Need to provide ID, bank details</li>
                    <li>• Geographic restrictions</li>
                    <li>• Takes days to withdraw</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-400 mb-2">✅ DeFi (e.g., Polymarket)</h4>
                  <ul className="text-sm space-y-1.5 text-slate-300">
                    <li>• Smart contract holds funds (you control them)</li>
                    <li>• All pricing logic is public code</li>
                    <li>• Nobody can freeze you out</li>
                    <li>• Automatic payouts, guaranteed by code</li>
                    <li>• Just connect wallet (anonymous)</li>
                    <li>• Open to anyone, anywhere</li>
                    <li>• Instant withdrawals</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-lg p-6 mb-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-2xl font-bold text-slate-100 mb-2">You Now Understand DeFi!</h3>
          <p className="text-slate-300 mb-4">
            You've learned blockchain basics, created a wallet, interacted with smart contracts, and seen automatic settlement in action. You're ready to explore real DeFi prediction markets!
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={markComplete} className="border-slate-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
            <Link to={createPageUrl('Home')}>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      <AIChat
        moduleContext="DeFi Integration - Ground Up"
        moduleData={{
          topic: 'Blockchain fundamentals, wallets, smart contracts, and automated settlement',
          hasWallet,
        }}
      />
    </div>
  );
}