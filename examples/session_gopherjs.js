const { init, session } = require("../lib/main.cjs");

const token = process.env.FASTMAIL_TOKEN;
const accID = process.env.FASTMAIL_ACCOUNT_ID;

(async () => {
  await init("gopherjs");
  const sess = await session(token);
  console.log(sess);
})().catch((err) => {
  console.error(err);
});
