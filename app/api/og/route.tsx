import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f1419',
          backgroundImage: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}
          >
            <div
              style={{
                fontSize: 40,
                color: 'white',
              }}
            >
              💬
            </div>
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#e5e7eb',
              fontFamily: 'system-ui',
            }}
          >
            PayChat
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#9ca3af',
            textAlign: 'center',
            fontFamily: 'system-ui',
            maxWidth: 600,
          }}
        >
          Chat. Split. Pay. All in one.
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#6b7280',
            textAlign: 'center',
            fontFamily: 'system-ui',
            marginTop: 20,
          }}
        >
          Send payments and split bills within Farcaster
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
