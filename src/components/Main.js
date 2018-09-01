import fetch from "isomorphic-unfetch"
import React from "react"
import getConfig from "next/config"
// eslint-disable-next-line no-unused-vars
import SimpleSetting from "../components/SimpleSetting"

const {publicRuntimeConfig} = getConfig()

// eslint-disable-next-line no-unused-vars
const SaveMessage = () => (
    <div className="SaveMessage">
        <span className="save">Save by clicking on</span>
        <div className="saveButton tooltip">
            <span className="tooltiptext left">Save setting (example)</span>
        </div>
        <style jsx>{`
        .saveButton {
            position: absolute;
            left: 66px;
            width: 202px;
            display: inline;
            background-image: url(/static/pencil-orange.svg);
            background-size: 19px 19px;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
        }
        .saveButton:hover {
            background-image: url(/static/pencil-green.svg);
        }
        .tooltiptext {
            line-height: 9px;
            left: 121px;
            height: 19px;
            background-color: #4EBA00 !important;
            float: right;
        }
        .tooltiptext::after {
            top: 5px !important;
            border-color: transparent #4EBA00 transparent transparent !important;
        }
        .SaveMessage {
            display: inline-block;
            position: absolute;
            bottom: 30px;
            left: 30px;
        }
        `}</style>
    </div>
)

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
        this.state.guild = this.props.guild
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
                    <SimpleSetting name="prefix" value={this.state.guild.prefix} default="k!" width="237px" save={this.Save.bind(this)} />
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