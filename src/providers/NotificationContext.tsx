"use client"
import { createContext, useState, useContext, ReactNode, FC } from 'react';

type NotificationType = 'info' | 'success' | 'error';

interface Notification {
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notification: Notification | null;
  notify: (message: string, type: NotificationType) => void;
}

// Criando o contexto de notificações com valor inicial
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Criando um hook personalizado para facilitar o uso do contexto
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// Componente Provider que armazena o estado da notificação
export const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  // Função para exibir notificações
  const notify = (message: string, type: NotificationType) => {
    setNotification({ message, type });
    // Resetar a notificação depois de um tempo
    setTimeout(() => {
      setNotification(null);
    }, 5000);

  };

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  );
};
