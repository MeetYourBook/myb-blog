'use client';
import { useEffect, useRef } from 'react';

export default function Comment() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptEl = document.createElement('script');
    scriptEl.src = 'https://giscus.app/client.js';
    scriptEl.async = true;
    scriptEl.crossOrigin = 'anonymous';
    scriptEl.setAttribute('data-repo', 'MeetYourBook/myb-blog');
    scriptEl.setAttribute('data-repo-id', 'R_kgDOMnQVsw');
    scriptEl.setAttribute('data-category', 'General');
    scriptEl.setAttribute('data-category-id', 'DIC_kwDOMnQVs84Ch30I');
    scriptEl.setAttribute('data-mapping', 'pathname');
    scriptEl.setAttribute('data-strict', '0');
    scriptEl.setAttribute('data-reactions-enabled', '1');
    scriptEl.setAttribute('data-emit-metadata', '0');
    scriptEl.setAttribute('data-input-position', 'bottom');
    scriptEl.setAttribute('data-theme', 'light');
    scriptEl.setAttribute('data-lang', 'ko');
    scriptEl.setAttribute('crossorigin', 'anonymous');

    ref.current.appendChild(scriptEl);
  }, []);

  return <section ref={ref} />;
}
