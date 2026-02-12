const payrollSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  period: { type: String, required: true }, // "2025-12"
  baseSalary: { type: Number, required: true },
  workedDays: Number,
  presentDays: Number,
  absentDays: Number,
  lateDays: Number,
  overtimeHours: Number,
  leaveDays: Number,
  // Calculations
  grossSalary: Number,
  overtimePay: Number,
  deductions: { 
    latePenalty: Number, 
    absentPenalty: Number, 
    other: Number, 
    total: Number 
  },
  netSalary: Number,
  
  status: { type: String, enum: ['draft', 'processed', 'paid'], default: 'draft' },
  paidOn: Date,
  slipUrl: String, // S3/PDF link for payslip
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

payrollSchema.index({ user: 1, period: 1 }, { unique: true });
