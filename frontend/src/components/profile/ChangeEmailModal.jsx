// UI-polished version only (no logic changes)

/* ================= ChangeEmailModal ================= */
// import { useEffect, useState } from "react";
// import api from "../../axios/axios";
// import { toast } from "sonner";

// const ChangeEmailModal = ({ mode, defaultEmail, onPendingEmail, onClose }) => {
//   const [step, setStep] = useState(mode === "verify" ? "otp" : "email");
//   const [email, setEmail] = useState(defaultEmail || "");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendOtp = async (emailToSend) => {
//     try {
//       setLoading(true);
//       toast.loading("Sending OTP...");
//       await api.put("/auth/setPendingEmail", { email: emailToSend });
//       toast.dismiss();
//       toast.success("OTP sent");
//       setStep("otp");
//     } catch (err) {
//       toast.dismiss();
//       toast.error(err.response?.data?.message || "Failed to send OTP");
//       onClose(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (mode === "verify" && defaultEmail) sendOtp(defaultEmail);
//   }, []);

//   const verifyOtp = async () => {
//     if (!otp) return toast.error("Enter OTP");
//     try {
//       setLoading(true);
//       await api.post("/auth/verify-email-otp", { otp });
//       toast.success("Email verified");
//       onClose(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
//         {step === "email" && (
//           <>
//             <h3 className="text-xl font-semibold mb-1">Change Email</h3>
//             <p className="text-sm text-gray-500 mb-5">
//               Enter your new email address
//             </p>

//             <input
//               type="email"
//               value={email}
//               disabled={loading}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full border rounded-xl px-4 py-2.5 mb-6 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 disabled={loading}
//                 onClick={() => onClose(false)}
//                 className="px-4 py-2 rounded-xl border hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 disabled={loading}
//                 onClick={() => {
//                   if (!email) return toast.error("Enter email");
//                   onPendingEmail(email);
//                   sendOtp(email);
//                 }}
//                 className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
//               >
//                 {loading ? "Sending..." : "Continue"}
//               </button>
//             </div>
//           </>
//         )}

//         {step === "otp" && (
//           <>
//             <h3 className="text-xl font-semibold mb-1">Verify Email</h3>
//             <p className="text-sm text-gray-500 mb-5">
//               OTP sent to <span className="font-medium">{email}</span>
//             </p>

//             <input
//               value={otp}
//               disabled={loading}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               className="w-full border rounded-xl px-4 py-2.5 mb-6 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 disabled={loading}
//                 onClick={() => onClose(false)}
//                 className="px-4 py-2 rounded-xl border hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 disabled={loading}
//                 onClick={verifyOtp}
//                 className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
//               >
//                 {loading ? "Verifying..." : "Verify"}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChangeEmailModal;

// import { useEffect, useState } from "react";
// import api from "../../axios/axios"
// import { toast } from "sonner";

// const ChangeEmailModal = ({
//   mode,
//   defaultEmail,
//   onPendingEmail,
//   onClose,
// }) => {
//   const [step, setStep] = useState(
//     mode === "verify" ? "otp" : "email"
//   );

//   const [email, setEmail] = useState(defaultEmail || "");
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ================= SEND OTP ================= */
//   const sendOtp = async (emailToSend) => {
//     try {
//       setLoading(true);
//       toast.loading("Sending OTP...");

//       await api.put("/auth/setPendingEmail", {
//         email: emailToSend,
//       });

//       toast.dismiss();
//       toast.success("OTP sent");
//       setStep("otp");
//     } catch (err) {
//       toast.dismiss();
//       toast.error(err.response?.data?.message || "Failed to send OTP");
//       onClose(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= AUTO RESEND (UNVERIFIED) ================= */
//   useEffect(() => {
//     if (mode === "verify" && defaultEmail) {
//       sendOtp(defaultEmail);
//     }
//   }, []);

//   /* ================= VERIFY OTP ================= */
//   const verifyOtp = async () => {
//     if (!otp) return toast.error("Enter OTP");

//     try {
//       setLoading(true);
//       await api.post("/auth/verify-email-otp", { otp });
//       toast.success("Email verified");
//       onClose(true);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">

//         {/* ================= ENTER EMAIL ================= */}
//         {step === "email" && (
//           <>
//             <h3 className="text-lg font-semibold mb-4">
//               Change Email
//             </h3>

//             <input
//               type="email"
//               value={email}
//               disabled={loading}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter new email"
//               className="w-full border rounded-lg px-4 py-2 mb-4 disabled:bg-gray-100"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 disabled={loading}
//                 onClick={() => onClose(false)}
//                 className="px-4 py-2 border rounded-lg disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 disabled={loading}
//                 onClick={() => {
//                   if (!email) return toast.error("Enter email");
//                   onPendingEmail(email);
//                   sendOtp(email);
//                 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60"
//               >
//                 {loading ? "Sending OTP..." : "Next"}
//               </button>
//             </div>
//           </>
//         )}

//         {/* ================= OTP ================= */}
//         {step === "otp" && (
//           <>
//             <h3 className="text-lg font-semibold mb-2">
//               Verify Email
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Enter OTP sent to <b>{email}</b>
//             </p>

//             <input
//               value={otp}
//               disabled={loading}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="Enter OTP"
//               className="w-full border rounded-lg px-4 py-2 mb-4 disabled:bg-gray-100"
//             />

//             <div className="flex justify-end gap-3">
//               <button
//                 disabled={loading}
//                 onClick={() => onClose(false)}
//                 className="px-4 py-2 border rounded-lg disabled:opacity-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 disabled={loading}
//                 onClick={verifyOtp}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-60"
//               >
//                 {loading ? "Verifying..." : "Verify"}
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChangeEmailModal;
import { useEffect, useState } from "react";
import api from "../../axios/axios";
import { toast } from "sonner";

const ChangeEmailModal = ({
  mode,               // "change" | "verify"
  defaultEmail,
  onPendingEmail,
  onClose,
}) => {
  const [step, setStep] = useState(mode === "verify" ? "otp" : "email");
  const [email, setEmail] = useState(defaultEmail || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SEND OTP (NEW EMAIL) ================= */
  const sendOtp = async (emailToSend) => {
    try {
      setLoading(true);
      toast.loading("Sending OTP...");

      await api.put("/auth/setPendingEmail", { email: emailToSend });

      toast.dismiss();
      toast.success("OTP sent");
      setStep("otp");
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP (UNVERIFIED) ================= */
  const resendOtp = async () => {
    try {
      setLoading(true);
      toast.loading("Resending OTP...");

      await api.post("/auth/resendOtp");

      toast.dismiss();
      toast.success("OTP resent");
      setStep("otp");
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= AUTO RESEND WHEN UNVERIFIED ================= */
  useEffect(() => {
    if (mode === "verify") {
      resendOtp();
    }
    // eslint-disable-next-line
  }, []);

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setLoading(true);

      const res = await api.post("/auth/verifyEmail", { otp });

      toast.success("Email verified");
      onClose(true, res.data.email);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

        {/* ================= EMAIL STEP ================= */}
        {step === "email" && (
          <>
            <h3 className="text-xl font-semibold mb-2">Change Email</h3>
            <p className="text-sm text-gray-500 mb-5">
              Enter your new email address
            </p>

            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded-xl px-4 py-2.5 mb-6"
            />

            <div className="flex justify-end gap-3">
              <button
                disabled={loading}
                onClick={() => onClose(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={() => {
                  if (!email) return toast.error("Enter email");
                  onPendingEmail(email);
                  sendOtp(email);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white"
              >
                {loading ? "Sending..." : "Next"}
              </button>
            </div>
          </>
        )}

        {/* ================= OTP STEP ================= */}
        {step === "otp" && (
          <>
            <h3 className="text-xl font-semibold mb-2">Verify Email</h3>
            <p className="text-sm text-gray-500 mb-5">
              OTP sent to <span className="font-medium">{email}</span>
            </p>

            <input
              value={otp}
              disabled={loading}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border rounded-xl px-4 py-2.5 mb-6"
            />

            <div className="flex justify-end gap-3">
              <button
                disabled={loading}
                onClick={() => onClose(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={verifyOtp}
                className="px-5 py-2 rounded-xl bg-green-600 text-white"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangeEmailModal;

