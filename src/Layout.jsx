import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Menu, X, TrendingUp, BookOpen, Calculator, Users, Boxes, Brain, Coins } from 'lucide-react';

const modules = [
  { id: 'fundamentals', name: 'Fundamentals', icon: BookOpen, path: 'Fundamentals', order: 1 },
  { id: 'pricing', name: 'Contract Pricing', icon: Calculator, path: 'Pricing', order: 2 },
  { id: 'dynamics', name: 'Market Dynamics', icon: Users, path: 'MarketDynamics', order: 3 },
  { id: 'opportunity', name: 'Opportunity Markets', icon: TrendingUp, path: 'Opportunity', order: 4 },
  { id: 'sandbox', name: 'Sandbox', icon: Boxes, path: 'Sandbox', order: 5 },
  { id: 'strategies', name: 'Trading Strategies', icon: Brain, path: 'Strategies', order: 6 },
  { id: 'defi', name: 'DeFi Integration', icon: Coins, path: 'DeFi', order: 7 },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <style>{`
        :root {
          --primary: 99 102 241;
          --success: 34 197 94;
          --warning: 234 179 8;
          --danger: 239 68 68;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-xl font-bold">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Prediction Market Academy
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = currentPageName === module.path;
                return (
                  <Link
                    key={module.id}
                    to={createPageUrl(module.path)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{module.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 space-y-2">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = currentPageName === module.path;
                return (
                  <Link
                    key={module.id}
                    to={createPageUrl(module.path)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{module.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-500">
          <p>Interactive learning platform for prediction markets • Built for curious minds</p>
        </div>
      </footer>
    </div>
  );
}