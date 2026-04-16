
import React from 'react';
// エラー解消のため、エイリアス（@/）ではなく相対パス（../../）でインポートを試みます
// プロジェクト構造に合わせて utils/supabase.ts を参照します
import { supabase } from '../../utils/supabase';

/**
 * 企業一覧ページ
 * データの閲覧、新規登録、詳細表示、更新・削除アクションを提供します。
 * kintoneの一覧画面に近い機能を持たせています。
 */
export default async function CompanyListPage() {
  // Supabaseから企業データを取得（kintoneのレコード取得に相当）
  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-600 p-4">
        エラーが発生しました: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ナビゲーション */}
        <nav className="mb-6">
          <a href="/" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium transition-colors">
            <span className="mr-1">←</span> ダッシュボードへ戻る
          </a>
        </nav>

        {/* ヘッダーセクション */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">企業閲覧</h1>
            <p className="text-gray-500 mt-1">
              登録されている企業の一覧です。詳細の確認や編集が可能です。
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {companies?.length || 0} 件
              </span>
            </p>
          </div>
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center">
            <span className="text-xl mr-2">+</span> 新規企業登録
          </button>
        </header>

        {/* テーブルセクション */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">企業名</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">登録日</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {companies?.map((company) => (
                  <tr key={company.id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                          {company.name.substring(0, 1)}
                        </div>
                        <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(company.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center space-x-3">
                        <a 
                          href={`/company/${company.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                        >
                          詳細
                        </a>
                        <button className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                          更新
                        </button>
                        <button className="text-sm font-medium text-red-600 hover:text-red-800 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors">
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* データなしの状態 */}
                {(!companies || companies.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl mb-4 text-gray-300">🏢</span>
                        <p className="text-gray-400 italic">企業がまだ登録されていません。</p>
                        <p className="text-gray-400 text-sm mt-1">右上のボタンから最初の企業を登録しましょう。</p>
                      </div>
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