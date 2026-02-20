// api/admin/user.js — DELETE /api/admin/user?id=xxx (delete) + PUT (renew)
import { initDb } from '../_db.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TGCOP@2024';

function isAdmin(req) {
    return req.headers['x-admin-password'] === ADMIN_PASSWORD;
}

export default async function handler(req, res) {
    if (!isAdmin(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'User id required' });

    const db = await initDb();

    // DELETE — remove user
    if (req.method === 'DELETE') {
        try {
            await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('Delete user error:', err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }
    }

    // PUT — renew subscription
    if (req.method === 'PUT') {
        try {
            const { planMonths } = req.body;
            if (!planMonths) return res.status(400).json({ error: 'planMonths required' });

            // Get current expiry and extend from there (or from now if expired)
            const current = await db.execute({ sql: 'SELECT plan_start, plan_months FROM users WHERE id = ?', args: [id] });
            if (current.rows.length === 0) return res.status(404).json({ error: 'User not found' });

            const row = current.rows[0];
            const currentExpiry = Number(row.plan_start) + Number(row.plan_months) * 30 * 24 * 60 * 60 * 1000;
            const newStart = Math.max(Date.now(), currentExpiry);

            await db.execute({
                sql: 'UPDATE users SET plan_start = ?, plan_months = ? WHERE id = ?',
                args: [newStart, Number(planMonths), id],
            });

            return res.status(200).json({ success: true, newExpiry: newStart + Number(planMonths) * 30 * 24 * 60 * 60 * 1000 });
        } catch (err) {
            console.error('Renew user error:', err);
            return res.status(500).json({ error: 'Failed to renew subscription' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
