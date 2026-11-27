"use client";

import {useEffect,useRef} from "react";
import { marketTickerSymbols } from "@/lib/market-ticker";

export function PublicMarketTicker(){
  const containerRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const container=containerRef.current;
    if(!container)return;
    container.innerHTML="";
    const widget=document.createElement("div");
    widget.className="tradingview-widget-container__widget";
    widget.style.width="100%";
    widget.style.height="100%";
    const script=document.createElement("script");
    script.type="text/javascript";
    script.src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async=true;
    script.text=JSON.stringify({symbols:marketTickerSymbols,showSymbolLogo:true,colorTheme:"dark",isTransparent:true,displayMode:"adaptive",locale:"en",largeChartUrl:""});
    container.append(widget,script);
    return()=>{container.replaceChildren()};
  },[]);

  return <section className="public-market-ticker" aria-label="Public market quotes">
    <div className="public-market-ticker-inner">
      <div className="public-market-ticker-heading"><span>MARKET SNAPSHOT</span><span>PUBLIC DATA · MAY BE DELAYED</span></div>
      <div className="tradingview-widget-container" ref={containerRef} aria-label="EUR/USD, GBP/USD, USD/JPY, gold and crude oil quotes"/>
      <p className="public-market-ticker-note">Market data provided by TradingView. Quotes may be delayed; shown for educational context only.</p>
    </div>
  </section>;
}
