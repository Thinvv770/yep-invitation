export const getUserKey = () => {
  const key = localStorage.getItem('user-key');
  if (key) return key;

  const newKey = crypto.randomUUID();
  localStorage.setItem('user-key', newKey);
  return newKey;
};

export const resetUser = async () => {
  const userKey = getUserKey();

  const body = new URLSearchParams({
    action: 'reset',
    userKey,
  });

  await fetch(import.meta.env.VITE_SURVEY_API, {
    method: 'POST',
    body,
  });

  localStorage.removeItem('boarding-pass');
  localStorage.removeItem('user-key');
};
