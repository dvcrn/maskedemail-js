export interface MaskedEmail {
  forDomain: string;
  createdAt: string;
  createdBy: string;
  url: string;
  email: string;
  id: string;
  lastMessageAt: string;
  state: "enabled" | "disabled";
}

export interface Session {
  capabilities: { [key: string]: object };
  accounts: {
    [key: string]: {
      name: string;
      accountCapabilities: any;
    };
  };
  primaryAccounts: Record<string, string>;
  apiUrl: string;
}

export interface Mod {
  session: (token: string) => Promise<Session>;
  list: (token: string, accountId: string, includeDeleted: boolean) => Promise<MaskedEmail[]>;
  create: (
    token: string,
    accountId: string,
    forDomain: string,
    description: string,
    prefix: string
  ) => Promise<MaskedEmail>;
  enable: (token: string, accountId: string, email: string) => Promise<MaskedEmail>;
  disable: (token: string, accountId: string, emailId: string) => Promise<MaskedEmail>;
  enableById: (token: string, accountId: string, email: string) => Promise<MaskedEmail>;
  disableById: (token: string, accountId: string, emailId: string) => Promise<MaskedEmail>;
}
