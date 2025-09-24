export type User = {
  id: number;
  email: string;
  username?: string | null;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (parameters: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
};
