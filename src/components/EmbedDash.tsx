import {useEffect, useId, useRef} from "react";

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
  if (container.childNodes.length > 0) {
    console.warn(`Container with id ${containerId} already has content. Skipping load.`);
    return;
  }

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
    try {
      await loadScript(script, container)
    } catch (error) {
      console.error(`Failed to load script: ${script.src || 'inline script'}`, error);
    }
  }
}

const EmbedDash = () => {
  const containerId = useId()
  const executed = useRef<boolean>(false)

  useEffect(() => {
  if (executed.current) return; // Prevent re-execution
    void loadSPAFragment('/free_dashboard', containerId)
    executed.current = true;
  }, [containerId])

  return <div id={containerId} style={{ width: '100%', height: '500px', border: 'none' }} />
}

export default EmbedDash
