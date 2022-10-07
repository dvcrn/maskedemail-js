import { Mod, Session, MaskedEmail } from './types';

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

export * from './types';
