const API_BASE = '/api/auth';

export async function loginUser(email: string, password: string) {
    const res = await fetch(`${API_BASE}/login-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Errore API');
    return res.json();
}