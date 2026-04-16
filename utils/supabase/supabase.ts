import { createClient } from '@supabase/supabase-js';

/**
 * Supabaseクライアントの初期化
 * * NEXT_PUBLIC_ から始まる環境変数はブラウザ側でも参照可能です。
 * .env.local および Vercel の Environment Variables に設定が必要です。
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// クライアントの生成
// 認証（SSR）を厳密に行う場合は、別途 @supabase/ssr のサーバー用設定を使用しますが、
// 共通のユーティリティとしてこの構成が基本となります。
export const supabase = createClient(supabaseUrl, supabaseAnonKey);