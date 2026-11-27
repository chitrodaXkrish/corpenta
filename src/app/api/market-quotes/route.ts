import { NextResponse } from "next/server";
import { marketTickerSymbols } from "@/lib/market-ticker";

type ScannerRow = { s: string; d: [string, number, number] };
type Quote = { symbol: string; name: string; price: number; change: number };
let cachedQuotes: { quotes: Quote[]; updatedAt: string; expiresAt: number } | null = null;
let inFlight: Promise<Quote[]> | null = null;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const now = Date.now();
    if (cachedQuotes && cachedQuotes.expiresAt > now) {
      return NextResponse.json({ quotes: cachedQuotes.quotes, updatedAt: cachedQuotes.updatedAt, source: "TradingView", cached: true }, { headers: { "Cache-Control": "public, max-age=10, s-maxage=15, stale-while-revalidate=45" } });
    }

    const loadQuotes = async () => {
      const response = await fetch("https://scanner.tradingview.com/forex/scan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        symbols: { tickers: marketTickerSymbols.map(({ proName }) => proName), query: { types: [] } },
        columns: ["name", "close", "change"],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) throw new Error(`TradingView returned ${response.status}`);

      const payload = await response.json() as { data?: ScannerRow[] };
      const labels = new Map(marketTickerSymbols.map(({ proName, title }) => [proName, title]));
      const quotes = (payload.data ?? []).flatMap(({ s, d }) => {
        const [name, price, change] = d;
        const symbol = labels.get(s);
        return symbol && Number.isFinite(price) && Number.isFinite(change)
          ? [{ symbol, name, price, change }]
          : [];
      });
      if (!quotes.length) throw new Error("TradingView returned no usable forex quotes");
      return quotes;
    };

    inFlight ??= loadQuotes().finally(() => { inFlight = null; });
    const quotes = await inFlight;
    const updatedAt = new Date().toISOString();
    cachedQuotes = { quotes, updatedAt, expiresAt: now + 15_000 };
    return NextResponse.json({ quotes, updatedAt, source: "TradingView" }, { headers: { "Cache-Control": "public, max-age=10, s-maxage=15, stale-while-revalidate=45" } });
  } catch {
    if (cachedQuotes) return NextResponse.json({ quotes: cachedQuotes.quotes, updatedAt: cachedQuotes.updatedAt, source: "TradingView", stale: true }, { headers: { "Cache-Control": "public, max-age=5, s-maxage=5" } });
    return NextResponse.json({ quotes: [], updatedAt: null, source: "TradingView", unavailable: true }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
