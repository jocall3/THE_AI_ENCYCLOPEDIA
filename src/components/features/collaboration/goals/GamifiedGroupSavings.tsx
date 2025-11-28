```tsx
import React, a, { useState, useMemo, useEffect, FC } from 'react';
import { Target, Trophy, Users, TrendingUp, Plus, Star } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Member {
  id: string;
  name: string;
  avatar: string;
  contribution: number;
}

interface Milestone {
  amount: number;
  name: "Seed Starter" | "Growth Spurt" | "Money Tree" | "Goal Smasher";
  reward: string;
}

// --- MOCK DATA ---
const initialMembers: Member[] = [
  { id: 'user1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=alice', contribution: 1200 },
  { id: 'user2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=bob', contribution: 950 },
  { id: 'user3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=charlie', contribution: 1500 },
  { id: 'user4', name: 'Diana', avatar: 'https://i.pravatar.cc/150?u=diana', contribution: 750 },
  { id: 'user5', name: 'You', avatar: 'https://i.pravatar.cc/150?u=you', contribution: 1100 },
];

const GOAL_AMOUNT = 10000;
const predefinedMilestones: Milestone[] = [
  { amount: 2500, name: "Seed Starter", reward: "Bronze Saver Badge 🥉" },
  { amount: 5000, name: "Growth Spurt", reward: "Silver Saver Badge 🥈" },
  { amount: 7500, name: "Money Tree", reward: "Gold Saver Badge 🥇" },
  { amount: 10000, name: "Goal Smasher", reward: "Platinum Trophy 🏆" },
];

// --- HELPER COMPONENTS ---

const ProgressBar: FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 my-2 relative overflow-hidden">
    <div
      className="bg-gradient-to-r from-teal-400 to-blue-500 h-4 rounded-full transition-all duration-700 ease-out"
      style={{ width: `${value}%` }}
    />
  </div>
);

const MilestoneMarker: FC<{ milestone: Milestone; progress: number; goal: number }> = ({ milestone, progress, goal }) => {
  const position = (milestone.amount / goal) * 100;
  const isAchieved = progress >= position;

  return (
    <div className="absolute" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
      <div className={`relative flex flex-col items-center group cursor-pointer`}>
        <Trophy className={`w-6 h-6 transition-colors ${isAchieved ? 'text-yellow-400' : 'text-gray-400'}`} />
        <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {milestone.name}: ${milestone.amount.toLocaleString()}
          <br />
          Reward: {milestone.reward}
        </div>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

const GamifiedGroupSavings: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [contributionAmount, setContributionAmount] = useState<string>('');
  const [achievedMilestones, setAchievedMilestones] = useState<Milestone[]>([]);

  const currentTotal = useMemo(() => members.reduce((sum, member) => sum + member.contribution, 0), [members]);
  const progressPercentage = useMemo(() => (currentTotal / GOAL_AMOUNT) * 100, [currentTotal]);
  
  const sortedLeaderboard = useMemo(() => {
    return [...members].sort((a, b) => b.contribution - a.contribution);
  }, [members]);

  useEffect(() => {
    const newlyAchieved = predefinedMilestones.filter(
      ms => currentTotal >= ms.amount && !achievedMilestones.some(ams => ams.name === ms.name)
    );
    if (newlyAchieved.length > 0) {
      setAchievedMilestones(prev => [...prev, ...newlyAchieved]);
      // Here you could trigger a celebration animation
    }
  }, [currentTotal, achievedMilestones]);


  const handleContribution = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid contribution amount.");
      return;
    }

    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === 'user5'
          ? { ...member, contribution: member.contribution + amount }
          : member
      )
    );
    setContributionAmount('');
  };

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'border-yellow-400';
    if (rank === 1) return 'border-gray-400';
    if (rank === 2) return 'border-yellow-600';
    return 'border-transparent';
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-lg font-sans w-full max-w-4xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dream Vacation Fund</h1>
          <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
            <Users className="w-4 h-4 mr-2" />
            Group Savings Goal
          </p>
        </div>
        <div className="text-right mt-4 sm:mt-0">
          <p className="text-lg text-gray-600 dark:text-gray-300">Goal</p>
          <p className="text-3xl font-bold text-teal-500">${GOAL_AMOUNT.toLocaleString()}</p>
        </div>
      </header>

      {/* Progress Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl mb-6 shadow-sm">
        <div className="flex justify-between items-end mb-2">
            <div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">${currentTotal.toLocaleString()}</span>
                <span className="text-gray-500 dark:text-gray-400"> of ${GOAL_AMOUNT.toLocaleString()}</span>
            </div>
            <span className="font-semibold text-teal-500">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="relative pt-8">
            <ProgressBar value={progressPercentage} />
            <div className="absolute top-0 w-full h-full flex items-center">
                {predefinedMilestones.map(ms => (
                    <MilestoneMarker key={ms.name} milestone={ms} progress={progressPercentage} goal={GOAL_AMOUNT} />
                ))}
            </div>
        </div>
      </div>

      {/* Main Content: Contribution & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contribution Section */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
            <Plus className="w-5 h-5 mr-2 text-teal-500"/>
            Make a Contribution
          </h2>
          <form onSubmit={handleContribution}>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    placeholder="e.g., 50.00"
                    className="w-full pl-7 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-teal-500 rounded-lg outline-none transition"
                />
            </div>
            <button type="submit" className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
              Contribute Now
            </button>
          </form>
          
          <div className="mt-6">
             <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Milestones Achieved</h3>
             <ul className="space-y-2">
                {achievedMilestones.length > 0 ? achievedMilestones.map(ms => (
                     <li key={ms.name} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Star className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor"/>
                        <span>{ms.name}: {ms.reward}</span>
                     </li>
                )) : <p className="text-sm text-gray-500 dark:text-gray-400">Keep saving to unlock rewards!</p>}
             </ul>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-teal-500"/>
            Leaderboard
          </h2>
          <ul className="space-y-3">
            {sortedLeaderboard.map((member, index) => (
              <li key={member.id} className={`flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border-l-4 ${getRankColor(index)}`}>
                <div className="flex items-center w-1/2">
                    <span className="text-lg font-bold text-gray-400 dark:text-gray-500 w-8">{index + 1}</span>
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full mr-3 border-2 border-white dark:border-gray-600"/>
                    <span className={`font-semibold text-gray-800 dark:text-white ${member.id === 'user5' ? 'font-bold' : ''}`}>
                        {member.name}
                    </span>
                </div>
                <div className="w-1/2 text-right">
                    <span className="font-bold text-lg text-teal-500">${member.contribution.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GamifiedGroupSavings;
```