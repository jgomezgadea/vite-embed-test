const EmbedIframe = () => {
  return (
    <iframe
      src="http://localhost:8002/free_dashboard"
      title="Dash App"
      style={{ width: '100%', height: '500px', border: 'none' }}
    ></iframe>
  );
}

export default EmbedIframe;
