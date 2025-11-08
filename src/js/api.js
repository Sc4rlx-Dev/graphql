import { query } from './query.js';

export async function generateToken(email, password) {
    const credentials = btoa(`${email}:${password}`);

    const response = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
        },
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    localStorage.setItem('token', data);
    return data;
}

export async function fetchUserData(token) {
    const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: query() })
    });

    const data = await response.json();

    if (data.errors || !data.data || !data.data.user) {
        throw new Error('Error fetching data or no user data found.');
    }
    return data.data
}