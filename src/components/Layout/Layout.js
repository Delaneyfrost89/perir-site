import Head from 'next/head'
import Image from 'next/image'
import Header from '@components/Header'
import Footer from '@components/Footer'
import styles from './Layout.module.scss'

const Layout = ({ children, className, ...rest }) => {
  let layoutClassName = styles.layout
  if (className) {
    layoutClassName = `${layoutClassName} ${className}`
  }
  return (
    <div className={layoutClassName} {...rest}>
      <Head>
        <title>P&eacute;rir Photography</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
export default Layout
