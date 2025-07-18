export const sendPushNotification = (title: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, options);
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, options);
      }
    });
  }
};