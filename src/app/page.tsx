'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import PopUp from "@/components/PopUp/PopUp";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const videoRefHorizontal = useRef<HTMLVideoElement>(null);
  const videoRefVertical = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadResources = async () => {
      try {
        let loadedCount = 0;
        const totalResources = 4; // логотип + 2 видео + завершение DOM
        
        const updateProgress = () => {
          loadedCount++;
          const newProgress = Math.round((loadedCount / totalResources) * 100);
          setProgress(newProgress);
          
          if (loadedCount >= totalResources) {
            // Небольшая задержка перед скрытием экрана загрузки
            setTimeout(() => {
              setIsLoading(false);
            }, 300);
          }
        };

        // Проверяем загрузку DOM
        if (document.readyState === 'complete') {
          updateProgress();
        } else {
          window.addEventListener('load', updateProgress);
        }

        // Предзагружаем логотип
        const logoImg = document.createElement('img');
        logoImg.onload = updateProgress;
        logoImg.onerror = updateProgress; // считаем ошибку как завершение
        logoImg.src = '/logo.svg';

        // Предзагружаем видео
        const preloadVideo = (src: string) => {
          return new Promise<void>((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            const handleLoad = () => {
              updateProgress();
              resolve();
            };
            
            video.addEventListener('canplaythrough', handleLoad);
            video.addEventListener('error', handleLoad); // считаем ошибку как завершение
            
            // Таймаут на случай, если видео не загрузится
            setTimeout(handleLoad, 3000);
            
            video.src = src;
          });
        };

        // Загружаем оба видео параллельно
        await Promise.all([
          preloadVideo('/bg.webm'),
          preloadVideo('/bg-vertical.webm')
        ]);

        // Принудительное завершение загрузки через максимальное время
        const maxTimeout = setTimeout(() => {
          setProgress(100);
          setTimeout(() => setIsLoading(false), 300);
        }, 8000);

      } catch (error) {
        console.error('Error loading resources:', error);
        // В случае ошибки все равно завершаем загрузку
        setProgress(100);
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    loadResources();
  }, []);

  const handleJoinClick = () => {
    setIsPopUpVisible(true);
  };

  const handleClosePopUp = () => {
    setIsPopUpVisible(false);
  };

  

  // Показываем экран загрузки
  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingLogo}>
            <img src="/logo.svg" alt="Logo" />
          </div>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PopUp isVisible={isPopUpVisible} onClose={handleClosePopUp} />
      <div className={styles['header-wrapper']}>
        <div className={styles['header']}>
          <img src="/logo.svg" alt="Logo" />
          <button className={styles['join']} onClick={handleJoinClick}>Join the waitlist</button>
        </div>
      </div>
      <div className={styles['video']}>
        <video
          ref={videoRefHorizontal}
          className={styles.horizontal}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/bg.webm" type="video/webm"/>
        </video>
        <video
          ref={videoRefVertical}
          className={styles.vertical}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/bg-vertical.webm" type="video/webm"/>
        </video>
      </div>
      <div className={styles['footer-wrapper']}>
        <footer className={styles['footer']}>
          <div className={styles['socials']}>
            <a href="https://bluff.io" target="_blank"><img src="/x.svg" alt="X" /></a>
            <a href="https://bluff.io" target="_blank"><img src="/kick.svg" alt="Kick" /></a>
            <a href="https://bluff.io" target="_blank"><img src="/ig.svg" alt="Instagram" /></a>
            <a href="https://bluff.io" target="_blank"><img src="/telegram.svg" alt="Telegram" /></a>
          </div>
          <span className={styles['copyright']}>All Rights Reserved | Bluff.io | Copyright © 2025</span>
        </footer>
      </div>
    </div>
  );
}
