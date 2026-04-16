import React from 'react';

/**
 * SFAのメインダッシュボード画面
 * 連絡掲示板と各DBへのナビゲーションを提供します
 */
export default function SFAHome() {
  const menuItems = [
    { title: '企業閲覧', path: '/company', icon: '🏢', description: 'クライアント企業の管理' },
    { title: '担当者閲覧', path: '/contacts', icon: '👤', description: 'キーマン情報の管理' },
    { title: '案件閲覧', path: '/deals', icon: '💼', description: '商談進捗の管理' },
    { title: '接触履歴閲覧', path: '/activities', icon: '📝', description: '日々の活動記録' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">SFA System</h1>
          <p className="mt-2 text-lg text-gray-600">営業支援システムへようこそ</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 連絡掲示板セクション */}
          <section className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">📢</span> 連絡掲示板
            </h2>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-sm">
                <p className="font-semibold">システム稼働開始</p>
                <p className="text-gray-600 mt-1">SFAプロジェクトがスタートしました！</p>
                <span className="text-[10px] text-gray-400">2023.10.27</span>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded text-sm">
                <p className="font-semibold">重要：入力ルールについて</p>
                <p className="text-gray-600 mt-1">企業名は正式名称で入力してください。</p>
                <span className="text-[10px] text-gray-400">2023.10.26</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              過去の投稿を見る →
            </button>
          </section>

          {/* メインナビゲーションリンク */}
          <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                <div className="mt-4 text-blue-500 font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  一覧を開く <span className="ml-1">→</span>
                </div>
              </a>
            ))}
          </section>
        </div>

        {/* 統計/グラフプレースホルダー */}
        <footer className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <span className="mr-2">📊</span> 案件ステータス概況
          </h2>
          <div className="h-40 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
            [ここに案件の進捗グラフを表示予定]
          </div>
        </footer>
      </div>
    </div>
  );
}