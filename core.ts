export interface MaskedEmail {
  forDomain: string;
  createdAt: string;
  createdBy: string;
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
  list: (token: string, accountId: string) => Promise<MaskedEmail[]>;
  create: (
    token: string,
    accountId: string,
    forDomain: string
  ) => Promise<MaskedEmail>;
  enable: (
    token: string,
    accountId: string,
    email: string
  ) => Promise<MaskedEmail>;
  disable: (
    token: string,
    accountId: string,
    emailId: string
  ) => Promise<MaskedEmail>;
  enableById: (
    token: string,
    accountId: string,
    email: string
  ) => Promise<MaskedEmail>;
  disableById: (
    token: string,
    accountId: string,
    emailId: string
  ) => Promise<MaskedEmail>;
}

export class MaskedEmailClient {
  constructor(private init: () => Promise<Mod>) {}

  /**
   * Retrieves the session for the given token (if available)
   *
   * @param      {string}  token   FastMail API token
   * @return     {Promise<Session>}  Promise that resolves with users Session
   */
  session = async (token: string): Promise<Session> => {
    const mod = await this.init();
    return mod.session(token);
  };

  /**
   * Retrieves a list of all MaskedEmails in the given account
   *
   * @param      {string}  token      FastMail API token
   * @param      {string}  accountId  FastMail Account ID
   * @return     {Promise<MaskedEmail[]>}  Promise that resolves with an array of masked emails
   */
  list = async (token: string, accountId: string): Promise<MaskedEmail[]> => {
    const mod = await this.init();
    return mod.list(token, accountId);
  };

  /**
   * Creates a new MaskedEmail for the given domain
   * The return of this function is not a full MaskedEmail object, not all keys will be set.
   * If you need all keys, consider fetching again
   *
   * @param      {string}  token      FastMail API token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  forDomain  For which domain the email should get created
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the created MaskedEmail
   */
  create = async (
    token: string,
    accountId: string,
    forDomain: string
  ): Promise<MaskedEmail> => {
    const mod = await this.init();
    return mod.create(token, accountId, forDomain);
  };

  /**
   * Sets the given MaskedEmail to 'enabled'
   * Return value is not returning anything yet
   *
   * @param      {string}  token      FastMail API Token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  email      Full qualified email to update
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
   */
  enable = async (token: string, accountId: string, email: string): Promise<MaskedEmail> => {
    const mod = await this.init();
    return mod.enable(token, accountId, email);
  };

  /**
   * Sets the given MaskedEmail to 'disabled'
   * Return value is not returning anything yet
   *
   * @param      {string}  token      FastMail API Token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  email      Full qualified email to update
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
   */
  disable = async (token: string, accountId: string, email: string): Promise<MaskedEmail> => {
    const mod = await this.init();
    return mod.disable(token, accountId, email);
  };

  /**
   * Sets the given MaskedEmail by ID to 'enabled'
   * Return value is not returning anything yet
   *
   * @param      {string}  token      FastMail API Token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  emailId      Id of the masked email to update
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
   */
  enableById = async (token: string, accountId: string, emailId: string): Promise<MaskedEmail> => {
    const mod = await this.init();
    return mod.enableById(token, accountId, emailId);
  };

  /**
   * Sets the given MaskedEmail to 'enabled'
   * Return value is not returning anything yet
   *
   * @param      {string}  token      FastMail API Token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  email      Id of the masked email to update
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
   */
  disableById = async (token: string, accountId: string, emailId: string) => {
    const mod = await this.init();
    return mod.disableById(token, accountId, emailId);
  };
}

export default MaskedEmailClient;

export const load = (init: () => Promise<Mod>) => ({

  session: async (token: string): Promise<Session> => {
    const mod = await init();
    return mod.session(token);
  },

  /**
   * Retrieves a list of all MaskedEmails in the given account
   *
   * @param      {string}  token      FastMail API token
   * @param      {string}  accountId  FastMail Account ID
   * @return     {Promise<MaskedEmail[]>}  Promise that resolves with an array of masked emails
   */
  list: async (token: string, accountId: string): Promise<MaskedEmail[]> => {
    const mod = await init();
    return mod.list(token, accountId);
  },

  /**
   * Creates a new MaskedEmail for the given domain
   * The return of this function is not a full MaskedEmail object, not all keys will be set.
   * If you need all keys, consider fetching again
   *
   * @param      {string}  token      FastMail API token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  forDomain  For which domain the email should get created
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the created MaskedEmail
   */
  create: async (
    token: string,
    accountId: string,
    forDomain: string
  ): Promise<MaskedEmail> => {
    const mod = await init();
    return mod.create(token, accountId, forDomain);
  },

  /**
   * Sets the given MaskedEmail to 'enabled'
   * Return value is not returning anything yet
   *
   * @param      {string}  token      FastMail API Token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  email      Full qualified email to update
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
   */
  enable: async (token: string, accountId: string, email: string): Promise<MaskedEmail> => {
    const mod = await init();
    return mod.enable(token, accountId, email);
  },

  /**
   * Sets the given MaskedEmail to 'disabled'
   * Return value is not returning anything yet
   *
   * @param      {string}  token      FastMail API Token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  email      Full qualified email to update
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
   */
  disable: async (token: string, accountId: string, email: string): Promise<MaskedEmail> => {
    const mod = await init();
    return mod.disable(token, accountId, email);
  },

  /**
   * Sets the given MaskedEmail by ID to 'enabled'
   * Return value is not returning anything yet
   *
   * @param      {string}  token      FastMail API Token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  emailId      Id of the masked email to update
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
   */
  enableById: async (token: string, accountId: string, emailId: string): Promise<MaskedEmail> => {
    const mod = await init();
    return mod.enableById(token, accountId, emailId);
  },

  /**
   * Sets the given MaskedEmail to 'enabled'
   * Return value is not returning anything yet
   *
   * @param      {string}  token      FastMail API Token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  email      Id of the masked email to update
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the changed MaskedEmail (currentl NOT working)
   */
  disableById: async (token: string, accountId: string, emailId: string) => {
    const mod = await init();
    return mod.disableById(token, accountId, emailId);
  },
});
