import { createClient } from '@supabase/supabase-js';

/**
 * Supabaseクライアントの初期化
 * * Vercelでのデプロイエラー（ビルド失敗）を回避するための堅牢な設定です。
 * 環境変数が未設定の状態でもビルドを通過させ、実行時に適切な警告を出します。
 */

// 1. 環境変数の取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 2. プレースホルダーの準備
// ビルド時にURLが空だとエラーになるケースを防ぐため、形式の正しいダミーURLを使用します。
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const finalUrl = supabaseUrl || 'https://your-project-id.supabase.co';
const finalKey = supabaseAnonKey || 'your-anon-key';

// 3. 実行時の警告（サーバーサイドのログで確認可能）
if (!isConfigured && process.env.NODE_ENV === 'production') {
  console.warn(
    '【重要】Supabaseの環境変数が設定されていません。' +
    'Vercelの [Project Settings] > [Environment Variables] に以下の2つを追加してください：' +
    'NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// 4. クライアントの生成
// 必須変数が欠けていても、一旦このインスタンス生成でコードを止めないようにします。
export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});