module.exports = {
    serverRuntimeConfig: { // Will only be available on the server side
    },
    publicRuntimeConfig: { // Will be available on both server and client
        port: require(require("path").join(__dirname, "../config/config")).port,
        publicPort: require(require("path").join(__dirname, "../config/config")).publicPort
    }
}