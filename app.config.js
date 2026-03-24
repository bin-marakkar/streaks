module.exports = ({ config }) => {
  const IS_DEV = process.env.APP_VARIANT === 'development';

  if (IS_DEV) {
    return {
      ...config,
      name: `${config.name} (Dev)`,
      ios: {
        ...config.ios,
        bundleIdentifier: config.ios?.bundleIdentifier ? `${config.ios.bundleIdentifier}.dev` : undefined,
      },
      android: {
        ...config.android,
        package: config.android?.package ? `${config.android.package}.dev` : undefined,
      },
    };
  }

  return config;
};
