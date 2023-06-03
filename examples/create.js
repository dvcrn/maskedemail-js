const { create } = require("../lib/main.cjs");

const token = process.env.FASTMAIL_TOKEN;
const accID = process.env.FASTMAIL_ACCOUNT_ID;

(async () => {
  const created = await create(token, accID, "somedomain.com", "some description", "xxxx");
  console.log(created);
})().catch((err) => {
  console.error(err);
});
