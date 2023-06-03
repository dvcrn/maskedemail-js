import { Mod, Session, MaskedEmail } from "./types";

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
   * @param      {boolean}  includeDeleted  Whether to also include deleted masked emails (default false)
   * @return     {Promise<MaskedEmail[]>}  Promise that resolves with an array of masked emails
   */
  list: async (
    token: string,
    accountId: string,
    includeDeleted = false
  ): Promise<MaskedEmail[]> => {
    const mod = await init();
    return mod.list(token, accountId, includeDeleted);
  },

  /**
   * Creates a new MaskedEmail for the given domain
   * The return of this function is not a full MaskedEmail object, not all keys will be set.
   * If you need all keys, consider fetching again
   *
   * @param      {string}  token      FastMail API token
   * @param      {string}  accountId  FastMail Account ID
   * @param      {string}  forDomain  For which domain the email should get created
   * @param      {string}  description  Description of the masked email
   * @param      {string}  prefix  Prefix to use (eg xxx.f3x@mydomain.com, prefix is 'xxx')
   * @return     {Promise<MaskedEmail>}  Promise that resolves with the created MaskedEmail
   */
  create: async (
    token: string,
    accountId: string,
    forDomain: string,
    description = "",
    prefix = ""
  ): Promise<MaskedEmail> => {
    const mod = await init();
    return mod.create(token, accountId, forDomain, description, prefix);
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
});

export * from "./types";
