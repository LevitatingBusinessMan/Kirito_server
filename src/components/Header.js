// eslint-disable-next-line no-unused-vars
import Link from "next/link"

const LoginButton  = (
    <Link href="/login">
        <button
            className="login btn"
            style={{
                float:"right",
                backgroundColor: "#00e600",
                top: "-3px",
                boxShadow: "none"
            }}>
        Login
        </button>
    </Link>
)

const Header = props =>  (
    <div className="header">
        {/* Possible header links */}
        {props.username ? <p className="user">{props.username}</p> : LoginButton }
        <style jsx>{`
            .header {
                padding: 5px 20px;
                height: 60px;
            }
            a {
                display: inline-block;
                cursor: pointer;
                text-decoration: none;
                color: black;
            }
            .user, .login {
                float:right;
                color: #fff;
            }
        `}</style>
    </div>
)

export default Header