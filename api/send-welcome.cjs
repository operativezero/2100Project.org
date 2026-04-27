module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, alias, operativeNumber } = req.body;

  if (!email || !operativeNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const paddedNumber = String(operativeNumber).padStart(4, '0');

  const emailHtml = `
    <div style="background:#0a0a0a; color:#c8c8c8; font-family:'Courier New', monospace; padding:48px 40px; max-width:560px; margin:0 auto;">
      <p style="font-size:10px; letter-spacing:0.3em; color:#2a6647; text-transform:uppercase; margin-bottom:40px;">
        Transmission for Operative ${paddedNumber}
      </p>
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

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Operative Zero <transmissions@2100project.org>',
        to: email,
        subject: `Transmission for Operative ${paddedNumber}`,
        html: emailHtml
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Send error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
