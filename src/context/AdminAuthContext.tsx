import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminPasscode: string;
  setAdminPasscode: (code: string) => void;
  isLoginModalOpen: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  openLoginModal: (onSuccess?: () => void) => void;
  closeLoginModal: () => void;
  updateAdminPasscode: (newPasscode: string, onFirestoreSave?: (code: string) => Promise<void>) => Promise<boolean>;
  executeAdminAction: (action: () => void) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('yodha_admin_authenticated') === 'true';
  });

  const [adminPasscode, setAdminPasscode] = useState<string>('YODHA2026');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    localStorage.setItem('yodha_admin_authenticated', String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  const loginAdmin = (inputPasscode: string): boolean => {
    if (inputPasscode.trim() === adminPasscode.trim()) {
      setIsAdminAuthenticated(true);
      setIsLoginModalOpen(false);
      if (onSuccessCallback) {
        onSuccessCallback();
        setOnSuccessCallback(null);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
  };

  const openLoginModal = (onSuccess?: () => void) => {
    if (onSuccess) {
      setOnSuccessCallback(() => onSuccess);
    } else {
      setOnSuccessCallback(null);
    }
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setOnSuccessCallback(null);
  };

  const updateAdminPasscode = async (
    newPasscode: string,
    onFirestoreSave?: (code: string) => Promise<void>
  ): Promise<boolean> => {
    if (!isAdminAuthenticated) {
      console.warn('Unauthorized attempt to change passcode. Must be authenticated as Admin first.');
      return false;
    }

    const clean = newPasscode.trim();
    if (clean.length < 4) return false;

    setAdminPasscode(clean);

    if (onFirestoreSave) {
      try {
        await onFirestoreSave(clean);
      } catch (err) {
        console.error('Failed to update passcode in Firestore:', err);
      }
    }
    return true;
  };

  const executeAdminAction = (action: () => void) => {
    if (isAdminAuthenticated) {
      action();
    } else {
      openLoginModal(action);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminPasscode,
        setAdminPasscode,
        isLoginModalOpen,
        loginAdmin,
        logoutAdmin,
        openLoginModal,
        closeLoginModal,
        updateAdminPasscode,
        executeAdminAction,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
