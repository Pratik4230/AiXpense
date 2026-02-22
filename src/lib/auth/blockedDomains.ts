const BLOCKED_DOMAINS = new Set([
  "mimimail.me",
  "bitonc.com",
  "alibto.com",
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "guerrillamail.de",
  "guerrillamail.info",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "spam4.me",
  "yopmail.com",
  "yopmail.fr",
  "cool.fr.nf",
  "jetable.fr.nf",
  "nospam.ze.tc",
  "nomail.xl.cx",
  "mega.zik.dj",
  "speed.1s.fr",
  "courriel.fr.nf",
  "moncourrier.fr.nf",
  "monemail.fr.nf",
  "monmail.fr.nf",
  "tempmail.com",
  "temp-mail.org",
  "throwam.com",
  "throwam.net",
  "dispostable.com",
  "mailnull.com",
  "spamgourmet.com",
  "trashmail.com",
  "trashmail.at",
  "trashmail.io",
  "trashmail.me",
  "trashmail.net",
  "trashmail.org",
  "trashmail.xyz",
  "fakeinbox.com",
  "maildrop.cc",
  "getairmail.com",
  "mailcatch.com",
  "tempr.email",
  "discard.email",
  "spamfree24.org",
  "spamhereplease.com",
  "mytrashmail.com",
  "throwam.com",
  "spam.la",
  "binkmail.com",
  "bobmail.info",
  "chammy.info",
  "devnullmail.com",
  "letthemeatspam.com",
  "mailin8r.com",
  "mailnew.com",
  "mbx.cc",
  "mt2009.com",
  "quickinbox.com",
  "smellfear.com",
  "spamherelots.com",
  "spamthisplease.com",
  "teleworm.us",
  "ieatspam.eu",
  "ieatspam.info",
  "rootfest.net",
  "objectmail.com",
  "oneoffmail.com",
  "rtrtr.com",
  "spamgourmet.net",
  "spamgourmet.org",
  "spamspot.com",
  "tilien.com",
  "trbvm.com",
  "wh4f.org",
  "xemaps.com",
  "xents.com",
  "yuurok.com",
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  "20minutemail.com",
  "60minutemail.com",
  "getnada.com",
  "nada.email",
  "throwam.com",
  "sam.com",
]);

const BLOCKED_LOCAL_PARTS = new Set([
  "sam",
  "test",
  "fake",
  "noreply",
  "no-reply",
]);

export function isDisposableEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
  const atIndex = lower.lastIndexOf("@");
  if (atIndex === -1) return true;

  const domain = lower.slice(atIndex + 1);
  const localPart = lower.slice(0, atIndex);

  if (BLOCKED_DOMAINS.has(domain)) return true;

  if (
    BLOCKED_LOCAL_PARTS.has(localPart) &&
    !["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"].includes(domain)
  ) {
    return true;
  }

  return false;
}
