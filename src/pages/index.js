// eslint-disable-next-line no-unused-vars
import Badge from "../components/Badge"
// eslint-disable-next-line no-unused-vars
import Link from "next/link"
import fetch from "isomorphic-unfetch"
import Router from "next/router"
import NProgress from "nprogress"


const imgStyle = {
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    objectFit: "cover",
    "marginTop": "5%"
}

const OpenNewTab = event => {
    window.open(event.target.getAttribute("href"))
}

// eslint-disable-next-line no-unused-vars
const DashboardButton = () => (
    <Link href="/dashboard">
        <div className="DashboardButton">
            <p>Dashboard</p>
            <img src="/static/right-arrow.svg" width="200" height="40"/>
            <style jsx>{`
                .DashboardButton {
                    position: absolute;
                    top: 28px;
                    right: 0;
                    margin: 0px;
                    padding: 0px;
                }
                .DashboardButton > img {
                    transition: filter 0.5s;
                }
                .DashboardButton:hover > img {
                    filter: drop-shadow(0 0 2px #000);
                }
                p {
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0px;
                    padding-bottom: 10px;
                    cursor: pointer;
                }
                img {
                    cursor: pointer;
                }
            `}</style>
        </div>
    </Link>
)

const Index = props => (
    <div style={{textAlign:"center"}}>
        <DashboardButton />
        <img src="/static/Kirito.png" style={imgStyle} draggable="false"/>
        <div>
            <div id="badgescontainer">
                <Badge name="Kirito" state={props.Kirito} color={props.Kirito === "online"?"#00cc00":"#ff0000"}/>
                <Badge name="Lavalink" state={props.Lavalink} color={props.Lavalink === "online"?"#00cc00":"#ff0000"}/>
            </div>
            <div id="buttoncontainer">
                <button className="btn invite" onClick={OpenNewTab} href="/invite">Invite</button> 
                <button className="btn server" onClick={OpenNewTab} href="/server_invite">Server</button>
            </div>
            <style jsx>{`
                #buttoncontainer {
                    margin-top: 6%;
                }
                #badgescontainer {
                    margin: 20px;
                }
                .invite {
                    background-color: #000;
                    margin-right: 15px !important;
                }
                .server {
                    background-color: #5cd6d6;
                }
                `}</style>
            <style jsx global>{`
                #badgescontainer > .container:first-child {margin-right: 15px !important;}
            `}</style>
        </div>
    </div>
)

Index.getInitialProps = async ctx => {

    NProgress.configure({ showSpinner: false })
    Router.onRouteChangeStart = () => NProgress.start()
    Router.onRouteChangeComplete = () => NProgress.done()
    Router.onRouteChangeError = () => NProgress.done()

    if (ctx.req) var host = ctx.req.headers.host
    // eslint-disable-next-line no-redeclare
    else var host = window.location.host


    return await (await fetch(`http://${host}/api/servers`)).json()
}

export default Index