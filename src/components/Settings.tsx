import React, { useState, useEffect } from 'react';
import { Bell, Shield, Smartphone, AlertCircle } from 'lucide-react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if we are on a platform that supports capacitor local notifications
    setIsSupported(Capacitor.isNativePlatform());
    
    // Load preference from local storage as fallback/state
    const saved = localStorage.getItem('headway_notifications');
    if (saved === 'true') {
      setNotificationsEnabled(true);
    }
  }, []);

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      // Turn off
      setNotificationsEnabled(false);
      localStorage.setItem('headway_notifications', 'false');
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
      }
    } else {
      // Turn on
      if (Capacitor.isNativePlatform()) {
        const permStatus = await LocalNotifications.requestPermissions();
        if (permStatus.display === 'granted') {
          setNotificationsEnabled(true);
          localStorage.setItem('headway_notifications', 'true');
          
          // Schedule daily check-in
          await LocalNotifications.schedule({
            notifications: [
              {
                title: "Headway Daily Check-in",
                body: "Take 30 seconds to log how you're feeling today.",
                id: 1,
                schedule: { on: { hour: 18, minute: 0 }, repeats: true }, // 6 PM everyday
              }
            ]
          });
        } else {
          alert('Notification permissions denied.');
        }
      } else {
        // Web simulation
        setNotificationsEnabled(true);
        localStorage.setItem('headway_notifications', 'true');
        alert("Daily check-ins enabled! (Simulated for Web Browser)");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 mt-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-2 text-[#212529]">App Settings</h2>
        <p className="text-xs text-[#6C757D] uppercase tracking-widest">
          Manage your app preferences and notifications.
        </p>
      </div>

      <div className="bg-white border border-[#DEE2E6] flex flex-col">
        
        {/* Settings Item: Notifications */}
        <div className="p-6 border-b border-[#DEE2E6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-4 items-start">
            <div className="bg-[#E9ECEF] p-3 rounded-full shrink-0">
              <Bell className="w-5 h-5 text-[#212529]" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-tight text-[#212529] mb-1">Daily Check-in Reminders</h3>
              <p className="text-xs text-[#6C757D] max-w-sm leading-relaxed">
                Receive a daily notification reminding you to log your symptoms. Regular tracking is crucial for recovery.
              </p>
            </div>
          </div>
          <button
            onClick={toggleNotifications}
            className={`px-6 py-3 font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors shrink-0 ${
              notificationsEnabled 
                ? "bg-[#212529] text-white hover:bg-[#343A40]" 
                : "bg-transparent border-2 border-[#DEE2E6] text-[#6C757D] hover:border-[#ADB5BD] hover:text-[#212529]"
            }`}
          >
            {notificationsEnabled ? 'Enabled' : 'Enable'}
          </button>
        </div>

        {/* Settings Item: Privacy Info */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8F9FA]">
          <div className="flex gap-4 items-start">
            <div className="bg-white border border-[#DEE2E6] p-3 rounded-full shrink-0">
              <Shield className="w-5 h-5 text-[#841617]" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-tight text-[#212529] mb-1">Data Privacy</h3>
              <p className="text-xs text-[#6C757D] max-w-sm leading-relaxed">
                Your data is stored locally on this device. When reported to the national database, it is completely anonymized.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
