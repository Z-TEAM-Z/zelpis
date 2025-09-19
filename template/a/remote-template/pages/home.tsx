import { useState } from 'react';
import { Link } from 'react-router';
import { getComp } from '../component-register';
import { useRenderContext } from '../context';
import styles from './home.module.css';

export function Home() {
  const [count, setCount] = useState(0);

  const renderContext = useRenderContext();
  const Button = getComp('SchemaButton') || 'button';

  console.debug('renderContext', renderContext);

  return (
    <main>
      <div className={styles.title}>hello world</div>
      <div>
        <a href="/b/vue">goto /b</a>
        <Link to="/blog">goto /blog</Link>
      </div>
      <Button onClick={() => setCount(count + 1)}>count is {count}</Button>
    </main>
  );
}
