"use client";

import React, { useEffect, useState } from "react";
import { Search, X, Filter, ShieldCheck, ChevronDown } from "lucide-react"; // npm install lucide-react

const SearchFilter = ({
  searchValue,
  onSearchChange,
  selectValue,
  onSelectChange,
  selectOptions = [],
  optionLabel = "name",
  optionValue = "_id",
  verificationValue,
  onVerificationChange,
  searchPlaceholder = "Search records...",
  debounceDelay = 400,
  showSelect = true,
  showVerification = true,
  showClear = true,
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue);

  // sync external search
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [localSearch, debounceDelay, onSearchChange]);

  const handleClear = () => {
    setLocalSearch("");
    onSearchChange("");
    onSelectChange?.("");
    onVerificationChange?.("all");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full items-center">
      
      {/* SEARCH INPUT GROUP */}
      <div className="relative w-full lg:flex-1 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
        />

        {showClear && localSearch && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        {/* DEPARTMENT SELECT */}
        {showSelect && (
          <div className="relative w-full sm:w-48 group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Filter size={16} />
            </div>
            <select
              value={selectValue}
              onChange={(e) => onSelectChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm"
            >
              <option value="">All Departments</option>
              {Array.isArray(selectOptions) &&
                selectOptions.map((opt) => (
                  <option key={opt[optionValue]} value={opt[optionValue]}>
                    {opt[optionLabel]}
                  </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown size={14} />
            </div>
          </div>
        )}

        {/* VERIFICATION STATUS SELECT */}
        {showVerification && (
          <div className="relative w-full sm:w-44 group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ShieldCheck size={16} />
            </div>
            <select
              value={verificationValue}
              onChange={(e) => onVerificationChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm"
            >
              <option value="all">Every User</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown size={14} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;