'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/supabase';

/**
 * 企業データのインターフェース定義
 */
interface Company {
  id: string;
  name: string;
  created_at?: string;
}

/**
 * 企業管理ページコンポーネント
 * 一覧表示(Read)、新規登録(Create)、削除(Delete)機能を統合
 */
export default function CompanyManagementPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. データの取得 (READ) ---
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('company')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCompanies(data || []);
    } catch (err: any) {
      console.error('Error:', err);
      setError('データの読み込みに失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // --- 2. 新規登録処理 (CREATE) ---
  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('company')
        .insert([{ name: newName.trim() }]);

      if (insertError) throw insertError;

      setNewName('');
      await fetchCompanies(); // リストを最新にする
    } catch (err: any) {
      setError('登録に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. 削除処理 (DELETE) ---
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
    <div style={{ minHeight: '100-vh', backgroundColor: '#f8fafc', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <nav style={{ marginBottom: '30px' }}>
          <a href="/" style={{ color: '#4f46e5', fontWeight: 'bold', textDecoration: 'none' }}>← ダッシュボードへ戻る</a>
        </nav>

        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b' }}>企業管理データベース</h1>
          <p style={{ color: '#64748b' }}>企業データの「登録」「表示」「削除」が行えます。</p>
        </header>

        {/* 登録フォーム */}
        <section style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>新規企業を登録</h2>
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
              {isSubmitting ? '登録中...' : '登録'}
            </button>
          </form>
          {error && <p style={{ color: '#e11d48', marginTop: '10px', fontSize: '14px' }}>{error}</p>}
        </section>

        {/* 企業一覧 */}
        <section style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>登録済み企業一覧</h2>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>読み込み中...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                  <th style={{ padding: '15px 10px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>企業名</th>
                  <th style={{ padding: '15px 10px', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 10px', fontWeight: 'bold', color: '#334155' }}>{company.name}</td>
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
                {companies.length === 0 && (
                  <tr>
                    <td colSpan={2} style={{ padding: '40px', textAlign: 'center', color: '#cbd5e1' }}>データがありません</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}