import React from "react";
import { BookOpen, ListOrdered, Heart, Clock, Sparkles, Award } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "reader", label: "المصحف", icon: BookOpen },
    { id: "index", label: "الفهرس", icon: ListOrdered },
    { id: "adhkar", label: "الأذكار والسبحة", icon: Heart },
    { id: "prayers", label: "المواقيت والقبلة", icon: Clock },
    { id: "tadabbur", label: "التدبر الذكي", icon: Sparkles },
    { id: "khatmah", label: "الختمة", icon: Award }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#12161F]/95 backdrop-blur-lg border-t border-[#2D3748] safe-area-pb">
      <div className="max-w-md md:max-w-2xl mx-auto px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 transition-all cursor-pointer min-w-[54px] relative ${
                isActive
                  ? "text-[#C5A059] font-bold"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {isActive && (
                <div className="absolute -top-1.5 w-6 h-0.5 bg-[#C5A059]" />
              )}
              <div
                className={`p-1.5 transition-colors ${
                  isActive ? "bg-[#1A202C] text-[#C5A059] border border-[#C5A059]/60 shadow-sm" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-1 whitespace-nowrap font-tajawal">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
