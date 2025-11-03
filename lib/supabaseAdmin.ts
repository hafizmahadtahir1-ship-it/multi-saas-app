// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ------------------------
// Supabase Admin Client
// ------------------------
const supabaseAdminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseAdminUrl, supabaseAdminKey);

// ------------------------
// Encryption Helpers
// ------------------------
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // Must be 32 chars
const IV_LENGTH = 16;

/**
 * Encrypt text using AES-256-CBC
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypt text using AES-256-CBC
 */
export function decrypt(text: string): string {
  const [ivHex, encryptedText] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedText, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

// ------------------------
// Default Export (Important!)
// ------------------------
export default supabaseAdmin;