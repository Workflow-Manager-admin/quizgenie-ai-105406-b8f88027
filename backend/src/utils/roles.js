export const roles = ['user', 'admin'];

export function isAdmin(user) {
  return user?.role === 'admin';
}
