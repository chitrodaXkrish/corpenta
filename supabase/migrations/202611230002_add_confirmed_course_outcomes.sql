-- Add only the course taglines and learning outcomes supplied by the academy.
update public.courses
set short_description = case slug
  when 'money-code' then 'Build Your Financial Foundation.'
  when 'money-mindset' then 'Master Your Mind.'
  when 'capital-shield' then 'Protect Today. Grow Tomorrow.'
  when 'corpenta-wealth-architect' then 'Design Your Wealth Future.'
  when 'nism-certify' then 'Get Certified. Get Ahead.'
  when 'corpenta-funded' then 'Learn. Qualify. Explore Funding.'
  when 'crypto-code' then 'Decode. Understand. Digital Assets.'
end,
full_description = case slug
  when 'money-code' then E'Build Your Financial Foundation.\n• Understand money, income and expenses\n• Learn budgeting, saving and banking basics\n• Explore inflation, compound interest and financial goals'
  when 'money-mindset' then E'Master Your Mind.\n• Understand the psychology and behaviour of money\n• Build positive financial habits and discipline\n• Improve emotional control and financial decision-making'
  when 'capital-shield' then E'Protect Today. Grow Tomorrow.\n• Understand financial risk and risk-versus-reward\n• Learn capital protection, position sizing and stop-loss concepts\n• Explore drawdown control and risk management'
  when 'corpenta-wealth-architect' then E'Design Your Wealth Future.\n• Understand personal finance, wealth planning and investment fundamentals\n• Explore stocks, forex, commodities and global financial markets\n• Learn institutional trading concepts, market structure and how liquidity works in markets\n• Develop market-analysis, portfolio-diversification and risk-management awareness'
  when 'nism-certify' then E'Get Certified. Get Ahead.\n• Learn Indian financial-market structure and regulatory fundamentals\n• Study securities and investment products relevant to the selected module\n• Prepare with syllabus-based revision, practice questions and mock tests'
  when 'corpenta-funded' then E'Learn. Qualify. Explore Funding.\n• Understand trading fundamentals, price action and technical analysis\n• Develop trading strategies, execution plans and trading discipline\n• Learn risk management, drawdown control and trading psychology\n• Understand proprietary trading evaluation models and practise through simulations'
  when 'crypto-code' then E'Decode. Understand. Digital Assets.\n• Understand Bitcoin, Ethereum and blockchain fundamentals\n• Explore wallets, exchanges, tokens and DeFi basics\n• Learn crypto-market awareness, security and digital-asset risks'
end,
updated_at = now()
where slug in ('money-code','money-mindset','capital-shield','corpenta-wealth-architect','nism-certify','corpenta-funded','crypto-code');
