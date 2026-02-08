import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calculator, Users, Boxes, Brain, Coins, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import AIChat from '../components/AIChat';

const modules = [
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    icon: BookOpen,
    path: 'Fundamentals',
    description: 'Learn what prediction markets are and how they work',
    difficulty: 'Beginner',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'pricing',
    name: 'Contract Pricing',
    icon: Calculator,
    path: 'Pricing',
    description: 'Understand the mathematics behind contract pricing',
    difficulty: 'Intermediate',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'dynamics',
    name: 'Market Dynamics',
    icon: Users,
    path: 'MarketDynamics',
    description: 'Explore participant roles and market incentives',
    difficulty: 'Intermediate',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'opportunity',
    name: 'Opportunity Market',
    icon: TrendingUp,
    path: 'Opportunity',
    description: 'Master how opportunity markets aggregate global truth',
    difficulty: 'Intermediate',
    color: 'from-rose-500 to-rose-500',
  },
  {
    id: 'sandbox',
    name: 'Interactive Sandbox',
    icon: Boxes,
    path: 'Sandbox',
    description: 'Simulate full markets with multiple traders',
    difficulty: 'Advanced',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'strategies',
    name: 'Trading Strategies',
    icon: Brain,
    path: 'Strategies',
    description: 'Learn and test different trading approaches',
    difficulty: 'Advanced',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'defi',
    name: 'DeFi Integration',
    icon: Coins,
    path: 'DeFi',
    description: 'Discover how DeFi enhances prediction markets',
    difficulty: 'Advanced',
    color: 'from-amber-500 to-yellow-500',
  },
];

export default function Home() {
  const [progress, setProgress] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const progressRecords = await base44.entities.UserProgress.filter({
        created_by: currentUser.email,
      });

      if (progressRecords.length > 0) {
        setProgress(progressRecords[0]);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const isModuleCompleted = (moduleId) => {
    return progress?.completed_modules?.includes(moduleId) || false;
  };

  const completedCount = progress?.completed_modules?.length || 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-indigo-400">Interactive Learning Platform</span>
        </div>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Master Prediction Markets
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
          From fundamentals to advanced strategies, learn how prediction markets like Polymarket work
          through interactive simulations and hands-on exploration.
        </p>

        {progress && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Your Progress</span>
              <span className="text-sm font-semibold text-indigo-400">
                {completedCount} / {modules.length} modules
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${(completedCount / modules.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Learning Path */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-100">Learning Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, idx) => {
            const Icon = module.icon;
            const completed = isModuleCompleted(module.id);

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={createPageUrl(module.path)}>
                  <Card className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-all cursor-pointer h-full group">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {completed && (
                          <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {module.name}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400">
                          {module.difficulty}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-indigo-400 mb-2">6</div>
            <p className="text-slate-400 text-sm">Interactive Modules</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-violet-400 mb-2">∞</div>
            <p className="text-slate-400 text-sm">Sandbox Simulations</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-400 mb-2">AI</div>
            <p className="text-slate-400 text-sm">Contextual Tutor</p>
          </CardContent>
        </Card>
      </div>

      <AIChat moduleContext="Home - Overview" />
    </div>
  );
}