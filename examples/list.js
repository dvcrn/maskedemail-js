const { list, create } = require("../lib/main.cjs");

const token = process.env.FASTMAIL_TOKEN;
const accID = process.env.FASTMAIL_ACCOUNT_ID;

(async () => {
  const pr = await list(token, accID);
  console.log(pr);
  console.log(pr[pr.length - 1]);

  // list, but also include deleted
  const prWithDeleted = await list(token, accID, true);
  console.log(prWithDeleted);
})().catch((err) => {
  console.error(err);
});
