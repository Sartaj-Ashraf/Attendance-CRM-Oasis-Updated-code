export const canEditAttendance = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { role, canEditPastAttendance } = req.user;

  if (!req.body.date) {
    return res.status(400).json({ message: "Attendance date is required" });
  }

  const attendanceDate = new Date(req.body.date);
  if (isNaN(attendanceDate)) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  attendanceDate.setHours(0, 0, 0, 0);

  // Block employees
  if (role === "employee") {
    return res.status(403).json({ message: "Not allowed" });
  }

  // Editing past attendance
  if (attendanceDate < today) {
    if (role !== "owner" && !canEditPastAttendance) {
      return res.status(403).json({
        message: "You are not allowed to edit previous attendance",
      });
    }
  }

  next();
};
