export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  firstLogin: boolean;
  tempPassword?: string; 
  message?: string;      
}

export interface PopupProps {
  password: string;
  onClose: () => void;
}