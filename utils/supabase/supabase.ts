import { createClient } from '@supabase/supabase-js';

/**
 * Supabaseクライアントの初期化
 * * Vercelのビルドエラー (npm run build exited with 1) を確実に回避するための構成。
 * ビルド時にはダミーの正しい形式のURLを渡し、実行時にのみ環境変数を参照します。
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * ビルドを成功させるための安全なクライアント生成
 */
const createSafeClient = () => {
  // 環境変数が無い場合、ビルドをクラッシュさせないために形式だけ正しいダミーURLを使用
  const url = supabaseUrl && supabaseUrl.startsWith('http') 
    ? supabaseUrl 
    : 'https://placeholder-project-id.supabase.co';
  
  const key = supabaseAnonKey || 'placeholder-key';

  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
};

export const supabase = createSafeClient();