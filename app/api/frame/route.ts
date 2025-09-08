import { NextRequest, NextResponse } from 'next/server';

// Simple frame handler without OnchainKit frame utilities
// This provides basic frame functionality for Farcaster
async function getResponse(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    
    // Basic frame validation - in production you'd want proper validation
    if (!body.untrustedData) {
      return new NextResponse('Invalid frame data', { status: 400 });
    }

    // Handle button clicks
    if (body.untrustedData.buttonIndex === 1) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}`,
        { status: 302 },
      );
    }

    // Return frame HTML
    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/og" />
          <meta property="fc:frame:button:1" content="Open PayChat" />
          <meta property="fc:frame:button:1:action" content="link" />
          <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/frame" />
        </head>
        <body>
          <h1>PayChat</h1>
          <p>Chat. Split. Pay. All in one.</p>
        </body>
      </html>
    `;

    return new NextResponse(frameHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Frame error:', error);
    return new NextResponse('Frame error', { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export async function GET(req: NextRequest): Promise<Response> {
  // Return the frame HTML for GET requests too
  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/og" />
        <meta property="fc:frame:button:1" content="Open PayChat" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/frame" />
      </head>
      <body>
        <h1>PayChat</h1>
        <p>Chat. Split. Pay. All in one.</p>
      </body>
    </html>
  `;

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export const dynamic = 'force-dynamic';
