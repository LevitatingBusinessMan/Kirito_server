// eslint-disable-next-line no-unused-vars
import Link from "next/link"

const OpenNewTab = event => {
    // eslint-disable-next-line no-undef
    window.open(event.target.getAttribute("href"))
}

// eslint-disable-next-line no-unused-vars
const GuildBar = props => (
    <div className="guilds">
        <div className="tooltip guild-container">
            <Link href="/"><img className="Kirito guild"src="/static/Kirito.png" draggable="false"/></Link>
            <span className="tooltiptext nowrap left">Home</span>
        </div>
        <p className="guildCount">{`${props.guilds.length} ONLINE`}</p>
        {
            props.guilds.map(guild =>
                (<Link key={guild.id} as={`/dashboard/${guild.id}`} href={`/dashboard?guild=${guild.id}&reload=false`}>
                    <div className="tooltip guild-container">
                        {
                            guild.icon ?
                                <img className={"guild "+(props.guild == guild.id ? "active":"")} src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`}/>
                                : <div className={"guild no-name "+(props.guild == guild.id ? "active":"")}><span>{guild.name.replace(/(\B\w)|\s/g,"")}</span></div>
                        }
                        <span className="tooltiptext nowrap left">{guild.name}</span>
                    </div>
                </Link>)
            )
        }
        <div href="/invite" className="guild addGuild" onClick={OpenNewTab}>
            <img href="/invite" onClick={OpenNewTab} className="plus-sign" src="/static/plus-sign.svg" draggable="false"/>
        </div>
        <style jsx>{`
            .Kirito {
                width: 60px;
                height: 60px;
                border: 2px solid #fff;
                border-radius: 50%;
                object-fit: cover;
                cursor: pointer;
            }
            .guildCount {
                left: 27px;
                font-size: 12px;
                top: 0px;
                margin: 0px;
                margin-bottom: 10px !important;
                color: #fff;
            }
            .guilds {
                position: absolute;
                left: 0px;
                top: 0px;
                height: 100%;
                width: 100px;
                text-align: center;
                padding: 10px 0px;
            }
            .guild-container {
                width: 60px;
                height: 60px;
                margin-bottom: 8px;
                margin-left: auto;
                margin-right: auto;
            }
            .guild {
                cursor: pointer;
                display: block;
                width: 60px;
                height: 60px;
                border-radius: 50%; 
                overflow: hidden !important;
                margin-bottom: 7px;
                margin-left: auto;
                margin-right: auto;
                font-size: 13px;
                color: #fff;
                transition: border-radius 0.5s;
            }
            .guild:hover {
                border-radius: 30% !important; 
            }
            .no-name {
                vertical-align: middle;
                text-align: center;
                font-size: 20px;
                background-color: #000;
            }
            .no-name span {
                position:relative;
                top: calc(50% - 12px);
            }
            .active {
                border-radius: 30% !important; 
                box-shadow: -75px 0 #fff;
            }
            .plus-sign {
                width: 40px;
                height: 40px;
                position: relative;
                top: 7px;
                cursor: pointer;
            }
            .addGuild {
                text-align: center;
                border: 2px dotted #fff;
            }
            .tooltiptext {
                left: 85px;
                top: -45px;
            }
        `}</style>
    </div>
)

export default GuildBar