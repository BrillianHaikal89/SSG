"use client"
// pages/e-card.js
import { useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/e-card.module.css'
import useAuthStore from '../../../stores/authStore'
import QRCode from "react-qr-code";


export default function ECard() {
  const { user, loading, error, qrcode, fetchUserQRCode } = useAuthStore()

  useEffect(() => {
    fetchUserQRCode();
    console.log('loh', qrcode);
  }, [fetchUserQRCode,qrcode])

  const navigateBack = () => {
    window.history.back();
  }
  if (loading) return (
    <div className={styles.container}>
      <div className={styles.loading}>Loading...</div>
    </div>
  )
  if (qrcode === null) return (
    <div className={styles.container}>
      <div className={styles.loading}>kamu belum terdaftar sebagai peserta</div>
    </div>
  )

  if (error) return (
    <div className={styles.container}>
      <div className={styles.error}>Error: kamu belum terdaftar sebagai peserta</div>
    </div>
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>E-Card | Santri Siap Guna</title>
        <meta name="description" content="E-Card for Santri Siap Guna" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>
          <Image 
            src="/logo.png" 
            alt="Santri Siap Guna Logo" 
            width={30} 
            height={30} 
          />
          <span>SANTRI SIAP GUNA</span>
        </div>
        <div className={styles.headerIcons}>
          <Image src="/notification.png" alt="Notifications" width={24} height={24} />
          <div className={styles.avatar}>
            <span>M</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>E-Card</h1>

        <div className={styles.cardContainer}>
          <div className={styles.cardLabels}>
            <span>Tampilan Depan</span>
            <span>Tampilan Belakang</span>
          </div>
          
          <div className={styles.cards}>
            {/* Front Card */}
            <div className={styles.card}>
  <div className={styles.qrCode}>
    {qrcode ? (
      <QRCode value={qrcode} size={100} />
    ) : (
      <Image 
        src="/placeholder-qr.png" 
        alt="QR Code" 
        width={100} 
        height={100} 
      />
    )}
  </div>
  <div className={styles.cardName}>
    <h2>{user?.name || "Muhamad Brillian Haikal"}</h2>
  </div>
</div>


            {/* Back Card */}
            <div className={styles.card}>
              <div className={styles.cardLogo}>
                <Image 
                  src="/ssg-logo.png" 
                  alt="Santri Siap Guna Logo" 
                  width={150} 
                  height={150} 
                />
              </div>
              <div className={styles.backQrCode}>
                <Image 
                  src={user?.backQrCode || "/placeholder-qr.png"} 
                  alt="QR Code" 
                  width={80} 
                  height={80} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.button}>Cetak</button>
          <div className={styles.buttonContainer} onClick={navigateBack}>
          <button className={styles.button}>Kembali</button>
        </div>
        </div>
        
      </main>
    </div>
  )
}