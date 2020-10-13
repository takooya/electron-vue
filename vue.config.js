const webpack = require('webpack')
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 部署路径
    publicPath: './',
    //Webpack配置
    chainWebpack: config => {
        // node-loader 配置
        /*config.module
            .rule('node')
            .test(/\.node$/)
            .use('node-loader')
            .loader('node-loader')*/
    },

    //修改webpack配置
    configureWebpack: config => {
        config.plugins.push(
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'windows.jQuery': 'jquery'
            })
        )
    },

    //第三方插件配置
    pluginOptions: {
        //electron打包配置
        electronBuilder: {
            builderOptions: {
                //下载配置
                electronDownload: {
                    mirror: "https://npm.taobao.org/mirrors/electron/"
                },
                //添加第三方文件
                extraResources: [
                    {
                        from: "./democpp.node",    //form: "文件源路径",
                        to: "../"           //to: "打包后要放的路径"
                    },
                    {
                        from: "./HWPostil.ocx",    //form: "文件源路径",
                        to: "../"           //to: "打包后要放的路径"
                    },
                    {
                        from: "./test/",    //form: "文件源路径",
                        to: "../test/"           //to: "打包后要放的路径"
                    }
                ],
                win: {
                    icon: './public/app-256.ico',
                    //artifactName: "${productName}_Setup_${version}.${ext}"
                    artifactName: "点聚PDF阅读器_Setup_${version}.${ext}"
                },
                mac: {
                    icon: './public/app.png'
                }
            }
        }
    },

    //开发服务配置
    devServer: {
        // can be overwritten by process.env.HOST
        host: '0.0.0.0',
        port: 8080
    }
}
