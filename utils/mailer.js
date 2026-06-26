// Email utility — uses Gmail SMTP via nodemailer.
// Required env vars:
//   EMAIL_USER = your_gmail@gmail.com
//   EMAIL_PASS = 16-char App Password (Google Account → Security → App passwords)
//   BASE_URL   = https://yoursite.com  (defaults to http://localhost:5000)

const nodemailer = require('nodemailer');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  await getTransporter().sendMail({
    from: `"Recipe Haven 🍳" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

// ── Base HTML layout ──────────────────────────────────────────────────────────
function layout(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Recipe Haven</title>
</head>
<body style="margin:0;padding:0;background:#FFF8F0;font-family:'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="padding:32px 16px;">
    <table role="presentation" width="100%" style="max-width:580px;margin:0 auto;" cellpadding="0" cellspacing="0">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#C43E10 0%,#E85520 50%,#FF6B35 100%);border-radius:16px 16px 0 0;padding:26px 32px;text-align:center;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="background:rgba(255,255,255,0.18);border-radius:10px;width:38px;height:38px;text-align:center;vertical-align:middle;font-size:20px;">🍳</td>
              <td style="padding-left:10px;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;vertical-align:middle;">
                Recipe <span style="color:#FFD4B8;">Haven</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="background:#ffffff;padding:40px 36px;border-radius:0 0 16px 16px;box-shadow:0 8px 32px rgba(0,0,0,0.08);">
          ${content}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:22px 36px;text-align:center;">
          <p style="font-size:12px;color:#9CA3AF;margin:0 0 6px;">
            You're receiving this because you're part of Recipe Haven.
          </p>
          <p style="font-size:12px;color:#9CA3AF;margin:0;">
            © ${new Date().getFullYear()} Recipe Haven ·
            <a href="${BASE_URL}/listings/about/privacy" style="color:#FF6B35;text-decoration:none;">Privacy Policy</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ── Like notification email ───────────────────────────────────────────────────
function likeEmailHtml(recipientName, senderName, recipeTitle, recipeId) {
  return layout(`
    <div style="text-align:center;margin-bottom:30px;">
      <div style="font-size:52px;line-height:1;margin-bottom:14px;">❤️</div>
      <h1 style="font-size:22px;font-weight:800;color:#2D2D2D;margin:0 0 8px;">Someone loved your recipe!</h1>
      <p style="font-size:15px;color:#6B7280;margin:0;">
        <strong style="color:#FF6B35;">${senderName}</strong> liked your recipe on Recipe Haven
      </p>
    </div>

    <div style="background:#FFF8F0;border-radius:12px;padding:20px 22px;margin-bottom:26px;border-left:4px solid #FF6B35;">
      <p style="font-size:11px;color:#6B7280;margin:0 0 5px;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">Recipe</p>
      <p style="font-size:18px;font-weight:700;color:#2D2D2D;margin:0;">${recipeTitle}</p>
    </div>

    <div style="text-align:center;margin-bottom:28px;">
      <a href="${BASE_URL}/listings/${recipeId}"
         style="display:inline-block;background:#FF6B35;color:white;text-decoration:none;padding:13px 30px;border-radius:999px;font-weight:700;font-size:14px;">
        View Your Recipe →
      </a>
    </div>

    <p style="font-size:13px;color:#9CA3AF;text-align:center;margin:0;">
      Hi ${recipientName}, keep the great recipes coming! 🍳
    </p>
  `);
}

// ── Comment notification email ────────────────────────────────────────────────
function commentEmailHtml(recipientName, senderName, recipeTitle, commentText, recipeId) {
  return layout(`
    <div style="text-align:center;margin-bottom:30px;">
      <div style="font-size:52px;line-height:1;margin-bottom:14px;">💬</div>
      <h1 style="font-size:22px;font-weight:800;color:#2D2D2D;margin:0 0 8px;">New review on your recipe!</h1>
      <p style="font-size:15px;color:#6B7280;margin:0;">
        <strong style="color:#FF6B35;">${senderName}</strong> left a review
      </p>
    </div>

    <div style="background:#FFF8F0;border-radius:12px;padding:18px 22px;margin-bottom:16px;border-left:4px solid #FF6B35;">
      <p style="font-size:11px;color:#6B7280;margin:0 0 5px;text-transform:uppercase;letter-spacing:0.07em;font-weight:700;">On your recipe</p>
      <p style="font-size:17px;font-weight:700;color:#2D2D2D;margin:0;">${recipeTitle}</p>
    </div>

    <div style="background:#F9FAFB;border-radius:12px;padding:18px 22px;margin-bottom:26px;border:1px solid #E5E7EB;">
      <p style="font-size:12px;color:#6B7280;margin:0 0 8px;font-weight:700;">Their comment:</p>
      <p style="font-size:15px;color:#2D2D2D;margin:0;font-style:italic;line-height:1.6;">"${commentText}"</p>
    </div>

    <div style="text-align:center;margin-bottom:28px;">
      <a href="${BASE_URL}/listings/${recipeId}"
         style="display:inline-block;background:#FF6B35;color:white;text-decoration:none;padding:13px 30px;border-radius:999px;font-weight:700;font-size:14px;">
        View &amp; Respond →
      </a>
    </div>

    <p style="font-size:13px;color:#9CA3AF;text-align:center;margin:0;">
      Hi ${recipientName}, your cooking is building a community! 🙌
    </p>
  `);
}

// ── Follow notification email ─────────────────────────────────────────────────
function followEmailHtml(recipientName, senderName) {
  return layout(`
    <div style="text-align:center;margin-bottom:30px;">
      <div style="font-size:52px;line-height:1;margin-bottom:14px;">🎉</div>
      <h1 style="font-size:22px;font-weight:800;color:#2D2D2D;margin:0 0 8px;">You have a new follower!</h1>
      <p style="font-size:15px;color:#6B7280;margin:0;">
        <strong style="color:#FF6B35;">${senderName}</strong> is now following you on Recipe Haven
      </p>
    </div>

    <div style="text-align:center;margin-bottom:26px;">
      <div style="width:64px;height:64px;background:linear-gradient(135deg,#FF6B35,#E85520);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:white;margin-bottom:10px;">
        ${senderName.charAt(0).toUpperCase()}
      </div>
      <p style="font-size:16px;font-weight:700;color:#2D2D2D;margin:0;">@${senderName}</p>
    </div>

    <div style="text-align:center;margin-bottom:28px;">
      <a href="${BASE_URL}/profile/${senderName}"
         style="display:inline-block;background:#FF6B35;color:white;text-decoration:none;padding:13px 30px;border-radius:999px;font-weight:700;font-size:14px;">
        View Their Profile →
      </a>
    </div>

    <p style="font-size:13px;color:#9CA3AF;text-align:center;margin:0;">
      Hi ${recipientName}, keep creating amazing recipes to inspire your followers! 🍴
    </p>
  `);
}

// ── Newsletter welcome email ──────────────────────────────────────────────────
function welcomeSubscriberHtml(email, unsubscribeToken) {
  return layout(`
    <div style="text-align:center;margin-bottom:30px;">
      <div style="font-size:52px;line-height:1;margin-bottom:14px;">🍳</div>
      <h1 style="font-size:24px;font-weight:800;color:#2D2D2D;margin:0 0 10px;">You're in the kitchen!</h1>
      <p style="font-size:15px;color:#6B7280;margin:0;line-height:1.65;max-width:420px;">
        Welcome to the Recipe Haven newsletter. You'll get the best recipes, seasonal picks, and cooking tips straight to your inbox.
      </p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:26px;">
      <tr>
        <td style="padding:0 6px 0 0;width:33%;">
          <div style="background:#FFF8F0;border-radius:12px;padding:16px;text-align:center;border:1px solid rgba(255,107,53,0.15);">
            <div style="font-size:26px;margin-bottom:7px;">🥘</div>
            <p style="font-size:12px;font-weight:700;color:#2D2D2D;margin:0;">Weekly Recipes</p>
          </div>
        </td>
        <td style="padding:0 3px;width:33%;">
          <div style="background:#FFF8F0;border-radius:12px;padding:16px;text-align:center;border:1px solid rgba(255,107,53,0.15);">
            <div style="font-size:26px;margin-bottom:7px;">🌟</div>
            <p style="font-size:12px;font-weight:700;color:#2D2D2D;margin:0;">Chef's Picks</p>
          </div>
        </td>
        <td style="padding:0 0 0 6px;width:33%;">
          <div style="background:#FFF8F0;border-radius:12px;padding:16px;text-align:center;border:1px solid rgba(255,107,53,0.15);">
            <div style="font-size:26px;margin-bottom:7px;">💡</div>
            <p style="font-size:12px;font-weight:700;color:#2D2D2D;margin:0;">Cooking Tips</p>
          </div>
        </td>
      </tr>
    </table>

    <div style="text-align:center;margin-bottom:28px;">
      <a href="${BASE_URL}/listings"
         style="display:inline-block;background:#FF6B35;color:white;text-decoration:none;padding:14px 34px;border-radius:999px;font-weight:700;font-size:15px;">
        Explore Recipes Now →
      </a>
    </div>

    <p style="font-size:12px;color:#9CA3AF;text-align:center;margin:0;">
      Don't want these emails?
      <a href="${BASE_URL}/unsubscribe/${unsubscribeToken}" style="color:#FF6B35;text-decoration:none;">Unsubscribe</a>
    </p>
  `);
}

module.exports = {
  sendEmail,
  likeEmailHtml,
  commentEmailHtml,
  followEmailHtml,
  welcomeSubscriberHtml,
};
