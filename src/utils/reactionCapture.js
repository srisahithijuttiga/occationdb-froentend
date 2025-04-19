let reactionStream = null;

export const startReactionCapture = async (videoRef, pageName) => {
  try {
    // Request permission only once
    if (!reactionStream) {
      reactionStream = await navigator.mediaDevices.getUserMedia({ video: true });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = reactionStream;

      videoRef.current.onloadedmetadata = () => {
        captureFrame(videoRef.current, pageName);
      };
    }
  } catch (err) {
    console.warn("📷 Camera access failed:", err);
  }
};

export const captureFrame = (video, pageName) => {
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 120;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/png");

  const existing = JSON.parse(sessionStorage.getItem("reactionFrames") || "[]");
  const alreadyCaptured = existing.some((f) => f.page === pageName);
  if (!alreadyCaptured) {
    const updated = [...existing, { page: pageName, image: imageData }];
    sessionStorage.setItem("reactionFrames", JSON.stringify(updated));
    console.log(`✅ Captured frame for ${pageName}`);
  }
};

export const stopReactionCapture = () => {
  if (reactionStream) {
    reactionStream.getTracks().forEach((track) => track.stop());
    reactionStream = null;
    console.log("🛑 Webcam stopped");
  }
};

export const getCapturedFrames = () => {
  return JSON.parse(sessionStorage.getItem("reactionFrames") || "[]");
};

export const resetCapturedFrames = () => {
  sessionStorage.removeItem("reactionFrames");
};
