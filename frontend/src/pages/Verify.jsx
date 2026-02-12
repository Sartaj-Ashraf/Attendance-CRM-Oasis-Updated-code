import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SetPassword from "./SetPassword";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {

    axios
      .get("http://localhost:5000/user/verifyToken", {
        params: { email, token },
      })
      .then((res) => {
        setTimeout(() => {
          setUser(res.data);
          setLoading(false);
          setVerifying(true);
  
        }, 1500);
      })
      .catch((err) => {
        setTimeout(() => {
          setLoading(false);
          setVerifying(false);
          const msg = err.response?.data?.message || "Verification failed";
          setError(msg);
        }, 1500);
      });
  }, [email, token]);

  return (
    <>


      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
        <div className="w-full max-w-md backdrop-blur-xl borderrounded-2xl shadow-2xl p-8 transition-all duration-300">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center gap-4 text-white">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <h2 className="text-xl font-semibold tracking-wide">
                Verifying your account...
              </h2>
              <p className="text-sm text-gray-300">
                Please wait while we validate your link
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-300 text-sm">{error}</p>
            </div>
          )}

          {/* Success State */}
          {!loading && verifying && user && <SetPassword data={user} />}
        </div>
      </div>
    </>
  );
};

export default Verify;
