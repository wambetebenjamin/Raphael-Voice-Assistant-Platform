"use client";

/** reCAPTCHA v3 client helper with an on-demand v2 checkbox fallback. */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
      render: (
        el: HTMLElement | string,
        opts: { sitekey: string; callback: (token: string) => void }
      ) => number;
    };
    rvV2OnLoad?: () => void;
  }
}

const V3_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
const V2_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || "";

export const captchaEnabled = Boolean(V3_SITE_KEY);
export const captchaV2Available = Boolean(V2_SITE_KEY);

let v3Promise: Promise<void> | null = null;
let v2Promise: Promise<void> | null = null;

function loadScript(src: string, onload?: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      resolve();
      onload?.();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => {
      onload?.();
      resolve();
    };
    s.onerror = () => reject(new Error("captcha-script-load-failed"));
    document.head.appendChild(s);
  });
}

function loadV3(): Promise<void> {
  if (!v3Promise) v3Promise = loadScript(`https://www.google.com/recaptcha/api.js?render=${V3_SITE_KEY}`);
  return v3Promise;
}

function loadV2(): Promise<void> {
  if (!v2Promise) {
    v2Promise = new Promise((resolve, reject) => {
      window.rvV2OnLoad = () => resolve();
      loadScript(
        `https://www.google.com/recaptcha/api.js?onload=rvV2OnLoad&render=explicit`,
        undefined
      ).catch(reject);
    });
  }
  return v2Promise;
}

/** v3 invisible token for a given action. Null when unconfigured. */
export async function getCaptchaToken(action: string): Promise<string | null> {
  if (!captchaEnabled) return null;
  try {
    await loadV3();
    await new Promise<void>((resolve) => window.grecaptcha?.ready(resolve));
    return await window.grecaptcha!.execute(V3_SITE_KEY, { action });
  } catch {
    return null;
  }
}

/** Renders a v2 checkbox into `el`; resolves with the user token. */
export async function renderCaptchaV2(el: HTMLElement): Promise<string> {
  await loadV2();
  return new Promise<string>((resolve) => {
    window.grecaptcha!.render(el, { sitekey: V2_SITE_KEY, callback: resolve });
  });
}
