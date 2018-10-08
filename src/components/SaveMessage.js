//Message on bottom of main saying "save by clicking on icon"

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

export default SaveMessage