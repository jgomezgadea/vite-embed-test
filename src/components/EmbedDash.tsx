import {useEffect, useId} from "react";

/** Helper to load scripts sequentially */
const loadScript = (script: HTMLScriptElement, container: HTMLElement) => {
  return new Promise<void>((resolve, reject) => {
    const newScript = document.createElement('script');
    Array.from(script.attributes).forEach(attr =>
      newScript.setAttribute(attr.name, attr.value)
    );
    if (script.src) {
      newScript.onload = () => resolve();
      newScript.onerror = () => reject();
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
      resolve();
    }
    container.appendChild(newScript);
  });
};

const loadSPAFragment = async (url: string, containerId: string) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id ${containerId} not found.`);
    return;
  }
  container.innerHTML = '';

  const res = await fetch(url);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Append non-script nodes to the container
  [...Array.from(doc.head.childNodes), ...Array.from(doc.body.childNodes)].forEach(node => {
    if (!(node instanceof HTMLScriptElement)) {
      container.appendChild(node.cloneNode(true));
    }
  });

  // Append and execute scripts in order
  for (const script of Array.from(doc.scripts)) {
    await loadScript(script, container)
  }
}

const EmbedDash = () => {
  const containerId = useId()

  useEffect(() => {
    void loadSPAFragment('/dash', containerId)
  }, [containerId])

  return <div id={containerId} style={{ width: '100%', height: '500px', border: 'none' }} />
}

export default EmbedDash
