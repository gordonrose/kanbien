import { InvalidNewPasswordError } from "../contract/errors";

export function assertPasswordPolicy(password: string, minimumLength: number): void {
  if (password.length < minimumLength) {
    throw new InvalidNewPasswordError("too_short");
  }

  if (!/[a-z]/.test(password)) {
    throw new InvalidNewPasswordError("missing_lowercase");
  }

  if (!/[A-Z]/.test(password)) {
    throw new InvalidNewPasswordError("missing_uppercase");
  }

  if (!/[0-9]/.test(password)) {
    throw new InvalidNewPasswordError("missing_number");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new InvalidNewPasswordError("missing_symbol");
  }
}
