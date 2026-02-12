import React from "react";

const StatCard = ({ label, value, icon: Icon, trend }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
      <div className="p-3 rounded-xl bg-muted">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      <div className="flex-1">
        <p className="text-sm text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground">
          {value}
        </p>

        {trend && (
          <p
            className={`text-xs mt-1 ${
              trend.positive
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {trend.positive ? "▲" : "▼"} {trend.value}%
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
