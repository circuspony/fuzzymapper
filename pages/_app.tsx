import PropTypes from "prop-types";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import React, { useEffect } from "react"
import Layout from "../components/layout/layout";
import { MenuContextProvider } from "../components/context/menuContext";
const MyApp: React.FC<{ Component; pageProps }> = ({
  Component = "",
  pageProps = "",
}) => {
  useEffect(() => {
    const appHeight = () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }
    window.addEventListener("resize", appHeight)
    appHeight()
    return () => {
      window.removeEventListener("resize", appHeight)
    }
  }, [])

  return (
    <MenuContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MenuContextProvider>
  )
};

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};
MyApp.defaultProps = {
  Component: "",
  pageProps: "",
};

export default MyApp;
