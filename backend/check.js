export const upsertAttendanceByOwner = async (req, res) => {
  try {
    const { userId, statusId, date } = req.body;

    if (!userId || !statusId) {
      return res.status(400).json({ msg: "userId and statusId are required" });
    }

    const attendanceDate = date
      ? new Date(date).setHours(0, 0, 0, 0)
      : new Date().setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { user: userId, date: attendanceDate },   // 🔍 search
      {
        status: statusId,
        markedBy: req.user._id                  // OWNER
      },
      {
        new: true,
        upsert: true                            // ⭐ magic
      }
    );

    return res.status(200).json({
      msg: "Attendance saved successfully",
      attendance
    });

  } catch (e) {
    // duplicate key error (extra safety)
    if (e.code === 11000) {
      return res.status(409).json({ msg: "Attendance already exists" });
    }

    return res.status(500).json({
      msg: "Internal server error",
      error: e.message
    });
  }
};
