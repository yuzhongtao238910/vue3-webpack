const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const EslintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {VueLoaderPlugin} = require("vue-loader")
const path = require("path")
const {DefinePlugin} = require("webpack")
const TerserWebpackPlugin = require("terser-webpack-plugin")
const getStyleLoaders = (pre) => {
    return [
        // 针对vue项目
        isProdcution ? MiniCssExtractPlugin.loader : "vue-style-loader",
        'css-loader',
        {
            // 处理css兼容性
            // 配合package.json之中的browserslist来指定兼容性做到什么程度
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env']
                }
            }
        },
        pre && pre === "sass-loader" ? {
            loader: "sass-loader",
            options: {
                additionalData: `@use "@/styles/element/index.scss" as *;`
            }
        } : pre === "less-loader" ? {
            loader: 'less-loader',
            options: {
                lessOptions: {
                    modifyVars: {
                        'primary-color': '#1DA57A',
                        'link-color': '#1DA57A',
                        'border-radius-base': '2px',
                    },
                    javascriptEnabled: true,
                }
            },
        } : pre
    ].filter(Boolean)
}
const isProdcution = process.env.NODE_ENV === "production" ? true : false
let cdn = isProdcution ? {
    // css: ["https://cdn.jsdelivr.net/npm/element-plus/dist/index.css"],
    css: [
        "https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.20/dist/antd.min.css"
    ],
    js: [
        "https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.global.prod.min.js",
        'https://cdnjs.cloudflare.com/ajax/libs/vue-router/4.2.2/vue-router.global.prod.min.js',
        "https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.20/dist/antd.min.js"
        // "https://cdn.jsdelivr.net/npm/element-plus"
    ]
} : {}
module.exports = {
    entry: './src/main.js',
    output: {
        filename: "static/js/[name].js",
        path: isProdcution ? path.resolve(__dirname, "../dist") : undefined,
        chunkFilename: "static/js/[name].[hash:10].chunk.js",
        assetModuleFilename: "static/assets/[hash:10][ext]",
        clean: true
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.css$/,
                        use: getStyleLoaders()
                    },
                    {
                        test: /\.less$/,
                        use: getStyleLoaders("less-loader")
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: getStyleLoaders("sass-loader")
                    },
                    {
                        test: /\.styl$/,
                        use: getStyleLoaders("stylus-loader")
                    },
                    // 处理图片
                    {
                        test: /\.(jpe?g|png|gif|webp)$/,
                        type: 'asset',
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10*1024 // 小于10kb
                            }
                        }
                    },
                    // 处理其他字体资源
                    {
                        test: /\.(woff2?|ttf)$/,
                        type: 'asset/resource',
        
                    }
                ]
            },
            // 处理js  eslint babel
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options: {
                    // 开启缓存
                    cacheDirectory: true,
                    // 缓存不需要压缩
                    cacheCompression: false
                }
            },
            {
                test: /\.svg$/,
                type: 'asset',
                loader: 'svgo-loader',
                exclude: [path.resolve(__dirname, '../src/icons')],
                options: {
                    multipass: true,
                    js2svg: {
                        indent: 2,
                        pretty: true,
                    }
                }
            },
            {
                test: /\.svg$/,
                include: [path.resolve(__dirname, '../src/icons')],
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            symbolId: 'icon_[name]'
                        }
                    }
                ]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    cacheDirectory: path.resolve(__dirname, "../node_modules/.cache/vue-loader")
                }
            }
        ]
    },
    resolve: {
        extensions: [".vue", ".js", ".json"],
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    plugins: [
        new EslintWebpackPlugin({
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache")
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
            cdnTag: cdn
        }),
        new VueLoaderPlugin(),
        // 定义环境变量 cross-env 定义的环境变量是给打包工具使用的
        // DefinePlugin 是给源代码使用的，解决vue3的警告问题
        new DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false
        }),
        isProdcution && new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:10].css",
            chunkFilename: "static/css/[name].[contenthash:10].chunk.css"
        }),
        isProdcution && new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    globOptions: {
                        // 忽律index.html文件
                        ignore: ["**/index.html"]
                    }
                }
            ]
        })
    ].filter(Boolean),
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vue: {
                    test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
                    name: "vue-chunk",
                    priority: 30
                },
                // elementPlus: {
                //     test: /[\\/]node_modules[\\/]element-plus(.*)?[\\/]/,
                //     name: "elementPlus-chunk",
                //     priority: 20
                // },
                libs: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "libs-chunk",
                    priority: 10
                }
            }
        },
        // 代码分割会导致缓存失效，因为每次都需要重新引入，名字就会发生变化
        runtimeChunk: {
            name: entrypoint => `runtime-${entrypoint.name}.js`
        },
        minimize: isProdcution,
        minimizer: [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    },
    mode: isProdcution ? "production" : "development",
    performance: false,
    devtool: isProdcution ? "source-map" : "cheap-module-source-map",
    devServer: {
        host: 'localhost',
        port: 3000,
        open: false,
        hot: true,
        // 解决html5 history 刷新404 的问题
        historyApiFallback: true
    }
}