export function createHelperRequest(challengeText, publicKeyFingerprint, helperOrigin = "http://127.0.0.1:8787") {
  return {
    url: `${helperOrigin}/v1/root-auth/sign-login-challenge`,
    body: {
      challengeText,
      publicKeyFingerprint,
    },
  };
}

export function validateHelperResponse(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("The signer helper returned an unreadable response.");
  }

  if (typeof payload.signature !== "string" || payload.signature.trim().length === 0) {
    throw new Error("The signer helper did not return a usable signature.");
  }

  if (
    typeof payload.publicKeyFingerprint !== "string" ||
    payload.publicKeyFingerprint.trim().length === 0
  ) {
    throw new Error("The signer helper did not return a usable key fingerprint.");
  }

  return {
    signature: payload.signature.trim(),
    publicKeyFingerprint: payload.publicKeyFingerprint.trim(),
  };
}

export async function signLoginChallenge(challengeText, publicKeyFingerprint) {
  const request = createHelperRequest(challengeText, publicKeyFingerprint);
  const response = await fetch(request.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(request.body),
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message ?? "The signer helper could not sign the login challenge.");
  }

  return validateHelperResponse(payload);
}
