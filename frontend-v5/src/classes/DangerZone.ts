export class DangerZone<T> {
  password: string;
  totp: string;
  passwordMode: boolean;
  attrs: T;

  constructor(hasTotp: boolean, attrs?: T) {
    this.passwordMode = !hasTotp;
    this.password = "";
    this.totp = "";
    this.attrs = attrs;
  }
}
