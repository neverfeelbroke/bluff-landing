'use client'

import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="content">
        <Image
          src="/logo.svg"
          alt="Bluff.io Logo"
          width={220}
          height={70}
          priority
        />
        <p className="message">This page doesn't exist</p>
      </div>
      
      <style jsx>{`
        .not-found-container {
          width: 100vw;
          height: 100vh;
          background: black;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .message {
          font-family: var(--font-poppins), sans-serif;
          color: white;
          font-size: 18px;
          font-weight: 400;
          text-align: center;
        }
      `}</style>
    </div>
  );
}