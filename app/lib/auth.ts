export const getUser = () => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
};

export const login = (role: 'user' | 'business') => {
    localStorage.setItem('user', JSON.stringify({ role }));
};

export const logout = () => {
    localStorage.removeItem('user');
};
