export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("nna_admin_auth") === "true";
};

export const login = () => {
  localStorage.setItem("nna_admin_auth", "true");
};

export const logout = () => {
  localStorage.removeItem("nna_admin_auth");
};
