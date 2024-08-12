import { sendMessage } from '../../../lib/wpp'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { to, message } = req.body;
    try {
      await sendMessage(`55${to}@c.us`, message);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}