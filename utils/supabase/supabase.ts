import { createClient } from '@supabase/supabase-js';

/**
 * Supabaseクライアントの初期化
 * * Vercelのビルドエラーを回避するための「ビルドセーフ」な構成です。
 * 環境変数が未設定の場合でもビルドを通過させ、実行時にのみ警告を発します。
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * URLが有効な形式かどうかを判定する補助関数
 * ビルド時に不正なURLでインスタンス化されることによるクラッシュを防ぎます。
 */
const isValidUrl = (url: string | undefined): url is string => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 実際の接続情報、またはビルドを通すためのダミー情報
const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://tmp-project.supabase.co';
const finalKey = supabaseAnonKey || 'tmp-key';

// 開発者への警告ログ（環境変数が足りない場合）
if (process.env.NODE_ENV === 'production' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    '⚠️ [Vercel Deployment Warning]: Supabase environment variables are missing.\n' +
    'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel Dashboard.'
  );
}

/**
 * Supabaseクライアントインスタンス
 * このインスタンスを使用して、アプリ全体からDB操作を行います。
 */
export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});