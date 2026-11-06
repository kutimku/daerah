"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";

export default function CetakQRPage() {
  const params = useParams();
  const [qrUrl, setQrUrl] = useState("");
  const [urlAbsen, setUrlAbsen] = useState("");

  useEffect(() => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/absen/${params.kegiatanId}`;
    setUrlAbsen(link);

    // Generate QR
    QRCode.toDataURL(link, { width: 600, margin: 2 }, (err, url) => {
      if (!err) setQrUrl(url);
    });
  }, [params.kegiatanId]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">ABSENSI KEHADIRAN</h1>
        <p className="text-xl text-gray-600 mt-2">Pengajian Kutai Timur</p>
      </div>

      {qrUrl ? (
        <img
          src={qrUrl}
          alt="QR Code Absensi"
          className="w-80 h-80 border-4 border-gray-800 rounded-2xl"
        />
      ) : (
        <div className="w-80 h-80 bg-gray-100 flex items-center justify-center rounded-2xl">
          Memuat QR...
        </div>
      )}

      <div className="mt-8 text-center space-y-2">
        <p className="text-xl font-medium text-gray-800">
          Scan QR Code ini untuk absen
        </p>
        <p className="text-sm text-gray-500 break-all max-w-md">{urlAbsen}</p>
        <p className="text-sm text-gray-400 mt-4 italic">
          *Kertas ini ditempel di lokasi kegiatan. Silakan scan menggunakan
          kamera HP.
        </p>
      </div>

      <button
        onClick={() => window.print()}
        className="mt-10 bg-gray-800 text-white px-6 py-2 rounded-lg print:hidden"
      >
        🖨️ Cetak Kertas
      </button>
    </div>
  );
}
