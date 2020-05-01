import React, { useState } from "react";
import { useParams } from "react-router-dom";
import prefs from './prefestures.json'
import logo from './logo.svg'

import './Pref.scss'

type PrefecturesByCode = {
  [key: number]: string;
}

type App = {
  CNAME: string;
  GitHub: string;
  "サブドメイン": string;
  "地域名": string;
  "都道府県名": string;
}

const Content = () => {
  const { code } = useParams()
  const [ pref, setPref ] = useState<string>('')
  const [ apps, setApps ] = useState<App[]>([])

  React.useEffect(() => {
    if (!pref) {
      return
    }

    fetch('https://raw.githubusercontent.com/iemeshi/registry/master/apps.json')
    .then((res) => {
      return res.json()
    }).then((data) => {
      const _apps = []
      for (let i = 0; i < data.length; i++) {
        if (pref && pref === data[i]['都道府県名']) {
          _apps.push(data[i])
        }
      }
      setApps(_apps)
    })
  }, [pref])

  React.useEffect(() => {
    for (let i = 0; i < prefs.length; i++) {
      if (prefs[i].code && prefs[i].name && code && Number(code) === prefs[i].code) {
        setPref(prefs[i].name)
        break
      }
    }
  }, [code])

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.dataset.link) {
      window.location.href = event.currentTarget.dataset.link
    }
  }


  const items = []
  for (let i = 0; i < apps.length; i++) {
    const app = apps[i]

    // Following condition should be removed when problem is solved on netlify.
    if (app['GitHub'].match(/^https:\/\/github\.com\/iemeshi\//)) {
      items.push(<div key={i} className="pref"><button className="link" data-link={`https://${app['サブドメイン']}.iemeshi.jp/`} onClick={clickHandler}>{app['地域名']}</button></div>)
    } else {
      items.push(<div key={i} className="pref"><button className="link" data-link={`https://${app['CNAME']}/`} onClick={clickHandler}>{app['地域名']}</button></div>)
    }
  }

  return (
    <div className="pref">
      <div className="branding">
        <h1 className="iemeshi"><img src={logo} alt=""/>イエメシ</h1>
      </div>
      <h2>{pref}</h2>
      <div className="nav">
        {items}
      </div>

      <div className="go-back"><a href="#/">戻る</a></div>
    </div>
  );
}

export default Content;
