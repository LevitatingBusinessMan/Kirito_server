/* eslint-disable */
const express = require("express")
const next = require("next")
const fetch = require("isomorphic-unfetch")
const path = require("path")
const btoa = require("btoa")
const cookieParser = require("cookie-parser")

const dev = process.env.NODE_ENV !== "production"
const app = next({dev,dir:__dirname})
const handle = app.getRequestHandler()
const {CLIENT_ID, CLIENT_SECRET, SERVER_INVITE, redirect_uri,port} = require(path.join(__dirname,"../config/config"))
const basicAuth = `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`

app.prepare()
.then(() => {
    const server = express()
    server.use(cookieParser())

    server.get("/invite", (req, res) => {
        //redirect not working because???
        res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot&permissions=8`)
    });

    server.get("/server_invite", (req, res) => {
        res.redirect(SERVER_INVITE)
    });


    server.get("/login", (req, res) => {
        res.redirect(`https://discordapp.com/api/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=identify`)
    });

    server.get("/logout", (req,res) => {
        res.cookie("discord", "", {maxAge:-1})
        res.cookie("user", "", {maxAge:-1})
        res.redirect("/dashboard")
    })

    server.get("/api/kirito/get_servers", (req,res) => {
        if (!req.query.id) return res.status(400).send({
            status: "ERROR",
            error: "NoUserIDProvided",
        });
        const {KiritoBotIP} = require(path.join(__dirname,"../config/config"))
        fetch(`${KiritoBotIP}/api/get_servers?id=${req.query.id}`, {
            headers: {
                Authorization: `Basic ${btoa(`Kirito:${CLIENT_SECRET}`)}`
            }
        }).then(async response => res.send(await response.json()))
        .catch(e => res.status(418).send("Kirito offline"))
    })

    server.get("/api/kirito/save", (req,res) => {
        const {id,name,value} = req.query;
        if (!id || !name || !value) return res.status(400).send({
            status: "ERROR",
            error: "MissingParams",
        });

        const {KiritoBotIP} = require(path.join(__dirname,"../config/config"))
        const url = `${KiritoBotIP}/api/save?id=${id}&name=${name}&value=${value}`
        fetch(url, {
            headers: {
                Authorization: `Basic ${btoa(`Kirito:${CLIENT_SECRET}`)}`
            }
        }).then(async response => res.status(response.status).send(await response.json()))
        .catch(e => {
            if (e.code === "ECONNREFUSED")
                res.status(418).send("Kirito offline")
            else res.status(500).send(e)
        })
    })

    server.get("/api/discord/callback", async (req, res) => {
        if (!req.query.code) return res.status(400).send({
            status: "ERROR",
            error: "NoCodeProvided",
          });
        const code = req.query.code
        const response = await (await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&scope=identify`,{
            method: "POST",
            headers: {
                Authorization: basicAuth,
            }
        })).json()

        if (response.access_token) {
            console.log("Acquired token")
            const expires = new Date(new Date().getTime() + response.expires_in*10000)
            res.cookie("discord", response, {expires})
            res.redirect("/dashboard")
        } else {
            res.redirect("/dashboard?error=failed_oauth")
        }
    })

    server.get("/api/discord/refresh_token", async (req, res) => {
        if (!req.query.token) return res.status(400).send({
            status: "ERROR",
            error: "NoTokenProvided",
        });
        const token = req.query.token

        const response = await (await fetch(`https://discordapp.com/api/oauth2/token?grant_type=refresh_token&refresh_token=${token}&redirect_uri=${redirect_uri}&scope=identify`,{
            method: "POST",
            headers: {
                Authorization: basicAuth,
            }
        })).json()

        if (response.access_token) {
            console.log("refreshed token")
            let expires = new Date(new Date().getTime() + response.expires_in*10000)
            res.cookie("discord", response, {expires})
            res.redirect("/dashboard")
        } else {
            res.redirect("/dashboard?error=failed_token_refresh")
        }
    })

    var servers = {timestamp:0}
    server.get("/api/servers", async (req, res) => {
        if (new Date() - servers.timestamp > 60*10*1000) {
            const {KiritoBotIP, LavalinkIP} = require(path.join(__dirname,"../config/config"))
        
            var result = {};
            const Kirito = fetch(KiritoBotIP).then(() => result.Kirito = "online").catch(() => result.Kirito = "offline");
            const Lavalink = fetch(LavalinkIP).then(() => result.Lavalink = "online").catch(() => result.Lavalink = "offline");
    
            await Promise.all([Kirito,Lavalink]);
            servers = {Kirito: result.Kirito, Lavalink: result.Lavalink, timestamp: new Date()}
            res.send(result);
        } else {
            res.send({Kirito: servers.Kirito, Lavalink: servers.Lavalink});
        }
    })


    //Clean url for dashboard
    server.get("/dashboard/:id", (req,res) => {
        app.render(req, res, "/dashboard", { guild: req.params.id})
    })

    server.get("*", (req, res) => {
        return handle(req, res)
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})
.catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
})