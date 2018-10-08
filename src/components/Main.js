import fetch from "isomorphic-unfetch"
import React from "react"
import getConfig from "next/config"
// eslint-disable-next-line no-unused-vars
import SimpleSetting from "../components/SimpleSetting"
// eslint-disable-next-line no-unused-vars
import SaveMessage from "../components/SaveMessage"

const {publicRuntimeConfig} = getConfig()

const NoGuildStyle = (
    <style>{`
    .main {
        position: absolute;
        border-radius: 20px;
        padding: 30px;
        color: #fff;
        left: 100px;
        top: 60px;
        width: calc(100% - 100px - 15px);
        height: calc(100% - 60px - 15px);
        background-image: url('/static/wompus.png');
        background-color: #35383D;
        background-size: cover;
        z-index: -1;
    }
    .guildName {
        font-size: 30px;
        padding: 10px;
        background-color: #23272A;
        border-radius: 10px;
    }
`}</style>
)



class Main extends React.Component {
    constructor(props) {
        super(props)
        this.Alert = this.props.alert
        this.Save = this.Save.bind(this)
        this.state = {}
    }

    async Save(name, value) {
        return new Promise( async (resolve,reject) => {
            var hostname = window.location.hostname
            const url = encodeURI(`http://${hostname}:${publicRuntimeConfig.publicPort}/api/kirito/save?id=${this.props.guild.id}&name=${name}&value=${JSON.stringify(value)}`)
            
            console.log(url)
            const response = await fetch(url)
            if (response.status !== 200) {
                if (response.status === 418)
                    this.Alert("critical", "Failed connecting to Kirito")
                
                //406 Not Acceptable
                else if (response.status === 406)
                    this.Alert("critical", await response.json().message)
                
                else this.Alert("critical",`Failed saving setting: ${name}`)
                reject()
            } else {
                this.Alert("success",`Saved setting: ${name}`)
                this.setState(prev => {
                    let g = prev.guild
                    g[name] = value
                    return {g}
                })
                resolve()
            }
        })
    }

    render() {
        if (!this.props.guild)
            return (
                <div className="main">
                    <span className="guildName">No guild selected</span>
                    {NoGuildStyle}
                </div>
            )
        else {
            return (
                <div className="main">
                    <span className="guildName">{this.props.guild.name}</span>
                    <SimpleSetting name="prefix" value={this.props.guild.prefix} default="k!" width="237px" save={this.Save.bind(this)} />
                    <SaveMessage />
                    <style jsx>{`
                        .main {
                            position: absolute;
                            border-radius: 20px;
                            padding: 30px;
                            color: #fff;
                            left: 100px;
                            top: 60px;
                            width: calc(100% - 100px - 15px);
                            height: calc(100% - 60px - 15px);
                            background-color: #35383D;
                            z-index: -1;
                        }
                        .guildName {
                            display: block;
                            width: fit-content;
                            font-size: 30px;
                            padding: 10px;
                            background-color: #23272A;
                            border-radius: 10px;
                        }
                    `}</style>
                </div>
            )
        }
    }
}

export default Main