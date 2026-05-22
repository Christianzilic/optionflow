import "server-only";
import jwt from "jsonwebtoken";

const INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY!;
const USER_ID = process.env.DOCUSIGN_USER_ID!;
const ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID!;
const BASE_URL = (process.env.DOCUSIGN_BASE_URL ?? "https://demo.docusign.net/restapi").replace(/\/$/, "");
const AUTH_SERVER = BASE_URL.includes("demo") ? "account-d.docusign.com" : "account.docusign.com";

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }

  const privateKey = (process.env.DOCUSIGN_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

  const assertion = jwt.sign(
    {
      iss: INTEGRATION_KEY,
      sub: USER_ID,
      aud: AUTH_SERVER,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: "signature impersonation",
    },
    privateKey,
    { algorithm: "RS256" },
  );

  const res = await fetch(`https://${AUTH_SERVER}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Docusign auth failed: ${res.status} ${body}`);
  }

  const data = await res.json() as { access_token: string; expires_in: number };
  cachedToken = { accessToken: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.accessToken;
}

async function dsRequest(path: string, method: string, body?: unknown): Promise<Response> {
  const token = await getAccessToken();
  return fetch(`${BASE_URL}/v2.1/accounts/${ACCOUNT_ID}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export interface SignerInfo {
  name: string;
  email: string;
  clientUserId?: string;
}

export async function createSigningEnvelope(opts: {
  pdfBuffer: Buffer;
  documentName: string;
  emailSubject: string;
  signer: SignerInfo;
}): Promise<{ envelopeId: string }> {
  const envelope = {
    emailSubject: opts.emailSubject,
    status: "sent",
    documents: [
      {
        documentBase64: opts.pdfBuffer.toString("base64"),
        name: opts.documentName,
        fileExtension: "pdf",
        documentId: "1",
      },
    ],
    recipients: {
      signers: [
        {
          email: opts.signer.email,
          name: opts.signer.name,
          recipientId: "1",
          routingOrder: "1",
          clientUserId: opts.signer.clientUserId,
          tabs: {
            signHereTabs: [{ anchorString: "/sig1/", anchorUnits: "pixels", anchorXOffset: "20", anchorYOffset: "-10" }],
            dateSignedTabs: [{ anchorString: "/date1/", anchorUnits: "pixels", anchorXOffset: "20", anchorYOffset: "-10" }],
          },
        },
      ],
    },
  };

  const res = await dsRequest("/envelopes", "POST", envelope);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Docusign envelope creation failed: ${res.status} ${body}`);
  }

  const data = await res.json() as { envelopeId: string };
  return { envelopeId: data.envelopeId };
}

export async function createEmbeddedSigningUrl(opts: {
  envelopeId: string;
  signer: SignerInfo;
  returnUrl: string;
}): Promise<string> {
  const res = await dsRequest(
    `/envelopes/${opts.envelopeId}/views/recipient`,
    "POST",
    {
      returnUrl: opts.returnUrl,
      authenticationMethod: "none",
      email: opts.signer.email,
      userName: opts.signer.name,
      clientUserId: opts.signer.clientUserId,
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Docusign recipient view failed: ${res.status} ${body}`);
  }

  const data = await res.json() as { url: string };
  return data.url;
}

export async function downloadSignedDocument(envelopeId: string): Promise<Buffer> {
  const token = await getAccessToken();
  const res = await fetch(
    `${BASE_URL}/v2.1/accounts/${ACCOUNT_ID}/envelopes/${envelopeId}/documents/1`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" } },
  );

  if (!res.ok) throw new Error(`Docusign document download failed: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto") as typeof import("crypto");
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("base64");
  return hmac === signature;
}
