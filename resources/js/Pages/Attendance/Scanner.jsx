import React, { useRef, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import jsQR from 'jsqr';

export default function Scanner() {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                requestAnimationFrame(tick);
            })
            .catch(err => setError('Camera access denied'));
    }, []);

    const tick = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);
            if (code) {
                // The QR code should contain the scan URL (e.g., http://yourdomain/scan/TOKEN)
                try {
                    const url = new URL(code.data);
                    window.location.href = url.href; // redirect to the scan page
                } catch {
                    // If the QR contains just the token, build the URL
                    window.location.href = route('attendance.scan', code.data);
                }
                return;
            }
        }
        requestAnimationFrame(tick);
    };

    return (
        <>
            <Head title="Scan QR Code" />
            <div className="min-h-screen bg-black flex items-center justify-center">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <video ref={videoRef} className="w-full max-w-lg" />
                )}
            </div>
        </>
    );
}
