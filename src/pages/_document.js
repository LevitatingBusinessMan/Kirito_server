// eslint-disable-next-line no-unused-vars
import Document, { Head, Main, NextScript } from "next/document"

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <html>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <link rel="stylesheet" type="text/css" href="/static/style.css"/>
                    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"/>
                    <script src="static/nprogress/nprogress.js"></script>
                    <link rel="stylesheet" href="static/nprogress/nprogress.css"/>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}