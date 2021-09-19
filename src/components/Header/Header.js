import Container from '@components/Container'
import { FaShoppingCart } from 'react-icons/fa'
import Image from 'next/image'

import styles from './Header.module.scss'
import { useSnipcart } from '@hooks/use-snipcart'
import Link from 'next/link'

const Header = () => {
  const { cart = {} } = useSnipcart()
  const { subtotal } = cart
  return (
    <>
      <header className={styles.header}>
        <Container className={styles.headerContainer}>
          <Link href='/'>
            <a>
              <p className={styles.headerTitle}>P&eacute;rir Photography</p>
            </a>
          </Link>
          <p className={styles.headerCart}>
            <button className='snipcart-checkout'>
              <FaShoppingCart />
              <span>${subtotal ? subtotal : '0.00'}</span>
            </button>
          </p>
        </Container>
      </header>
      <div className={styles.bgImage}>
        <Image src='/bgImage.jpg' width='2000' height='600' />
      </div>
    </>
  )
}

export default Header
