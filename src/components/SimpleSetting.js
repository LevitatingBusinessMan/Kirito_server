// eslint-disable-next-line no-unused-vars
class SimpleSetting extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.state.edited = false

        //This component receives:
        //value: guilds value for the setting
        //default: the default value for the setting (in case nu guild value)

        this.onChange = this.onChange.bind(this)
        this.saveHandle = this.saveHandle.bind(this)
    }

    onChange(event) {
        if (event.target.value !== this.props.value)
            this.setState(({edited:true, value: event.target.value}))
        else this.setState(({edited:false, value: event.target.value}))
    }

    saveHandle() {
        this.props.save(this.props.name, this.state.value)
            .then(() => this.setState(() => ({edited:false})))
    }

    render() {
        return (
            <div className="simpleSetting">
                {
                    this.state.edited ?
                        <div className="tooltip">
                            <div className="tick" onClick={this.saveHandle}/>
                            <span className="tooltiptext left">Save setting</span>
                        </div>
                        : ""
                }
                <span className="setting-name">{this.props.name}:</span>
                {/*
                {this.props.value}
                {this.state.value ? this.state.value : 0}
                {this.state.edited ? 1:0}
                */}
                {/* Issue: state doesnt get reset */}
                <input defaultValue={
                    (this.props.value ? this.props.value : this.props.default)
                } onChange={this.onChange}/>
                <style jsx>{`
                .simpleSetting {
                    margin: 50px 0;
                    padding: 10px 15px;
                    width: ${this.props.width};
                    background-color: #23272A;
                    border-radius: 5px;
                    display: inline-block;
                }
                .setting-name {
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
                .tick{
                    background-image: url(/static/pencil-orange.svg);
                    background-size: cover;
                    display: inline;
                    cursor: pointer;
                    position: relative;
                    top: 24px; /* 24 */
                    right: 7px;
                    width: 19px;
                    height: 19px;
                    float: right;
                    fill: #4EBA00;
                }
                .tooltip:hover .tick {
                    background-image: url(/static/pencil-green.svg);
                }
                span.tooltiptext {
                    line-height: 2px;
                    padding: 9px 10px;
                    height: 19px;
                    position: relative;
                    top: 24px;
                    left: 145px;
                    background-color: #4EBA00;
                    float: right;
                }
                span.tooltiptext::after {
                    border-color: transparent #4EBA00 transparent transparent !important;
                    top: 5px !important;
                }
                .tooltip:hover ~ input{
                    box-shadow: 0 0 10px 3px #4EBA00;
                }
                `}</style>
            </div>
        )
    }
}

export default SimpleSetting