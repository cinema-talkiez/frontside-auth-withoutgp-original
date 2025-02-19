import { useState } from "react";
import { useRouter } from "next/router";
import { FcApproval } from "react-icons/fc";

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleVerification = async () => {
    setIsVerifying(true);
    setErrorMessage("");

    // GPLinks API token and callback URL
    const apiToken = "e5bf7301b4ad442d45481de99fd656a182ec6507";
    const callbackUrl = "https://injured-harriet-cinema-talkies-87f4a1d2.koyeb.app/verification-success/";
    const apiUrl = `https://api.gplinks.com/api?api=${apiToken}&url=${encodeURIComponent(callbackUrl)}&format=json`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const result = await response.json();

      console.log("GPLinks API Response:", result); // Debugging

      if (result.status === "success" && result.shortenedUrl) {
        let finalUrl = result.shortenedUrl;

        // Fix intent:// issue by converting it to a normal HTTPS link
        if (finalUrl.startsWith("intent://")) {
          finalUrl = finalUrl.replace("intent://", "https://");
          finalUrl = finalUrl.split("#Intent;")[0]; // Remove intent parameters
        }

        // Open the link in a new tab first (to avoid popup blocking)
        const newTab = window.open(finalUrl, "_blank");

        // Popunder trick: Bring the main window to focus after a delay
        setTimeout(() => {
          window.focus();
          if (newTab) newTab.blur(); // Push the ad behind
        }, 1500);
      } else {
        throw new Error(result.message || "Verification failed.");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="verificationContainer">
      <div className="verificationBox">
        <h2>Verify Your Access</h2>
        <p>Click the button below to verify yourself and gain access.</p>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button onClick={handleVerification} disabled={isVerifying} className="verifyButton">
          <FcApproval className="icon1" />
          {isVerifying ? "Verifying..." : "Verify Now"}
        </button>

        <p>After verification, you will be redirected back automatically.</p>
      </div>
    </div>
  );
}
