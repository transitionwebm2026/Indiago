'use client';

/**
 * Last-resort screen, used only when the root layout itself fails. It replaces the whole document,
 * so it can't rely on the site's stylesheet, fonts or providers.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          background: '#2F2557',
          color: '#F9F7F2',
          fontFamily: 'Georgia, "Times New Roman", serif',
          textAlign: 'center',
        }}
      >
        <main>
          <p style={{ margin: 0, fontFamily: 'Arial, sans-serif', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D5B690' }}>
            Indigo Interiors
          </p>
          <h1 style={{ margin: '20px 0 8px', fontSize: 36, fontWeight: 400 }}>Something went wrong</h1>
          <p lang="ar" dir="rtl" style={{ margin: '0 0 32px', fontSize: 22, color: 'rgba(249, 247, 242, 0.75)' }}>
            حدث خطأ غير متوقع
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ border: 0, borderRadius: 999, padding: '14px 28px', background: '#D5B690', color: '#2F2557', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            Try again · حاول مرة أخرى
          </button>
        </main>
      </body>
    </html>
  );
}
