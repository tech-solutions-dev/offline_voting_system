const TOKEN_NAME = 'election_token'

export function setToken(token) {
  localStorage.setItem(TOKEN_NAME, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_NAME);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_NAME);
}

export function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function removeUser() {
  localStorage.removeItem('user');
}

export function isAuthenticated() {
  return !!getToken();
}

export function hasRole(role) {
  const user = getUser();
  return user && user.role === role;
}
