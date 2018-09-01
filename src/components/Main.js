import fetch from "isomorphic-unfetch"
import React from "react"

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

// eslint-disable-next-line no-unused-vars
class SimpleSetting extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.state.edited = false
        this.state.defaultValue = this.props.value

        this.onChange = this.onChange.bind(this)
        this.saveHandle = this.saveHandle.bind(this)
    }

    onChange(event) {
        if (event.target.value !== event.target.defaultValue)
            this.setState(({edited:true, value: event.target.value, defaultValue: event.target.defaultValue}))
        else this.setState(({edited:false, value: event.target.value, defaultValue: event.target.defaultValue}))
    }

    saveHandle(event) {
        this.props.save(this.props.name, this.state.value)
            .then(() => this.setState(prev => ({edited:false, defaultValue: prev.value})))
    }

    render() {
        return (
            <div className="simpleSetting">
                {
                    this.state.edited ?
                        <img className="tick" src="/static/tick.svg" draggable="false" onClick={this.saveHandle}/>
                        : ""
                }
                <span>{this.props.name}:</span>
                <input defaultValue={this.state.defaultValue ? this.state.defaultValue : this.props.default} onChange={this.onChange}/>
                <style jsx>{`
                .simpleSetting {
                    margin: 50px 0;
                    padding: 10px 15px;
                    width: ${this.props.width};
                    background-color: #23272A;
                    border-radius: 5px;
                    display: inline-block;
                }
                span {
                    text-transform: uppercase;
                    text-decoration: underline;
                    display: block;
                    margin-right: 10px;
                }
                input {
                    background-color: #35383D;
                    display: inline-block;
                    margin-top: 3px;
                    border: none;
                    color: #fff;
                    width: 100%;
                    padding: 3px 5px;
                    border-radius: 5px;
                    outline: none;
                }
                input:focus {
                    box-shadow: 0 0 10px 3px #ff751a;
                }
                .tick {
                    display: inline;
                    cursor: pointer;
                    position: relative;
                    top: 24px;
                    right: 7px;
                    width: 19px;
                    height: 19px;
                    float: right;
                }
                .tick:hover ~ input{
                    box-shadow: 0 0 10px 3px #4EBA00;
                }
                `}</style>
            </div>
        )
    }
}

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
            console.log(hostname)
            const url = `http://${hostname}:3000/api/kirito/save?id=${this.props.guild.id}&name=${name}&value=${JSON.stringify(value)}`
            
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