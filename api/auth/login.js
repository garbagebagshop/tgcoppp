// api/auth/login.js — POST /api/auth/login
// Body: { mobile, email }
// Returns: { success, user } or { error }
import { initDb } from '../_db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { mobile, email } = req.body;

        if (!mobile || !email) {
            return res.status(400).json({ error: 'Mobile and email are required.' });
        }

        const db = await initDb();

        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE mobile = ? AND LOWER(email) = LOWER(?)',
            args: [mobile.trim(), email.trim()],
        });

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid mobile or email. Check your credentials.' });
        }

        const user = result.rows[0];
        const planExpiry = Number(user.plan_start) + Number(user.plan_months) * 30 * 24 * 60 * 60 * 1000;
        const isPaid = planExpiry > Date.now();

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                mobile: user.mobile,
                email: user.email,
                name: user.name,
                isPaid,
                planExpiry,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Server error. Please try again.' });
    }
}
