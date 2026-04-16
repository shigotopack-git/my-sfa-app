'use client';

import React, { useState, useEffect } from 'react';
// パスが解決できない場合は、実際のファイル位置に合わせて '../../utils/supabase/supabase' などに調整してください
import { supabase } from '@/utils/supabase/supabase';

interface Company {
  id: string;
  name: string;
  created_at?: string;
}

export default function CompanyManagementPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('company')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCompanies(data || []);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('データの読み込みに失敗しました。パス設定やテーブル名を確認してください。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    try {
      const { error: insertError } = await supabase
        .from('company')
        .insert([{ name: newName.trim() }]);

      if (insertError) throw insertError;

      setNewName('');
      await fetchCompanies();
    } catch (err: any) {
      setError('登録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCompany = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除してもよろしいですか？`)) return;

    try {
      const { error: deleteError } = await supabase
        .from('company')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchCompanies();
    } catch (err: any) {
      setError('削除に失敗しました。');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <nav style={{ marginBottom: '30px' }}>
          <a href="/" style={{ color: '#4f46e5', fontWeight: 'bold', textDecoration: 'none' }}>← ダッシュボードへ戻る</a>
        </nav>

        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b' }}>企業管理データベース</h1>
          <p style={{ color: '#64748b' }}>CRUD機能（作成・読み取り・削除）</p>
        </header>

        {error && (
          <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fda4af', color: '#be123c', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold' }}>
            ⚠️ {error}
          </div>
        )}

        <section style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>新規登録</h2>
          <form onSubmit={handleAddCompany} style={{ display: 'flex', gap: '15px' }}>
            <input
              type="text"
              placeholder="企業名を入力"
              style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px' }}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newName.trim()}
              style={{
                padding: '0 30px',
                borderRadius: '12px',
                backgroundColor: isSubmitting ? '#cbd5e1' : '#4f46e5',
                color: '#fff',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {isSubmitting ? '処理中...' : '登録'}
            </button>
          </form>
        </section>

        <section style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>企業一覧</h2>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>読み込み中...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                  <th style={{ padding: '15px 10px', fontSize: '12px', color: '#94a3b8' }}>NAME</th>
                  <th style={{ padding: '15px 10px', fontSize: '12px', color: '#94a3b8', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
// 修正箇所の抜粋
<tbody>
  {companies.map((company) => (
    <tr key={company.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ padding: '20px 10px' }}>
        {/* 名前をクリックすると詳細ページへ飛ぶようにリンク化 */}
        <a 
          href={`/company/${company.id}`} 
          style={{ 
            fontWeight: 'bold', 
            color: '#1e293b', 
            textDecoration: 'none',
            fontSize: '18px'
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#4f46e5')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#1e293b')}
        >
          {company.name}
        </a>
      </td>
      <td style={{ padding: '20px 10px', textAlign: 'right' }}>
        <button
          onClick={() => handleDeleteCompany(company.id, company.name)}
          style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
        >
          🗑️
        </button>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}