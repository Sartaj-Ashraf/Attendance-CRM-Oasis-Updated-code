const MonthRangeFilter = ({
  fromMonth,
  toMonth,
  onFromChange,
  onToChange,
  onSubmit,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Attendance Filter
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="month"
          value={fromMonth}
          onChange={(e) => onFromChange(e.target.value)}
          className="bg-gray-50 border px-4 py-2 rounded-lg"
        />

        <input
          type="month"
          value={toMonth}
          onChange={(e) => onToChange(e.target.value)}
          className="bg-gray-50 border px-4 py-2 rounded-lg"
        />

        <button
          onClick={onSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Find
        </button>
      </div>
    </div>
  );
};

export default MonthRangeFilter;
