const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Esta es la línea clave que corrige tu error:
config.transformer.unstable_allowRequireContext = true;

module.exports = config;