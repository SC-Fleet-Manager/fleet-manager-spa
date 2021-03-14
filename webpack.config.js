const Encore = require('@symfony/webpack-encore');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath(process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '/build')
    .setManifestKeyPrefix('build/')

    // .addEntry('main', './src/main.js')
    .addEntry('home', './src/home.js')

    .splitEntryChunks()
    .disableSingleRuntimeChunk()

    .addAliases({
        '@': path.resolve(__dirname, 'src'),
        '@styles': path.resolve(__dirname, 'assets/styles'),
        '@img': path.resolve(__dirname, 'assets/img'),
        '@fonts': path.resolve(__dirname, 'assets/fonts'),
    })

    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .enableIntegrityHashes(Encore.isProduction())
    .addPlugin(new HtmlWebpackPlugin({
        "template": "./src/index.html",
        "filename": "../index.html",
        "hash": Encore.isProduction(),
        "inject": true,
        "compile": true,
        "favicon": false,
        "minify": Encore.isProduction(),
        "cache": true,
        "showErrors": true,
        "chunks": "all",
        "excludeChunks": [],
        // "title": "Webpack App",
    }))

    .enableSassLoader()
    .enablePostCssLoader()

    .enableTypeScriptLoader()
    .enableVueLoader(function(options) {
        // https://vue-loader.vuejs.org/options.html
    })

    .copyFiles({
        from: './src/vendors',
        to: 'vendors/[path][name].[ext]',
    })
    .copyFiles({
        from: './assets/img/static',
        to: 'images/static/[path][name].[ext]',
    })

    .addPlugin(new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: !Encore.isProduction(),
    }))
    .addPlugin(new MomentLocalesPlugin({
        localesToKeep: ['en'],
    }))
    .addPlugin(new NormalModuleReplacementPlugin(
        /moment-timezone\/data\/packed\/latest\.json/,
        require.resolve('./src/timezones.json')
    ))
;

module.exports = Encore.getWebpackConfig();
