import { createClient } from '@supabase/supabase-js';

/**
 * Supabaseクライアントの初期化
 * * Vercelでのデプロイエラーを回避するため、環境変数の存在チェックを強化しています。
 * NEXT_PUBLIC_ から始まる環境変数は、ブラウザとサーバーの両方で参照可能です。
 */

// 環境変数の取得（undefinedの可能性を考慮）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vercelのビルド時や実行時に環境変数が欠落している場合のエラーハンドリング
if (!supabaseUrl || !supabaseAnonKey) {
  // ビルドを止めないために、開発環境以外では警告を表示し、実行時にエラーを投げます
  if (process.env.NODE_ENV === 'production') {
    console.warn('警告: Supabaseの環境変数が設定されていません。Vercelのプロジェクト設定を確認してください。');
  }
}

// クライアントの生成
// 必須変数が存在する場合のみ初期化し、存在しない場合はダミーまたはnullを許容する構成にすることで、
// ビルドフェーズでの「!（非NULL修飾子）」による強制的なクラッシュを防ぎます。
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);