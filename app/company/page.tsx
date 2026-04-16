import React from 'react';
// 【対策1: ts2307 解決】パスを明示的に指定
// もし赤い波線が消えない場合は、../../utils/supabase/supabase を確認してください
import { supabase } from '../../utils/supabase/supabase';

/**
 * 【対策2: ts7006 解決】型(Interface)を定義します
 * TypeScriptにデータの形を教えることで、ビルドエラーを防ぎます
 */
interface Company {
  id: string;
  name: string;
  created_at?: string;
}

/**
 * 企業一覧ページ
 */
export default async function CompanyListPage() {
  // 型を Company[] と指定することで any エラーを回避
  let companies: Company[] = [];
  let fetchError: string | null = null;

  try {
    // Supabaseからデータを取得
    const { data, error } = await supabase
      .from('company')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      fetchError = error.message;
    } else {
      // 取得データを定義した型に変換
      companies = (data as Company[]) || [];
    }
  } catch (err: any) {
    fetchError = "接続エラーが発生しました。";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <nav className="mb-6">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-bold flex items-center">
            <span className="mr-1">←</span> ダッシュボードに戻る
          </a>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">企業閲覧</h1>
            <div className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              {companies.length} 件のデータ
            </div>
          </div>

          {/* エラー表示エリア */}
          {fetchError && (
            <div className="m-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
              <strong>エラー:</strong> {fetchError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">企業名</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {companies.map((company: Company) => (
                  <tr key={company.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-5 font-bold text-gray-800">{company.name}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-bold text-sm border border-blue-100 px-3 py-1 rounded-md">
                        詳細
                      </button>
                    </td>
                  </tr>
                ))}
                
                {/* データなし表示 */}
                {companies.length === 0 && !fetchError && (
                  <tr>
                    <td colSpan={2} className="px-8 py-20 text-center text-gray-400 italic">
                      データが見つかりませんでした。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}