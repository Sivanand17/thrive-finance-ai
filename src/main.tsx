import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider";

// Add push notification setup
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

export function sendPushNotification(
  title: string,
  options?: NotificationOptions
) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, options);
  }
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="financeai-theme">
    <App />
  </ThemeProvider>
);
