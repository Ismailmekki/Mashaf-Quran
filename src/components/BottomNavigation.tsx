import React from "react";
import { BookOpen, ListOrdered, Heart, Clock, Sparkles, Award, Users, Globe } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "reader", label: "المصحف", icon: BookOpen },
    { id: "index", label: "الفهرس", icon: ListOrdered },
    { id: "reciters", label: "القراء", icon: Users },
    { id: "tadabbur", label: "التدبر الذكي", icon: Sparkles },
    { id: "adhkar", label: "الأذكار والسبحة", icon: Heart },
    { id: "prayers", label: "المواقيت", icon: Clock },
    { id: "khatmah", label: "الختمة", icon: Award }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#12161F]/95 backdrop-blur-lg border-t border-[#2D3748] safe-area-pb">
      <div className="max-w-4xl mx-auto px-1 sm:px-2 py-1.5 flex items-center justify-around overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 sm:px-2 transition-all cursor-pointer min-w-[48px] sm:min-w-[56px] relative ${
                isActive
                  ? "text-[#C5A059] font-bold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {isActive && (
                <div className="absolute -top-1.5 w-6 h-0.5 bg-[#C5A059]" />
              )}
              <div
                className={`p-1 sm:p-1.5 transition-colors ${
                  isActive ? "bg-[#1A202C] text-[#C5A059] border border-[#C5A059]/60 shadow-sm" : ""
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap font-tajawal">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
