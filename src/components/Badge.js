const Badge = props => (
    <div className="container">
        <div className="badge name">{props.name}</div>
        <div className="badge state">{props.state}</div>
        <style jsx>{`
            .container {
                display: inline;
                margin: 1px 2px;
                box-shadow: 2px 4px 10px;
            }
            .badge {
                display: inline;
                font-family: montserrat, sans-serif;
                font-size: 12px;
                padding: 3px;
                font-weight 500;
            }
            .name {
                background-color: rgb(77, 77, 77);
                color: #fff;
                border-top-left-radius: 15%;
                border-bottom-left-radius: 15%;
            }
            .state {
                background-color: ${props.color};
                color: #fff;
                border-top-right-radius: 15%;
                border-bottom-right-radius: 15%;
            }
        `}</style>
    </div>
)

export default Badge