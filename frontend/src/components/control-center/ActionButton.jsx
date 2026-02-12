import React from "react";

const VARIANTS = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600",
  success: "bg-green-600 text-white hover:bg-green-700",
  info: "bg-blue-500 text-white hover:bg-blue-600",
};

const ActionButton = ({
  icon: Icon,
  text,
  description,
  variant = "primary",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-4 rounded-xl border border-border bg-muted hover:bg-muted/70 transition text-left"
    >
      <div
        className={`p-2 rounded-lg ${VARIANTS[variant]}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div>
        <p className="font-medium text-foreground">
          {text}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </button>
  );
};

export default ActionButton;
