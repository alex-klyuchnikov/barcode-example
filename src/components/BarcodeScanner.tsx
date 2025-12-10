import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import React, { useMemo } from 'react';
import { useZxing } from 'react-zxing';

interface BarcodeScannerProps {
  onResult: (result: string) => void;
  onError?: (error: unknown) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onResult, onError }) => {
  const hints = useMemo(() => new Map<DecodeHintType, any>([
    [DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.CODE_128,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_39,
      BarcodeFormat.ITF
    ]]
  ]), []);

  const { ref } = useZxing({
    onDecodeResult(result) {
      onResult(result.getText());
    },
    onDecodeError() {
       // Silent error for no code found in frame
    },
    onError(error) {
        if (onError) onError(error);
        console.error("Camera/Scanner error:", error);
    },
    hints,
    timeBetweenDecodingAttempts: 300,
    constraints: {
      video: {
        facingMode: 'environment'
      }
    }
  });

  return (
    <div className="scanner-container">
        <video ref={ref} className="scanner-video" />
    </div>
  );
};
