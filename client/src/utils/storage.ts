// A simple utility for storing and retrieving a unique user identifier in
// localStorage.  The server uses this ID to associate socket connections
// with the same user across sessions.

const KEY = 'cherry_user_id';

export const getStoredUser = (): string => {
  let id = localStorage.getItem(KEY);
  if (!id) {
    // Native UUID generation supported in all modern browsers
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
};