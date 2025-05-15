"use client";

import React, { useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import ReactToPrint from "react-to-print";
import useAuthStore from "../../../stores/authStore";

function KartuComponent({ user, qrcode }) {
  return (
    <div className="cards-container space-y-8 p-4 bg-white">
      {/* Front Card */}
      <div
        id="front-card"
        className="bg-blue-700 text-white rounded-xl overflow-hidden shadow-xl w-[85mm] h-[54mm] flex border border-blue-500"
      >
        <div className="w-2/5 bg-blue-900 flex flex-col justify-center items-center py-3 px-3">
          <div className="bg-white p-2 rounded-lg mb-2 shadow-md">
            <QRCode value={qrcode} size={120} className="w-full h-auto" />
          </div>
          <p className="text-center text-xs font-medium text-blue-100">
            Scan untuk verifikasi
          </p>
        </div>
        <div className="w-3/5 pl-3 flex flex-col py-4 pr-3">
          <div className="flex items-center">
            <Image
              src="/img/logossg_white.png"
              alt="Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <div>
              <h3 className="text-lg font-bold leading-none tracking-wide">
                SANTRI SIAP
              </h3>
              <h3 className="text-lg font-bold leading-none tracking-wide">
                GUNA
              </h3>
              <p className="text-xs text-white font-medium">KARTU PESERTA</p>
            </div>
          </div>
          <div className="flex-grow flex flex-col justify-center mt-2">
            <h2 className="text-xl font-bold mb-2 text-white">{user?.name}</h2>
            <div className="space-y-2">
              <div className="bg-blue-800 py-1.5 px-3 rounded-md text-sm font-medium">
                Peserta Angkatan 2025
              </div>
              <div className="bg-blue-800 py-1.5 px-3 rounded-md text-sm font-medium">
                Pleton: {user?.pleton} / Grup: {user?.grup}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Card */}
      <div
        id="back-card"
        className="bg-white rounded-xl overflow-hidden shadow-xl w-[85mm] h-[54mm] flex flex-col border border-gray-200"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 pt-2 pb-1 border-b border-gray-100">
            <Image
              src="/img/logo_ssg.png"
              alt="Logo SSG"
              width={80}
              height={22}
            />
            <Image
              src="/img/logo_DT READY.png"
              alt="Logo DT"
              width={24}
              height={24}
            />
          </div>
          <div className="text-center my-1">
            <h3 className="text-sm font-bold text-blue-900">
              ATURAN PENGGUNAAN KARTU
            </h3>
          </div>
          <div className="flex-grow px-4 pb-1">
            <ol className="text-xs text-gray-800 list-decimal ml-4 space-y-0.5">
              <li>Kartu ini adalah identitas resmi peserta SSG</li>
              <li>Wajib dibawa saat kegiatan SSG berlangsung</li>
              <li>Tunjukkan QR code untuk presensi kehadiran</li>
              <li>Segera laporkan kehilangan kartu kepada panitia</li>
            </ol>
          </div>
          <div className="bg-blue-50 py-1.5 px-4 text-xs text-blue-800 font-semibold text-center border-t border-blue-100">
            Kartu ini hanya berlaku selama program Santri Siap Guna 2025
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ECard() {
  const { user, loading, error, qrcode, fetchUserQRCode } = useAuthStore();
  const componentRef = useRef();

  useEffect(() => {
    fetchUserQRCode();
  }, [fetchUserQRCode]);

  const navigateBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !qrcode || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Data tidak ditemukan.</p>
          <button
            onClick={navigateBack}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Head>
        <title>Kartu Peserta</title>
      </Head>

      <h1 className="text-2xl font-bold text-center mb-6 print:hidden">
        Kartu Peserta Digital
      </h1>

      <div className="flex justify-center mb-8 print:hidden">
        <ReactToPrint
          trigger={() => (
            <button className="bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800">
              Cetak Kartu
            </button>
          )}
          content={() => componentRef.current}
          pageStyle="@page { size: A4; margin: 20mm; } body { -webkit-print-color-adjust: exact; }"
        />
      </div>

      {/* Kartu yang akan dicetak */}
      <div ref={componentRef}>
        <KartuComponent user={user} qrcode={qrcode} />
      </div>
    </div>
  );
}
