export type CourseCatalogEntry={
  id:string;
  slug:string;
  title:string;
  duration:string;
  price:number;
  tagline:string;
  outcomes:string[];
};

export const courseCatalog:CourseCatalogEntry[]=[
  {id:"00000000-0000-4000-8000-000000000001",slug:"money-code",title:"MONEY CODE",duration:"2 Weeks",price:999,tagline:"Build Your Financial Foundation.",outcomes:["Understand money, income and expenses","Learn budgeting, saving and banking basics","Explore inflation, compound interest and financial goals"]},
  {id:"00000000-0000-4000-8000-000000000002",slug:"money-mindset",title:"MONEY MINDSET",duration:"2 Weeks",price:4999,tagline:"Master Your Mind.",outcomes:["Understand the psychology and behaviour of money","Build positive financial habits and discipline","Improve emotional control and financial decision-making"]},
  {id:"00000000-0000-4000-8000-000000000003",slug:"capital-shield",title:"CAPITAL SHIELD",duration:"2 Weeks",price:7999,tagline:"Protect Today. Grow Tomorrow.",outcomes:["Understand financial risk and risk-versus-reward","Learn capital protection, position sizing and stop-loss concepts","Explore drawdown control and risk management"]},
  {id:"00000000-0000-4000-8000-000000000004",slug:"corpenta-wealth-architect",title:"CORPENTA WEALTH ARCHITECT",duration:"10 Weeks",price:24999,tagline:"Design Your Wealth Future.",outcomes:["Understand personal finance, wealth planning and investment fundamentals","Explore stocks, forex, commodities and global financial markets","Learn institutional trading concepts, market structure and liquidity","Develop market-analysis, portfolio-diversification and risk-management awareness"]},
  {id:"00000000-0000-4000-8000-000000000005",slug:"nism-certify",title:"NISM CERTIFY",duration:"4 Weeks",price:19999,tagline:"Get Certified. Get Ahead.",outcomes:["Learn Indian financial-market structure and regulatory fundamentals","Study securities and investment products relevant to the selected module","Prepare with syllabus-based revision, practice questions and mock tests"]},
  {id:"00000000-0000-4000-8000-000000000006",slug:"corpenta-funded",title:"CORPENTA FUNDED",duration:"8 Weeks",price:34999,tagline:"Learn. Qualify. Explore Funding.",outcomes:["Understand trading fundamentals, price action and technical analysis","Develop trading strategies, execution plans and trading discipline","Learn risk management, drawdown control and trading psychology","Understand proprietary trading evaluation models and practise through simulations"]},
  {id:"00000000-0000-4000-8000-000000000007",slug:"crypto-code",title:"CRYPTO CODE",duration:"4 Weeks",price:9999,tagline:"Decode. Understand. Digital Assets.",outcomes:["Understand Bitcoin, Ethereum and blockchain fundamentals","Explore wallets, exchanges, tokens and DeFi basics","Learn crypto-market awareness, security and digital-asset risks"]},
];
