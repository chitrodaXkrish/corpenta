import {createPageMetadata} from "@/lib/seo";
import {getPublicScenarios} from "@/lib/public-content";

export async function generateMetadata(){
  const scenarios=await getPublicScenarios();
  return createPageMetadata({
    title:"Forex Market Scenarios for Study and Discussion",
    description:"Read published educational forex market scenarios from Corpenta Global, with commentary for study rather than trading signals or recommendations.",
    path:"/scenarios",
    index:scenarios.length>0,
  });
}

export default async function ScenariosPage(){
  const scenarios=await getPublicScenarios();
  return <main className="page-main wrap"><div className="page-heading"><span className="eyebrow">MARKET NOTES · EDUCATION FIRST</span><h1>Observe with<br/><em>perspective.</em></h1><p>Administrator-published scenarios for study and discussion. These notes are educational commentary, not live trading signals or recommendations.</p></div>{scenarios.length?<div className="simple-grid">{scenarios.map(s=><article className="simple-card" key={s.id}><span className="eyebrow">{new Date(s.published_at).toLocaleDateString("en",{dateStyle:"medium"})} · {(s.direction||"watching").toUpperCase()}</span><h2>{s.pair}</h2><p>{s.commentary||s.description||"Educational market scenario."}</p></article>)}</div>:<div className="locked-panel"><div><strong>No public market notes yet</strong><p>Educational scenarios will appear here when the academy publishes them for public viewing.</p></div></div>}<div className="notice-box">Forex and leveraged trading involve substantial financial risk. Nothing on this page is personalized financial advice or a recommendation to buy or sell.</div></main>;
}
