import MyWorkers from "./src/workers";

module.exports = (async () => {
  const app = new MyWorkers();
  await app.init(true);
})();