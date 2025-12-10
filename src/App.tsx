import { useState } from 'react';
import './App.css';
import { BarcodeScanner } from './components/BarcodeScanner';

interface ScannedItem {
  code: string;
  timestamp: number;
}

function App() {
  const [scannedCodes, setScannedCodes] = useState<ScannedItem[]>([]);

  const handleScan = (code: string) => {
    setScannedCodes((prev) => {
      // Avoid adding the same code immediately after itself to prevent flooding
      if (prev.length > 0 && prev[prev.length - 1].code === code) {
        return prev;
      }
      return [...prev, { code, timestamp: Date.now() }];
    });
  };

  const clearList = () => {
    setScannedCodes([]);
  };

  return (
    <div className="app-container">
      <h1>Barcode Scanner</h1>
      <p>Point your camera at a barcode or QR code.</p>
      
      <div className="scanner-wrapper">
        <BarcodeScanner 
          onResult={handleScan} 
          onError={(error) => console.error(error)}
        />
      </div>

      <div className="list-controls">
        <button onClick={clearList} disabled={scannedCodes.length === 0}>
          Clear List
        </button>
      </div>

      {scannedCodes.length > 0 && (
        <div className="results-list-container">
          <h2>Scanned Codes ({scannedCodes.length})</h2>
          <ul className="results-list">
            {/* Show latest scans at the top? Or bottom? Usually top is better for history.
                But user asked for "list of scanned codes", usually chronological order (append).
                Let's stick to append (bottom) but maybe scroll to bottom?
                Or reverse map for display. Let's display newest first (reverse). */}
            {[...scannedCodes].reverse().map((item) => (
              <li key={item.timestamp} className="result-item">
                <span className="code-text">{item.code}</span>
                <span className="timestamp">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
