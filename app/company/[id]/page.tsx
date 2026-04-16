'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabase';

/**
 * 企業データの型定義
 */
interface Company {
  id: string;
  name: string;
  created_at?: string;
  // 他に項目（住所など）があればここに追加
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // URLの [id] 部分を取得
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!companyId) return;

      try {
        setLoading(true);
        // Supabaseから特定のIDの1件だけを取得
        const { data, error: fetchError } = await supabase
          .from('company')
          .select('*')
          .eq('id', companyId)
          .single();

        if (fetchError) throw fetchError;
        setCompany(data);
      } catch (err: any) {
        console.error('Fetch detail error:', err);
        setError('企業情報の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [companyId]);

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center', color: '#94a3b8', fontWeight: 'bold' }}>読み込み中...</div>;
  }

  if (error || !company) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <p style={{ color: '#e11d48', fontWeight: 'bold', marginBottom: '20px' }}>{error || '企業が見つかりませんでした。'}</p>
        <button onClick={() => router.push('/company')} style={{ color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          一覧へ戻る
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* ナビゲーション */}
        <nav style={{ marginBottom: '30px' }}>
          <button 
            onClick={() => router.push('/company')} 
            style={{ 
              color: '#4f46e5', 
              fontWeight: 'bold', 
              textDecoration: 'none', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: 0,
              fontSize: '16px'
            }}
          >
            ← 企業一覧へ戻る
          </button>
        </nav>

        {/* 詳細カード */}
        <article style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '50px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
          <header style={{ marginBottom: '40px', borderBottom: '2px solid #f8fafc', paddingBottom: '30px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'black', color: '#indigo-500', textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: '#eef2ff', padding: '6px 12px', borderRadius: '8px' }}>
              企業詳細情報
            </span>
            <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#1e293b', marginTop: '20px', lineHeight: '1.1' }}>
              {company.name}
            </h1>
          </header>

          <div style={{ display: 'grid', gap: '30px' }}>
            <section>
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>データベースID</h3>
              <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#64748b', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                {company.id}
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>登録日時</h3>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#334155' }}>
                {company.created_at ? new Date(company.created_at).toLocaleString('ja-JP') : '不明'}
              </p>
            </section>

            {/* 今後、ここに住所や電話番号、担当者リストなどを追加していきます */}
            <section style={{ marginTop: '20px', padding: '30px', backgroundColor: '#fdfbff', borderRadius: '20px', border: '1px dashed #e0e7ff', textAlign: 'center' }}>
              <p style={{ color: '#6366f1', fontWeight: 'bold', fontSize: '14px' }}>
                💡 ここにリレーション先の「担当者一覧」などを表示する予定です
              </p>
            </section>
          </div>
        </article>

        <footer style={{ marginTop: '40px', textAlign: 'center', color: '#cbd5e1', fontSize: '12px', fontWeight: 'bold' }}>
          COMPANY ID: {company.id}
        </footer>
      </div>
    </div>
  );
}