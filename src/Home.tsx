import React from "react";
import logo from './logo.svg'
import prefs from './prefestures.json'
import './Home.scss'

type PrefecturesByName = {
  [key: string]: number;
}

type ActivePrefs = {
  [key: number]: boolean;
}

const Content = () => {
  const container = React.useRef<HTMLDivElement>(null)
  const [ activePrefs, setActivePrefs ] = React.useState<ActivePrefs>()

  React.useEffect(() => {
    const codes = {} as PrefecturesByName
    for (let i = 0; i < prefs.length; i++) {
      if (prefs[i].code && prefs[i].name) {
        codes[prefs[i].name] = prefs[i].code
      }
    }

    fetch('https://raw.githubusercontent.com/iemeshi/registry/master/apps.json')
    .then((res) => {
      return res.json()
    }).then((data) => {
      const _prefs = {} as ActivePrefs
      for (let i = 0; i < prefs.length; i++) {
        _prefs[prefs[i].code] = false
        for (let j = 0; j < data.length; j++) {
          const code = codes[data[j]['都道府県名']]
          if (prefs[i].code === code) {
            _prefs[prefs[i].code] = true
          }
        }
      }
      setActivePrefs(_prefs)
    })
  }, [])

  React.useEffect(() => {
    const svgMap = 'https://raw.githubusercontent.com/geolonia/japanese-prefectures/master/map-polygon.svg'
    fetch(svgMap).then((res) => {
      return res.text()
    }).then((svg) => {
      if (container.current) {
        const mapContainer = container.current.querySelector('.svg-map')
        if (mapContainer) {
          mapContainer.innerHTML = svg

          const prefs = document.querySelectorAll('.geolonia-svg-map .prefecture')
          prefs.forEach((pref) => {
            const _pref = pref as SVGElement
            if (_pref.dataset && _pref.dataset.code && activePrefs && activePrefs[Number(_pref.dataset.code)]) {
              _pref.classList.add('active')

              _pref.addEventListener('click', (event) => {
                // @ts-ignore
                event.currentTarget.style.fill = 'rgba(255, 0, 0, 0.4)'
                window.location.hash = `/${_pref.dataset.code}`
              })
            }
          })
        }

        const prefs = document.querySelectorAll('.text-prefs .pref button')
        prefs.forEach((pref) => {
          const _pref = pref as HTMLButtonElement
          if (_pref.dataset && _pref.dataset.code && activePrefs && activePrefs[Number(_pref.dataset.code)]) {
            pref.classList.add('active')
          }
        })
      }
    })
  }, [container, activePrefs])

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    window.location.hash = `/${event.currentTarget.dataset.code}`
  }

  return (
    <div ref={container} className="home">
      <div className="map-container">
        <div className="branding">
          <h1 className="iemeshi"><img src={logo} alt=""/>イエメシ</h1>
        </div>
        <div className="svg-map"></div>
      </div>
      <div className="text-prefs">
        {prefs.map((item) =>
          <div key={item.code} className="pref"><button data-code={item.code} onClick={clickHandler}>{item.name}</button></div>
        )}
      </div>
    </div>
  );
}

export default Content;
