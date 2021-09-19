import styles from './Footer.module.scss'
import Image from 'next/image'

const Footer = () => {
  return (
    <>
      <div className={styles.bgImage}>
        <Image
          src='/bgBottom.jpg'
          alt='background image of lilly pads in a pond.'
          width='2000'
          height='600'
        />
      </div>
      <footer className={styles.footer}>
        &copy; P&eacute;rir Photography, {new Date().getFullYear()}
      </footer>
    </>
  )
}

export default Footer
