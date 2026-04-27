export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { email, alias, operativeNumber } = await req.json();

  if (!email || !operativeNumber) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const paddedNumber = String(operativeNumber).padStart(4, '0');

  const emailHtml = `
    <div style="background:#0a0a0a; color:#c8c8c8; font-family:'Courier New', monospace; padding:48px 40px; max-width:560px; margin:0 auto;">
      <p style="font-size:10px; letter-spacing:0.3em; color:#2a6647; text-transform:uppercase; margin-bottom:40px;">Transmission for Operative ${paddedNumber}</p>
      <p style="font-size:16px; line-height:2; margin-bottom:20px;">We knew you would sign up.</p>
      <p style="font-size:16px; line-height:2; margin-bottom:20px;">I'm writing from a place I hope you never have to see.</p>
      <p style="font-size:16px; line-height:2; margin-bottom:20px;">But your name is here now, among those we carried forward. The ones who showed up before it was obvious.</p>
      <p style="font-size:16px; line-height:2; margin-bottom:20px;">You are Operative ${paddedNumber}.</p>
      <p style="font-size:16px; line-height:2; margin-bottom:20px;">You are among the earliest who felt it and didn't look away.</p>
      <p style="font-size:16px; line-height:2; margin-bottom:40px;">When history shifts, it rarely begins with crowds. It begins with a few people who moved early.</p>
      <p style="font-size:20px; color:#62d391; letter-spacing:0.05em; margin-bottom:48px;">Welcome to the future.</p>
      <div style="border-top:1px solid #1a1a1a; padding-top:32px;">
        <p style="font-size:11px; color:#2a6647; letter-spacing:0.15em;">— Operative Zero<br>2100project.org</p>
      </div>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Operative Zero <onboarding@resend.dev>',
      to: email,
      subject: `Transmission for Operative ${paddedNumber}`,
      html: emailHtml
    })
  });

  if (!response.ok) {
    const error = await response.json();
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
