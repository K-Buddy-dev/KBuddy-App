module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugin: ["hot-updater/babel-plugin"],
  };
};
