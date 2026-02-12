import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ toEmail, type, data }) => {
  const transporter = createTransporter();
  await transporter.verify();
  if (!type) {
    throw new Error("Email type is required");
  }
  /* ================= DYNAMIC CONTENT ================= */

  let subject = "";
  let title = "";
  let message = "";
  let actionText = "";
  let actionUrl = "";
  let footerText = "";

  if (type === "SET_PASSWORD") {
    subject = "Set Your Password – Attendance System";
    title = "Set Your Password";
    message = `
      You have been invited to access the <strong>Attendance System</strong>.
      Please click the button below to securely set your password.
    `;
    actionText = "Set Password";
    actionUrl = data.resetUrl;
    footerText = "⏰ This link will expire in 60 minutes.";
  }

  if (type === "VERIFY_OTP") {
    subject = "Verify Your Email – Attendance System";
    title = "Verify Your Email";
    message = `
      Your OTP for email verification is
      <strong style="font-size:18px;">${data.otp}</strong>.
    `;
    footerText = "⏰ OTP will expire in 10 minutes.";
  }

  if (type === "PASSWORD_CHANGED") {
    subject = "Password Changed – Attendance System";
    title = "Password Updated";
    message = `
      Your password has been changed successfully.
      If this was not you, please contact support immediately.
    `;
    footerText = "Security notification from Attendance System.";
  }

  /* ================= SEND MAIL ================= */
  if (!subject || !title || !message) {
    throw new Error(`Invalid email type: ${type}`);
  }
  await transporter.sendMail({
    from: `"Attendance System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html: `
      <div style="
        max-width: 600px;
        margin: 0 auto;
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f4f6f8;
        padding: 30px;
      ">
        <div style="
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        ">
          <h2 style="color:#1f2937; margin-bottom: 10px;">
            ${title}
          </h2>

          <p style="color:#4b5563; font-size:14px; line-height:1.6;">
            Hello,
          </p>

          <p style="color:#4b5563; font-size:14px; line-height:1.6;">
            ${message}
          </p>

          ${
            actionUrl
              ? `
              <div style="text-align:center; margin: 30px 0;">
                <a href="${actionUrl}"
                  style="
                    background-color:#2563eb;
                    color:#ffffff;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:6px;
                    font-size:15px;
                    font-weight:600;
                    display:inline-block;
                  "
                >
                  ${actionText}
                </a>
              </div>
            `
              : ""
          }

          <p style="color:#6b7280; font-size:13px; line-height:1.6;">
            ${footerText}
          </p>

          <hr style="border:none; border-top:1px solid #e5e7eb; margin:25px 0;" />

          <p style="color:#9ca3af; font-size:12px; text-align:center;">
            © ${new Date().getFullYear()} Attendance System. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });
};
