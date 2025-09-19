import type React from 'react';
import styles from './button.module.css';

export function Button(props: React.PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>) {
  const { children, className = '', ...rest } = props;

  return (
    <button className={`${styles.button} ${className}`} type="button" {...rest}>
      custom button {children}
    </button>
  );
}
