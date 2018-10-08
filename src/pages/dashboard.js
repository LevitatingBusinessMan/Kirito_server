// eslint-disable-next-line no-unused-vars
import Header from "../components/Header"
// eslint-disable-next-line no-unused-vars
import GuildBar from "../components/GuildBar"
// eslint-disable-next-line no-unused-vars
import Main from "../components/Main"
// eslint-disable-next-line no-unused-vars
import Link from "next/link"
import getConfig from "next/config"
import nookies from "nookies"
import Router from "next/router"
import fetch from "isomorphic-unfetch"
import React from "react"
import NProgress from "nprogress"

const {publicRuntimeConfig} = getConfig()

// eslint-disable-next-line no-unused-vars
class Alert extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.state.closing = false
        this.close = this.close.bind(this)
        this.interval = setInterval(this.close,5000)
    }

    close() {
        clearInterval(this.interval)
        // eslint-disable-next-line no-unused-labels
        this.setState({closing: true}, () => {
            setInterval(() => this.props.onRemove(this.props.id),900)
        })
    }

    render() {
        return (
            <div className={`alert ${this.props.type} ${this.state.closing ? "closing" :""}`}>
                <span className="type">{this.props.type}</span>
                <span className="msg">{this.props.msg}</span>
                <span className="closebtn" onClick={this.close}>&times;</span>
            </div>
        )
    }
}

//<AlertButtons alert={this.Alert.bind(this)}/>
// eslint-disable-next-line no-unused-vars
const AlertButtons = props => (
    <div style={{position:"absolute",bottom:"4%",left:"10%"}}>
        <button style={{backgroundColor:"red"}}className="btn" onClick={() => props.alert("critical","TEST")}>TEST</button>
        <button style={{backgroundColor:"orange"}}className="btn" onClick={() => props.alert("warning","TEST")}>TEST</button>
        <button style={{backgroundColor:"skyblue"}}className="btn" onClick={() => props.alert("info","TEST")}>TEST</button>
        <button style={{backgroundColor:"green"}}className="btn" onClick={() => props.alert("success","TEST")}>TEST</button>
    </div>
)

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {alerts:[],alertCount:0}
        if (props.error)
            this.state.alerts.push({type:"critical", msg:props.error,id:0})
    }

    Alert(type,msg) {
        const a = {
            id: this.state.alertCount + 1,
            type,
            msg
        }
        this.setState((prevState) => ({
            alerts: prevState.alerts.concat([a]),
            alertCount: prevState.alertCount + 1
        }))
    }

    RemoveAlert(id) {
        this.setState((prevState) => ({
            alerts: prevState.alerts.filter(a => a.id !== id),
            alertCount: prevState.alertCount
        }))
    }

    render() {
        return (
            <div>
                <div className="alert-container">
                    {this.state.alerts.map(e=><Alert msg={e.msg} type={e.type} key={e.id} id={e.id} onRemove={this.RemoveAlert.bind(this)}/>)}
                </div>
                <Header username={this.props.username} guildCount={this.props.guilds.length}/>
                {this.props.username ? <Link href="/logout"><button className="btn logout">Logout</button></Link> : ""}
                <GuildBar guild={this.props.guild} guilds={this.props.guilds}/>

                <Main guild={this.props.guilds.find(g => g.id === this.props.guild)} alert={this.Alert.bind(this)}/>
                <style jsx>{`
                    .logout {
                        float: right;
                        margin-right: 40px;
                        margin-top: 20px;
                        background-color: red;
                    }
                `}</style>
                <style jsx global>{"body{background-color: #2C2F33 !important;}"}</style>
            </div>
        )
    }
    
    static async getInitialProps(ctx){

        NProgress.configure({ showSpinner: false })
        Router.onRouteChangeStart = () => NProgress.start()
        Router.onRouteChangeComplete = () => NProgress.done()
        Router.onRouteChangeError = () => NProgress.done()    

        const guild = ctx.query.guild
        var error = ctx.query.error
        const reload = ctx.query.reload || "true"
    
        const cookies = nookies.get(ctx)
        if (cookies.discord && !error) {
            const discord = cookies.discord ? JSON.parse(cookies.discord.substring(2)) : undefined
            let user = cookies.user ? JSON.parse(cookies.user) : undefined
    
            console.log(user ? null :"no-user")
            
            //User
            if (!user) {
                const response = await fetch("https://discordapp.com/api/users/@me",{
                    headers: {
                        Authorization: `Bearer ${discord.access_token}`,
                    }
                })
    
                if (response.status !== 200) {
                    //Bad token
                    if (response.status == 401) {
                        refreshToken()
                        return {}
                    } else {
                        error = "Failed retrieving user"
                        return {guild,error,reload,guilds:[]}
                    }
                } else {
                    console.log('User received')
                    user = await response.json()
                    nookies.set(ctx, "user", JSON.stringify(user), {maxAge:60*60*24*2*1000})
                }
            }
    
            //Guilds
            if (ctx.req)
                var hostname = ctx.req.hostname
            // eslint-disable-next-line no-redeclare
            else var hostname = window.location.hostname

            const response = await fetch(`http://${hostname}:${publicRuntimeConfig.publicPort}/api/kirito/get_servers?id=${user.id}`)
            if (response.status !== 200) {
                if (response.status === 418)
                    error = "Failed connecting to Kirito"
                else error = "Failed retrieving guilds"
                return {guild,error,reload,guilds:[]}
            } else {
                console.log('Guilds received')
                var guilds = (await response.json())
            }
    
            const {username, locale, mfa_enabled, avatar, discriminator, id} = user
            return {
                discord,
                username,
                locale,
                mfa_enabled,
                avatar,
                discriminator,
                id,
                guilds,
                guild,
                error,
                reload
            }
            // eslint-disable-next-line no-inner-declarations
            function refreshToken() {
                nookies.destroy(ctx, "discord")
                if (ctx.res) {
                    ctx.res.writeHead(200, {
                        Location: `/api/discord/refresh_token?token=${discord.refresh_token}`
                    })
                    ctx.res.end()
                } else Router.push(`/api/discord/refresh_token?token=${discord.refresh_token}`)
            }

        } else {
            //Make sure there are no other cookies
            nookies.destroy(ctx,"user")
            nookies.destroy(ctx,"guilds")
            return {guild,error,reload,guilds:[]}
        }
    }
}

export default Dashboard
