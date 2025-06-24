"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Car, Eye, Home, Laptop, Menu, Plane } from "lucide-react";
import { NeumorphicCard, NeumorphicButton, NeumorphicIconButton, NeumorphicBackground, NeumorphicProgressRing } from "@/components/ui/neumorphic";

// --- Goal Card Component ---
const GoalCard = ({ 
  icon, 
  title, 
  amount, 
  goal, 
  color, 
  progress 
}: { 
  icon: React.ElementType; 
  title: string; 
  amount: string; 
  goal: string; 
  color: string;
  progress: number;
}) => {
  return (
    <div className="bg-neumorphic-button p-4 rounded-[var(--neumorphic-radius-lg)] shadow-neumorphic-convex-sm border border-neumorphic-border/5 backdrop-blur-[var(--neumorphic-blur)] goal-card-enhanced">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <NeumorphicProgressRing
            icon={icon}
            progress={progress}
            color={color}
            size={52}
            strokeWidth={2.5}
          />
        </div>
        <div className="flex-grow min-w-0">
          <h2 className="text-lg font-semibold text-neumorphic-text-primary truncate mb-1">{title}</h2>
          <p className="text-sm text-neumorphic-text-secondary">
            <span className="text-neumorphic-accent font-medium">{amount}</span> / {goal}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const NeumorphicTestPage = () => {
  return (
    <NeumorphicBackground className="flex items-center justify-center">
      <NeumorphicCard className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <NeumorphicIconButton>
            <ArrowLeft className="w-5 h-5" />
          </NeumorphicIconButton>
          <h1 className="text-3xl font-bold text-neumorphic-text-primary">Savings</h1>
          <div className="flex items-center gap-3">
            <NeumorphicIconButton>
              <Eye className="w-5 h-5" />
            </NeumorphicIconButton>
            <NeumorphicIconButton>
              <Menu className="w-5 h-5" />
            </NeumorphicIconButton>
          </div>
        </div>

        {/* Total Saved */}
        <div className="text-center mb-8">
          <p className="text-neumorphic-text-secondary text-lg mb-2">Already Saved:</p>
          <p className="text-5xl font-bold text-neumorphic-text-primary">$6,307.99</p>
        </div>

        {/* Savings Goals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GoalCard 
            icon={Plane} 
            title="Trip to Paris" 
            amount="$5,000" 
            goal="$5,000" 
            color="#FF9A3E" 
            progress={100} 
          />
          <GoalCard 
            icon={Car} 
            title="New Car" 
            amount="$6,000" 
            goal="$12,000" 
            color="#3B82F6" 
            progress={50} 
          />
          <GoalCard 
            icon={Home} 
            title="New Apartment" 
            amount="$150,000" 
            goal="$600,000" 
            color="#8B5CF6" 
            progress={25} 
          />
          <GoalCard 
            icon={Laptop} 
            title="New MacBook" 
            amount="$500" 
            goal="$5,000" 
            color="#10B981" 
            progress={10} 
          />
        </div>

        {/* Create Goal Button */}
        <div className="mt-8">
          <NeumorphicButton className="w-full py-4 flex items-center justify-center gap-2">
            <span>Create new goal</span>
            <ArrowRight className="w-5 h-5" />
          </NeumorphicButton>
        </div>
      </NeumorphicCard>
    </NeumorphicBackground>
  );
};

export default NeumorphicTestPage; 