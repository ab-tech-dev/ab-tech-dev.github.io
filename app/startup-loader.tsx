'use client';

import { useEffect, useState } from 'react';

type StartupLoaderProps = {
  leaving: boolean;
};

export default function StartupLoader({ leaving }: StartupLoaderProps) {
  const [typedName, setTypedName] = useState('');

  useEffect(() => {
    const name = 'ab-tech-dev';
    const timers: number[] = [];
    let at = 64;

    // Keep the empty code brackets for the first painted frame, then begin.
    timers.push(
      window.setTimeout(() => setTypedName(name.slice(0, 1)), 0),
    );

    for (let length = 2; length <= name.length; length += 1) {
      timers.push(
        window.setTimeout(() => setTypedName(name.slice(0, length)), at),
      );
      at += 64;
    }

    at += 360;
    for (let length = name.length - 1; length >= 0; length -= 1) {
      timers.push(
        window.setTimeout(() => setTypedName(name.slice(0, length)), at),
      );
      at += 46;
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <output
      className="startup-loader"
      data-leaving={leaving}
      aria-live="polite"
      aria-label={leaving ? 'Experience ready' : 'Preparing the experience'}
    >
      <div className="loader-field" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="loader-orbit" aria-hidden="true">
        <i />
        <i />
      </div>
      <div className="loader-core" aria-hidden="true">
        <div className="loader-mark">
          <span className="loader-bracket">&lt;</span>
          <span className="loader-name">{typedName}</span>
          <span className="loader-bracket">/&gt;</span>
        </div>
        <div className="loader-status">
          <span>Creative system</span>
          <span className="loader-status-word">initialising</span>
        </div>
      </div>
      <div className="loader-progress" aria-hidden="true">
        <i />
      </div>
      <span className="loader-index" aria-hidden="true">
        AB—001 / READYING THE IMPOSSIBLE
      </span>
    </output>
  );
}
