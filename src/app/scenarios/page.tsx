import {createPageMetadata} from "@/lib/seo";
import {getPublicScenarios} from "@/lib/public-content";

export async function generateMetadata(){
  const scenarios=await getPublicScenarios();
  return createPageMetadata({
    title:"Currency Market Scenarios for Study and Discussion",
    description:"Read published educational currency market scenarios from Corpenta Global, with commentary for study rather than trading signals or recommendations.",
    path:"/scenarios",
    index:scenarios.length>0,
  });
}

function MarketLine(){return <><span className="eyebrow market-note-chart-label">ILLUSTRATIVE · NOT LIVE DATA</span><svg className="market-note-line" viewBox="0 0 360 112" aria-hidden="true" focusable="false"><path d="M0 86h360M0 54h360M0 22h360"/><path className="market-note-plot" d="M4 79 34 74 55 80 78 58 101 64 122 46 146 52 166 35 187 43 209 26 229 34 252 17 275 28 295 13 319 20 340 8 356 11"/><circle cx="252" cy="17" r="3"/></svg></>}

export default async function ScenariosPage(){
  const scenarios=await getPublicScenarios();
  return <main className="page-main wrap market-notes-page" data-market-scene="research"><div className="page-heading"><span className="eyebrow">MARKET NOTES · EDUCATION FIRST</span><h1>Observe with<br/><em>perspective.</em></h1><p>Administrator-published scenarios for study and discussion. These notes are educational commentary, not live trading signals or recommendations.</p></div>{scenarios.length?<div className="market-note-list">{scenarios.map((s,index)=><article className="market-note-entry" data-market-scene={index % 2 ? "pairs" : "candles"} key={s.id}><div className="market-note-index">{String(index+1).padStart(2,"0")}</div><div className="market-note-copy"><span className="eyebrow">{new Date(s.published_at).toLocaleDateString("en",{dateStyle:"medium"})} · {(s.direction||"watching").toUpperCase()}</span><h2>{s.pair}</h2><p>{s.commentary||s.description||"Educational market scenario."}</p></div><div className="market-note-visual"><MarketLine/></div></article>)}</div>:<div className="locked-panel"><div><strong>No public market notes yet</strong><p>Educational scenarios will appear here when the academy publishes them for public viewing.</p></div></div>}<div className="notice-box">Currency and leveraged trading involve substantial financial risk. Nothing on this page is personalized financial advice or a recommendation to buy or sell.</div></main>;
}
