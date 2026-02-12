import React from "react";
import { FlipWords } from "../ui/flip-words";

export function FlipWordsDemo({ role = "employee" }) {
  const roleWords = {
   employee: ["attendance", "leave requests", "salary"],
    manager: ["team attendance", "leave approvals", "reports", "performance"],
    owner: ["employees", "attendance", "departments", "analytics", "control"],
  };

  const words = roleWords[role];

  return (
    <div className="h-screen flex justify-center items-center  bg-black  px-4">
      <div className="text-4xl mx-auto font-medium text-neutral-700 dark:text-neutral-300 text-center leading-snug">
        Manage
        <FlipWords words={words} />
        <br />
        with one smart platform
      </div>
    </div>
  );
}
