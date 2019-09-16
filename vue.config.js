module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },
    devServer: {
        host: process.env.VUE_APP_HOST,
        port: process.env.VUE_APP_PORT,
        // headers: {
        //     "Access-Control-Allow-Origin": "*",
        //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        //     "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        // }
    }
}
  