import Footer from "./footer"
import Header from "./header"

const Layout = ({
    children
}) => {
    return (
        <>
            {/* <Header /> */}
            <div
                className={`flex-shrink-0 h-full text-main-text bg-violet-light`}>
                {children}
            </div>
            {/* <Footer/> */}
        </>
    )
}

export default Layout