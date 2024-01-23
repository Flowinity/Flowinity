export default {
  user: {
    username: [
      (value: string) => {
        if (!value) return "Username is required";
        if (value.length < 2) return "Username must be at least 2 characters";
        if (value.length > 32)
          return "Username must be less than 32 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return "Username can only contain letters, numbers, and underscores";
        return true;
      }
    ],
    email: [
      (value: string) => {
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Email is invalid";
        return true;
      }
    ],
    password: [
      (value: string) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return true;
      }
    ],
    passwordSettings: [
      (value: string) => {
        if (!value) return true;
        if (value.length < 8) return "Password must be at least 8 characters";
        return true;
      }
    ],
    terms: [
      (value: boolean) => {
        if (!value) return "You must accept the terms of service";
        return true;
      }
    ],
    totp: [
      (value: string) => {
        if (!value) return "2FA code is required";
        if (value.length !== 6) return "2FA code must be 6 characters";
        return true;
      }
    ],
    optionalTotp: [
      (value: string) => {
        if (!value) return true;
        if (value.length !== 6) return "2FA code must be 6 characters";
        return true;
      }
    ]
  }
};
