import React from "react";

const ControlCard = ({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  children,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl bg-muted ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">{children}</div>
    </div>
  );
};

export default ControlCard;
