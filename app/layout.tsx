'use client'
import localFont from "next/font/local";
import "./globals.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Providers from "./components/Providers";
import Header from "./components/header";
import Footer from "./components/footer";
import BootstrapClient from "./components/bootstrapClient";
import { useCallback, useEffect, useRef, useState } from "react";
import TreeView from "./components/trees/treeView";

const MIN_WIDTH = 200; 
const MAX_WIDTH = 600; 

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const THEME_KEY = 'theme-preference';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  //#region theme control
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const applyTheme = useCallback((newTheme: 'light' | 'dark' | 'auto') => {
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | 'auto';
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('auto');
    }
  }, [applyTheme]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme)
  };

  //#endregion

  //#region layout control
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${sidebarWidth}px`;
    }
  }, [sidebarWidth]);
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing.current && sidebarRef.current) {
      const newWidth = e.clientX;
      if (newWidth > MIN_WIDTH && newWidth < MAX_WIDTH) {
        setSidebarWidth(newWidth);  // Set sidebar width dynamically
      }
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  //#endregion

  return (
    <html lang="en" data-bs-theme="" id="hdkn">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <BootstrapClient />
          <Header theme={theme} onThemeChange={handleThemeChange} />
          <div className='dFlex'>
            <div ref={sidebarRef} className='sidebar'>
              <h5>메뉴</h5>
              <TreeView />
            </div>
            <div onMouseDown={handleMouseDown} className='resizer' />
            <div className='mainContent'>
              {children}
            </div>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
