import type { NextApiRequest, NextApiResponse } from 'next'
import supabaseAdmin from '../../../lib/supabaseAdmin'
import crypto from 'crypto'

// ⚠️ apna secret key env me rakho (.env.local)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'devsecretdevsecret' // 16/24/32 length
const IV_LENGTH = 16

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { team_id, provider, api_key } = req.body
  if (!team_id || !provider || !api_key) return res.status(400).json({ error: 'Missing fields' })

  try {
    const encrypted_key = encrypt(api_key)

    const { error } = await supabaseAdmin.from('api_keys').upsert({
      team_id,
      provider,
      encrypted_key,
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    return res.status(200).json({ message: 'API key saved securely ✅' })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: 'Server error', details: err.message })
  }
}