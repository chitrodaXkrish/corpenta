"use client";

import {useEffect,useState} from "react";

const mockPairs=[
  {pair:"EUR / USD",initial:1.0842,precision:4,change:0.18},
  {pair:"GBP / USD",initial:1.2716,precision:4,change:0.06},
  {pair:"USD / JPY",initial:148.28,precision:2,change:-0.11},
];

const ticks=[0.0001,-0.0002,0.0002,0,-0.0001,0.0001,-0.0001,0.0002];

export function MockForexFeed(){
  const [quotes,setQuotes]=useState(mockPairs.map(({initial,change})=>({price:initial,change})));

  useEffect(()=>{
    let tick=0;
    const timer=window.setInterval(()=>{
      const movement=ticks[tick%ticks.length];
      setQuotes(current=>current.map((quote,index)=>{
        const direction=index===1?-1:index===2?1:1;
        const delta=movement*direction*(index===2?100:1);
        return {price:quote.price+delta,change:quote.change+(movement*100*direction)};
      }));
      tick+=1;
    },1800);
    return()=>window.clearInterval(timer);
  },[]);

  return <div className="hero-demo-feed" role="group" aria-label="Illustrative simulated forex quotes, not live market data" aria-live="off">
    <div className="demo-feed-head"><span>MARKET OVERVIEW</span><b>SIMULATED · NOT LIVE DATA</b></div>
    {mockPairs.map(({pair,precision},index)=>{
      const quote=quotes[index];
      if(!quote)return null;
      const positive=quote.change>=0;
      const formattedPrice = quote.price.toFixed(precision);
      return <div className="demo-pair-row" key={pair}><span>{pair}</span><strong className="demo-quote-price" key={formattedPrice}>{formattedPrice}</strong><em className={positive?"":"demo-down"}>{positive?"+":"−"}{Math.abs(quote.change).toFixed(2)}%</em></div>;
    })}
  </div>;
}
