import { useState, useEffect } from 'react';

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: string; // "09:00"
  reminderDays: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri"]
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    reminderTime: '09:00',
    reminderDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  });

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('이 브라우저는 알림을 지원하지 않습니다.');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      return false;
    }
  };

  const scheduleNotification = (title: string, body: string, time: Date) => {
    if (permission !== 'granted') {
      console.log('알림 권한이 없습니다.');
      return;
    }

    // Service Worker를 통한 알림 스케줄링
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          tag: 'habit-reminder',
          requireInteraction: false,
          actions: [
            {
              action: 'check',
              title: '습관 체크하기',
              icon: '/icons/check-icon.png',
            },
            {
              action: 'dismiss',
              title: '나중에',
            },
          ],
        });
      });
    }
  };

  const scheduleDailyReminder = () => {
    if (!settings.enabled || permission !== 'granted') return;

    const [hours, minutes] = settings.reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // 오늘 이미 지났으면 내일로 설정
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    setTimeout(() => {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      if (settings.reminderDays.includes(today)) {
        scheduleNotification(
          '습관 체크 시간!',
          '오늘의 습관을 체크하고 경험치를 얻어보세요.',
          reminderTime
        );
      }
      // 다음 날 알림 스케줄링
      scheduleDailyReminder();
    }, timeUntilReminder);
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
    
    // 설정이 활성화되면 알림 스케줄링 시작
    if (updatedSettings.enabled) {
      scheduleDailyReminder();
    }
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (error) {
        console.error('설정 로드 실패:', error);
      }
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings.enabled && permission === 'granted') {
      scheduleDailyReminder();
    }
  }, [settings.enabled, permission]);

  return {
    permission,
    settings,
    requestPermission,
    scheduleNotification,
    updateSettings,
  };
} 