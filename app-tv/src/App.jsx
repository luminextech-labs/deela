import React, { useState } from 'react'
import Hls from 'hls.js'

const CHANNELS = [
  {
    id: 1,
    name: 'Thai PBS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Thai_PBS.svg/512px-Thai_PBS.svg.png',
    url: 'https://thaipbs-live.cdn.byteark.com/live/playlist.m3u8',
    description: 'สถานีโทรทัศน์สาธารณะของไทย',
  },
  {
    id: 2,
    name: '13 Siam Thai',
    logo: 'https://i.imgur.com/FvEp1S2.png',
    url: 'https://live.x2.co.th/live/13livetv-th.m3u8',
    description: 'ข่าว 24 ชั่วโมง',
  },
  {
    id: 3,
    name: 'DLTV 1',
    logo: 'https://i.imgur.com/nLzdGeX.png',
    url: 'https://cdn-live.dltv.ac.th/dltv01.m3u8',
    description: 'การศึกษา ระดับประถม',
  },
  {
    id: 4,
    name: 'DLTV 3',
    logo: 'https://i.imgur.com/wmrxerm.png',
    url: 'https://cdn-live.dltv.ac.th/dltv03.m3u8',
    description: 'การศึกษา ระดับมัธยม',
  },
  {
    id: 5,
    name: 'Cool Channel',
    logo: 'https://i.imgur.com/MU4E0A7.png',
    url: 'https://live-iptv.cool-channel.com/cool/live-720P.m3u8',
    description: 'บันเทิง ข่าว',
  },
]

function App() {
  const [selected, setSelected] = useState(CHANNELS[0])
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(null)
  const videoRef = React.useRef(null)

  const playChannel = (ch) => {
    setSelected(ch)
    setPlaying(false)
    setError(null)
  }

  React.useEffect(() => {
    if (!selected || !videoRef.current) return
    const video = videoRef.current
    const url = selected.url

    if (url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(url)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => setPlaying(true))
        })
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setError('ไม่สามารถเล่นได้')
        })
        return () => hls.destroy()
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url
        video.play().catch(() => setPlaying(true))
      }
    } else {
      video.src = url
    }
  }, [selected])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, position: 'relative' }}>
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          controls
          autoPlay
        />
        {!playing && !error && (
          <div style={{ position: 'absolute', color: '#666', fontSize: 16 }}>
            กด Play เพื่อเล่น
          </div>
        )}
        {error && (
          <div style={{ color: '#e53935', fontSize: 16 }}>{error}</div>
        )}
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>{selected?.name}</div>
          <div style={{ color: '#888', fontSize: 13 }}>{selected?.description}</div>
        </div>

        <h3 style={{ marginBottom: 12, fontSize: 16 }}>📺 ช่องทีวี ({CHANNELS.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {CHANNELS.map((ch) => (
            <div key={ch.id} onClick={() => playChannel(ch)} style={{
              background: selected?.id === ch.id ? '#1a3a1a' : '#1a1a1a',
              borderRadius: 10, padding: 16, cursor: 'pointer', textAlign: 'center',
              border: selected?.id === ch.id ? '2px solid #4CAF50' : '2px solid transparent',
            }}>
              <img src={ch.logo} alt={ch.name} style={{ width: 60, height: 60, borderRadius: 8, marginBottom: 8, objectFit: 'contain', background: '#fff' }} />
              <div style={{ fontSize: 14, fontWeight: 'bold' }}>{ch.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App