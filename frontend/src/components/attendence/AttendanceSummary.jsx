import Card from "../Statecard";

const AttendanceSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card title="Total Days" value={summary.total} color="border-blue-600" />
      <Card title="Present" value={summary.present} color="border-green-600" />
      <Card title="Absent" value={summary.absent} color="border-red-600" />
      <Card title="On Leave" value={summary.leave} color="border-orange-500" />
      <Card title="Late" value={summary.late} color="border-yellow-500" />
    </div>
  );
};

export default AttendanceSummary;
