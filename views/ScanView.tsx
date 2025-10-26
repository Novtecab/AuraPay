import React, { useEffect, useRef, useState } from 'react';

const ScanView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const enableCamera = async () => {
      setCameraError(null); // Reset error on each attempt
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        if (err instanceof DOMException) {
          switch (err.name) {
            case 'NotAllowedError':
              setCameraError("Camera access denied. Please enable camera permissions in your browser settings to use this feature.");
              break;
            case 'NotFoundError':
              setCameraError("No camera found on this device. Please use a device with a camera.");
              break;
            case 'NotReadableError':
              setCameraError("Could not access the camera. Another application might be using it, or there might be a hardware issue.");
              break;
            case 'OverconstrainedError':
              setCameraError("Could not find a camera that meets the requirements.");
              break;
            default:
              setCameraError("An unexpected error occurred while accessing the camera.");
          }
        } else {
          setCameraError("An unexpected error occurred while accessing the camera.");
        }
      }
    };

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [retryCount]);

  const handleSimulateScan = () => {
    setPaymentStatus('success');
    setTimeout(() => {
        setPaymentStatus('scanning');
    }, 3000);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const renderContent = () => {
    if (paymentStatus === 'success') {
      return (
        <div className="text-center text-white p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-400 mx-auto animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold mt-4">Payment Successful!</h2>
            <p className="text-lg mt-2">Thank you for your purchase.</p>
        </div>
      );
    }

    if (cameraError) {
      return (
        <div className="text-center text-white p-8 flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-4 max-w-sm">{cameraError}</p>
            <button
              onClick={handleRetry}
              className="mt-6 bg-amber-500 text-slate-900 font-bold py-2 px-6 rounded-full hover:bg-amber-400 transition-colors transform active:scale-95 duration-150"
            >
              Try Again
            </button>
        </div>
      );
    }
    
    return (
      <>
        <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover -z-10"></video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-4">
            <h1 className="text-2xl font-bold mb-4">Scan QR to Pay</h1>
            <div className="relative w-64 h-64">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
            <p className="mt-6 text-center">Position the QR code within the frame to complete your purchase instantly.</p>
            <button
                onClick={handleSimulateScan}
                className="mt-8 bg-amber-500 text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-amber-400 transition-colors"
            >
                Simulate Scan
            </button>
        </div>
      </>
    );
  };
  
  return (
    <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
      <style>{`
          @keyframes scan {
              0% { transform: translateY(-120px); }
              50% { transform: translateY(120px); }
              100% { transform: translateY(-120px); }
          }
      `}</style>
      {renderContent()}
    </div>
  );
};

export default ScanView;