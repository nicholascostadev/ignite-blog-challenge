import Link from 'next/link';
import Image from 'next/image';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              <Image src="/images/logo.svg" alt="logo" width={240} height={25} />
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
