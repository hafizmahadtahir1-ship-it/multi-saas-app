import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY || '';

// Production safety check
if (process.env.NODE_ENV === 'production') {
  if (!SECRET_KEY || SECRET_KEY.length !== 32) {
    throw new Error('ENCRYPTION_SECRET_KEY must be exactly 32 characters in production');
  }
} else if (!SECRET_KEY || SECRET_KEY.length < 32) {
  console.warn('⚠️ ENCRYPTION_SECRET_KEY missing or too short — must be 32 chars');
  
  // Fallback for development only
  if (!SECRET_KEY) {
    console.warn('⚠️ Using development fallback key - NOT FOR PRODUCTION');
    // This is just for development - will be overridden by env in production
    process.env.ENCRYPTION_SECRET_KEY = 'dev-key-32-chars-long-1234567890';
  }
}

export function encrypt(text: string): string {
  const key = Buffer.from(process.env.ENCRYPTION_SECRET_KEY!, 'utf8');
  
  if (key.length !== 32) {
    throw new Error('Encryption key must be 32 bytes');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(encryptedText: string): string {
  const key = Buffer.from(process.env.ENCRYPTION_SECRET_KEY!, 'utf8');
  
  if (key.length !== 32) {
    throw new Error('Decryption key must be 32 bytes');
  }

  const [ivHex, tagHex, dataHex] = encryptedText.split(':');
  
  if (!ivHex || !tagHex || !dataHex) {
    throw new Error('Invalid encrypted text format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const encrypted = Buffer.from(dataHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

// Helper to validate encryption key
export function validateEncryptionKey(): boolean {
  const key = process.env.ENCRYPTION_SECRET_KEY;
  return !!(key && key.length === 32);
}