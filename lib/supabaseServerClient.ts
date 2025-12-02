import { createServerClientAsync } from './supabase';

/**
 * @deprecated Use createServerClientAsync from './supabase' instead
 * This file is kept for backward compatibility only
 */
export const supabase = {
  // This should only be used in server actions with proper error handling
  async from(table: string) {
    const client = await createServerClientAsync();
    return client.from(table);
  },
  
  async auth() {
    const client = await createServerClientAsync();
    return client.auth;
  }
};