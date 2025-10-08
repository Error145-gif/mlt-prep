declare module '@cashfreepayments/cashfree-js' {
  export interface CashfreeConfig {
    mode: 'sandbox' | 'production';
  }

  export interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank' | '_parent' | '_top';
  }

  export interface CashfreeInstance {
    checkout(options: CheckoutOptions): void;
  }

  export function load(config: CashfreeConfig): Promise<CashfreeInstance>;
}
