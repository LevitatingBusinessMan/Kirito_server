module.exports = {
    apps : [{
        name      : "Server",
        script    : "./src/index.js",
        log       : "./pm2/pm2.log",
        env: {
            "NODE_ENV": "production",
        }
    }]
};
