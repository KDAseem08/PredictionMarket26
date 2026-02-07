import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, CheckCircle } from 'lucide-react';

export default function BlockchainVisualizer() {
  const [blocks, setBlocks] = useState([
    { id: 1, hash: '0x7a9b...', transactions: ['Alice creates market'], validated: true },
  ]);
  const [animatingBlock, setAnimatingBlock] = useState(null);

  const addBlock = (action) => {
    const newBlock = {
      id: blocks.length + 1,
      hash: `0x${Math.random().toString(16).substr(2, 4)}...`,
      transactions: [action],
      validated: false,
    };

    setAnimatingBlock(newBlock);
    setTimeout(() => {
      setBlocks([...blocks, { ...newBlock, validated: true }]);
      setAnimatingBlock(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => addBlock('Bob buys YES at $0.50')} className="bg-emerald-600 hover:bg-emerald-700">
          Trade: Buy YES
        </Button>
        <Button onClick={() => addBlock('Carol buys NO at $0.50')} className="bg-rose-600 hover:bg-rose-700">
          Trade: Buy NO
        </Button>
        <Button onClick={() => addBlock('David adds $500 liquidity')} className="bg-blue-600 hover:bg-blue-700">
          Add Liquidity
        </Button>
        <Button onClick={() => addBlock('Market resolved: YES')} className="bg-violet-600 hover:bg-violet-700">
          Resolve Market
        </Button>
      </div>

      {/* Blockchain Display */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h4 className="font-semibold text-slate-100">Blockchain Ledger</h4>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {blocks.map((block, idx) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 border border-slate-600 rounded p-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-indigo-400">Block #{block.id}</span>
                    {block.validated && <CheckCircle className="w-3 h-3 text-green-400" />}
                  </div>
                  <div className="text-xs font-mono text-slate-500 mb-2">Hash: {block.hash}</div>
                  <div className="text-sm text-slate-300">{block.transactions[0]}</div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Animating Block */}
          <AnimatePresence>
            {animatingBlock && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-amber-500/20 border-2 border-amber-500 rounded p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-amber-400">Validating Block #{animatingBlock.id}...</span>
                </div>
                <div className="text-sm text-slate-300">{animatingBlock.transactions[0]}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3 text-xs text-indigo-300">
        💡 <strong>Key Point:</strong> Every action (trade, liquidity add, resolution) is recorded as a transaction in a block. Once validated, it's permanent and visible to everyone.
      </div>
    </div>
  );
}