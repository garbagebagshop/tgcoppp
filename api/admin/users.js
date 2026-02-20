// api/admin/users.js — GET /api/admin/users (list) + POST /api/admin/users (create)
import { initDb } from '../_db.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TGCOP@2024';

function isAdmin(req) {
    return req.headers['x-admin-password'] === ADMIN_PASSWORD;
}

export default async function handler(req, res) {
    if (!isAdmin(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const db = await initDb();

    // GET — list all users
    if (req.method === 'GET') {
        try {
            const result = await db.execute('SELECT * FROM users ORDER BY created_at DESC');
            return res.status(200).json({ users: result.rows });
        } catch (err) {
            console.error('List users error:', err);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
    }

    // POST — create user
    if (req.method === 'POST') {
        try {
            const { mobile, email, name, planMonths = 1, notes = '' } = req.body;

            if (!mobile || !email || !name) {
                return res.status(400).json({ error: 'mobile, email, and name are required.' });
            }
            if (!mobile.match(/^[6-9]\d{9}$/)) {
                return res.status(400).json({ error: 'Invalid Indian mobile number.' });
            }

            const id = `u_${Date.now()}`;
            const planStart = Date.now();

            await db.execute({
                sql: 'INSERT INTO users (id, mobile, email, name, plan_start, plan_months, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
                args: [id, mobile.trim(), email.trim().toLowerCase(), name.trim(), planStart, Number(planMonths), notes.trim()],
            });

            return res.status(201).json({
                success: true,
                user: { id, mobile, email, name, plan_start: planStart, plan_months: planMonths, notes },
            });
        } catch (err) {
            if (err.message?.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'A user with this mobile already exists.' });
            }
            console.error('Create user error:', err);
            return res.status(500).json({ error: 'Failed to create user' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
