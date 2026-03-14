import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function getNotifyEmail(): string {
  return process.env.NOTIFY_EMAIL || "";
}

function getSenderEmail(): string {
  return process.env.SENDER_EMAIL || "onboarding@resend.dev";
}

// ── Send brief link to client ───────────────────
export async function sendBriefLinkEmail(opts: {
  clientName: string;
  clientEmail: string;
  projectName: string;
  briefUrl: string;
}): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;

  try {
    await resend.emails.send({
      from: getSenderEmail(),
      to: opts.clientEmail,
      subject: `${opts.projectName} — Votre brief à remplir`,
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #F8FAFC; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #60A5FA, #3B82F6); width: 48px; height: 48px; border-radius: 12px; line-height: 48px; color: white; font-weight: bold; font-size: 20px;">CB</div>
          </div>
          <h1 style="font-size: 20px; font-weight: 600; color: #0F172A; margin: 0 0 8px; text-align: center;">Bonjour ${opts.clientName} !</h1>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; text-align: center; margin: 0 0 24px;">
            Nous avons créé un formulaire pour collecter le contenu nécessaire à votre projet <strong>${opts.projectName}</strong>.
          </p>
          <p style="font-size: 13px; color: #64748B; text-align: center; margin: 0 0 24px;">
            Comptez environ 10 minutes. Vos réponses sont sauvegardées automatiquement, vous pouvez y revenir plus tard.
          </p>
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${opts.briefUrl}" style="display: inline-block; background: linear-gradient(135deg, #60A5FA, #3B82F6); color: white; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 12px rgba(59,130,246,0.25);">
              Remplir mon brief
            </a>
          </div>
          <p style="font-size: 11px; color: #94A3B8; text-align: center; margin: 0;">
            Si le bouton ne fonctionne pas, copiez ce lien :<br>
            <a href="${opts.briefUrl}" style="color: #3B82F6; word-break: break-all;">${opts.briefUrl}</a>
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

// ── Notify agency when brief is submitted ───────
export async function sendBriefSubmittedNotification(opts: {
  clientName: string;
  clientEmail: string;
  projectName: string;
  dashboardUrl: string;
  completenessScore: number;
}): Promise<boolean> {
  const resend = getResend();
  const notifyEmail = getNotifyEmail();
  if (!resend || !notifyEmail) return false;

  try {
    const scoreColor = opts.completenessScore >= 80 ? "#059669" : opts.completenessScore >= 50 ? "#D97706" : "#DC2626";

    await resend.emails.send({
      from: getSenderEmail(),
      to: notifyEmail,
      subject: `Brief soumis — ${opts.projectName} (${opts.completenessScore}%)`,
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #F8FAFC; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #60A5FA, #3B82F6); width: 48px; height: 48px; border-radius: 12px; line-height: 48px; color: white; font-weight: bold; font-size: 20px;">CB</div>
          </div>
          <h1 style="font-size: 20px; font-weight: 600; color: #0F172A; margin: 0 0 16px; text-align: center;">Nouveau brief reçu !</h1>
          <div style="background: white; border-radius: 12px; padding: 20px; border: 1px solid #E2E8F0; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #64748B;">Projet</p>
            <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #0F172A;">${opts.projectName}</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #64748B;">Client</p>
            <p style="margin: 0 0 16px; font-size: 14px; color: #0F172A;">${opts.clientName} · ${opts.clientEmail}</p>
            <p style="margin: 0 0 4px; font-size: 13px; color: #64748B;">Complétude</p>
            <p style="margin: 0; font-size: 22px; font-weight: 700; color: ${scoreColor};">${opts.completenessScore}%</p>
          </div>
          <div style="text-align: center;">
            <a href="${opts.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #60A5FA, #3B82F6); color: white; text-decoration: none; padding: 12px 32px; border-radius: 10px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 12px rgba(59,130,246,0.25);">
              Voir dans le dashboard
            </a>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Notification email error:", error);
    return false;
  }
}
