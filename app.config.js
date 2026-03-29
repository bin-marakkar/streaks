const { version } = require('./package.json');

module.exports = ({ config }) => {
  const IS_DEV = process.env.APP_VARIANT === 'development';

  const base = {
    ...config,
    // Single source of truth: version is always read from package.json.
    // Run `npm version patch|minor|major` to bump — app.json never needs editing.
    version,
  };

  if (IS_DEV) {
    return {
      ...base,
      name: `${base.name} (Dev)`,
      ios: {
        ...base.ios,
        bundleIdentifier: base.ios?.bundleIdentifier
          ? `${base.ios.bundleIdentifier}.dev`
          : undefined,
      },
      android: {
        ...base.android,
        package: base.android?.package ? `${base.android.package}.dev` : undefined,
      },
    };
  }

  return base;
};
