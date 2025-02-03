import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const router = useRouter();

  // Function to check token validity
  const checkTokenValidity = () => {
    const storedValidToken = localStorage.getItem("validToken");
    const storedExpirationTime = localStorage.getItem("validTokenExpiration");

    if (storedValidToken === "true" && storedExpirationTime) {
      if (Date.now() < parseInt(storedExpirationTime)) {
        setValidToken(true); // Token is valid
      } else {
        // Token expired
        setValidToken(false);
        localStorage.removeItem("validToken");
        localStorage.removeItem("validTokenExpiration");
      }
    } else {
      setValidToken(false);
    }
    setCheckingToken(false);
  };

  useEffect(() => {
    checkTokenValidity(); // Check on mount

    // Listen for storage changes (for when `validToken` updates in verification-success.js)
    const handleStorageChange = () => {
      checkTokenValidity();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="container">
      {checkingToken ? (
        <p className="loading-text">Checking token...</p>
      ) : (
        <>
          {!validToken && (
            <button onClick={() => router.push("/verify")} className="verifyButton">
              Verify Now
            </button>
          )}

          {validToken && (
            <Link href="/index1">
              <button className="visitButton">Visit HomePage</button>
            </Link>
          )}
        </>
      )}

      {/* Adding styles */}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }

        .loading-text {
          font-size: 18px;
          color: #555;
        }

        button {
          padding: 12px 24px;
          font-size: 18px;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          transition: 0.3s;
          margin: 10px;
          width: 200px;
        }

        .verifyButton {
          background-color: #ff5722;
          color: white;
        }

        .verifyButton:hover {
          background-color: #e64a19;
        }

        .visitButton {
          background-color: #4caf50;
          color: white;
        }

        .visitButton:hover {
          background-color: #388e3c;
        }
      `}</style>
    </div>
  );
}
