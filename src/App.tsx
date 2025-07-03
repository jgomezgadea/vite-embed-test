import {type ChangeEvent, useEffect, useState} from 'react'
import EmbedIframe from './components/EmbedIframe'
import EmbedDash from './components/EmbedDash'
import './App.css'

type EmbedType = 'iframe' | 'dash'

function getEmbedTypeFromURL(): EmbedType {
  const params = new URLSearchParams(window.location.search)
  return (params.get('embedType') as EmbedType) || 'iframe'
}

function App() {
  const [embedType, setEmbedType] = useState<EmbedType>(getEmbedTypeFromURL())

  useEffect(() => {
    // Update state if URL changes (e.g., on reload)
    setEmbedType(getEmbedTypeFromURL())
  }, [])

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as EmbedType
    const params = new URLSearchParams(window.location.search)
    params.set('embedType', type)
    window.location.search = params.toString() // Triggers reload with new param
  }

  return (
    <>
      <div style={{ margin: '20px 0' }}>
        <label>
          Select embed type:&nbsp;
          <select
            value={embedType}
            onChange={handleChange}
          >
            <option value="iframe">EmbedIframe</option>
            <option value="dash">EmbedDash</option>
          </select>
        </label>
      </div>
      {embedType === 'iframe' ? <EmbedIframe /> : <EmbedDash />}
    </>
  )
}

export default App
