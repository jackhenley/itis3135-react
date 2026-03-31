import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './WallStreetGame.css';

export default function WallStreetGame() {
  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const tickerInnerRef = useRef(null);

  useEffect(() => {
    document.title = 'Jack Henley | Wall Street Game';
  }, []);

  useEffect(() => {
    const out = outputRef.current;
    const inp = inputRef.current;
    if (!out || !inp) return;

    // ─── Colour helpers ──────────────────────────────────────────────────────
    const H = {
      cyan:    s => `<span class="c-cyan">${s}</span>`,
      green:   s => `<span class="c-green">${s}</span>`,
      red:     s => `<span class="c-red">${s}</span>`,
      yellow:  s => `<span class="c-yellow">${s}</span>`,
      dim:     s => `<span class="c-dim">${s}</span>`,
      white:   s => `<span class="c-white bold">${s}</span>`,
      magenta: s => `<span class="c-magenta">${s}</span>`,
      bold:    s => `<span class="bold">${s}</span>`,
    };

    function money(v) {
      const s = (v >= 0 ? '+' : '') + '$' + Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
      return v >= 0 ? H.green(s) : H.red(s);
    }
    function price(v) {
      return H.white('$' + v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
    }
    function pct(v) {
      const s = (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
      return v >= 0 ? H.green(s) : H.red(s);
    }
    function bar(ratio, width=18) {
      ratio = Math.max(0, Math.min(1, ratio));
      const filled = Math.round(ratio * width);
      const f = H.green('█'.repeat(filled));
      const e = H.dim('░'.repeat(width - filled));
      return f + e;
    }
    function sparkline(history, width=12) {
      const data = history.slice(-width);
      if (data.length < 2) return H.dim('─'.repeat(width));
      const lo = Math.min(...data), hi = Math.max(...data);
      const span = hi - lo || 1;
      const bars = '▁▂▃▄▅▆▇█';
      return data.map(v => {
        const idx = Math.min(7, Math.floor((v - lo) / span * 8));
        const ch = bars[idx];
        return v >= data[0] ? H.green(ch) : H.red(ch);
      }).join('');
    }
    function pad(s, n) {
      const plain = s.replace(/<[^>]*>/g,'');
      const spaces = Math.max(0, n - plain.length);
      return s + ' '.repeat(spaces);
    }
    function rpad(s, n) {
      const plain = s.replace(/<[^>]*>/g,'');
      const spaces = Math.max(0, n - plain.length);
      return ' '.repeat(spaces) + s;
    }

    // ─── Stock model ─────────────────────────────────────────────────────────
    class Stock {
      constructor(ticker, name, sector, p, baseVol) {
        this.ticker = ticker; this.name = name; this.sector = sector;
        this.price = p; this.baseVol = baseVol;
        this.trend = 0; this.history = [p]; this.newsCd = 0;
      }
      get prevPrice() { return this.history.length >= 2 ? this.history[this.history.length-2] : this.history[0]; }
      get change()    { return this.price - this.prevPrice; }
      get changePct() { return this.prevPrice ? (this.change / this.prevPrice) * 100 : 0; }
      get weekChangePct() { return this.history[0] ? ((this.price - this.history[0]) / this.history[0]) * 100 : 0; }
      tick(mood) {
        const vol   = this.baseVol * (0.5 + Math.random());
        const drift = this.trend + mood * 0.3;
        const u1 = Math.random(), u2 = Math.random();
        let shock = Math.sqrt(-2*Math.log(u1)) * Math.cos(2*Math.PI*u2) * vol + drift;
        if (Math.random() < 0.01) shock *= (3 + Math.random()*3) * (Math.random()<0.5?1:-1);
        this.price = Math.max(0.01, this.price * (1 + shock));
        this.price = Math.round(this.price * 100) / 100;
        this.history.push(this.price);
        this.trend *= 0.85;
        if (this.newsCd > 0) this.newsCd--;
      }
    }

    const STOCKS_DEF = [
      ['AAPL','Apple Inc.',       'Tech',    182.50, 0.018],
      ['TSLA','Tesla Inc.',       'Auto/EV', 250.00, 0.038],
      ['NVDA','NVIDIA Corp.',     'Chips',   875.00, 0.030],
      ['AMZN','Amazon.com Inc.',  'Retail',  195.00, 0.022],
      ['JPM', 'JPMorgan Chase',   'Finance', 205.00, 0.016],
      ['XOM', 'ExxonMobil Corp.', 'Energy',  120.00, 0.020],
      ['GME', 'GameStop Corp.',   'Meme',     18.00, 0.075],
      ['BTC', 'Bitcoin ETF',      'Crypto',  680.00, 0.055],
    ];

    const NEWS_POOL = [
      ['Fed signals surprise rate cut',         null,   0.01, 0.03, 2],
      ['Fed raises rates 50 bps unexpectedly',  null,  -0.03,-0.01, 2],
      ['Recession fears spike after jobs data', null,  -0.04,-0.02, 3],
      ['Market euphoria: Dow hits record high', null,   0.02, 0.04, 2],
      ['AI chip shortage reported',            'NVDA',-0.06,-0.02, 2],
      ['NVDA beats earnings by 40%',           'NVDA', 0.04, 0.09, 2],
      ['Tesla recalls 200k vehicles',          'TSLA',-0.07,-0.03, 2],
      ["Elon tweets 'To the moon 🚀'",          'TSLA', 0.05, 0.10, 1],
      ['Amazon acquires major retailer',       'AMZN', 0.03, 0.06, 2],
      ['Apple Vision Pro sells out globally',  'AAPL', 0.02, 0.05, 2],
      ['Apple supply-chain disruption',        'AAPL',-0.04,-0.02, 2],
      ['Oil prices surge on OPEC cuts',        'XOM',  0.04, 0.08, 3],
      ['Oil demand slumps, glut forms',        'XOM', -0.05,-0.02, 2],
      ['JPMorgan posts record profits',        'JPM',  0.02, 0.04, 1],
      ['Banking sector faces new stress test', 'JPM', -0.03,-0.01, 2],
      ['Reddit WallStreetBets targets GME',    'GME',  0.10, 0.25, 1],
      ['GME short squeeze collapses',          'GME', -0.15,-0.08, 1],
      ['SEC investigates crypto ETFs',         'BTC', -0.08,-0.03, 2],
      ['Bitcoin ETF inflows hit record',       'BTC',  0.06, 0.12, 2],
      ['Global cyber-attack hits markets',      null, -0.05,-0.02, 1],
      ['Trade deal signed, markets rally',      null,  0.02, 0.05, 2],
    ];

    const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
    const TICKS_PER_DAY = 8;
    const STARTING_CASH = 10000;
    const TARGET_PROFIT = 3000;
    const TARGET_TOTAL  = STARTING_CASH + TARGET_PROFIT;

    class Game {
      constructor() {
        this.stocks   = Object.fromEntries(STOCKS_DEF.map(d => [d[0], new Stock(...d)]));
        this.cash     = STARTING_CASH;
        this.holdings = {};
        this.trades   = [];
        this.day      = 0;
        this.tick     = 0;
        this.mood     = 0;
        this.news     = [];
        this.phase    = 'intro';
        this.subTicker= null;
        this.subAction= null;
        this.running  = true;
      }
      totalValue() {
        return this.cash + Object.entries(this.holdings).reduce((s,[t,sh]) => s + sh * this.stocks[t].price, 0);
      }
      netProfit() { return this.totalValue() - STARTING_CASH; }
      dayName()   { return DAYS[this.day] || 'Friday'; }
      timeStr()   {
        const h = 9 + this.tick;
        const suffix = h < 12 ? 'AM' : 'PM';
        const d = h <= 12 ? h : h - 12;
        return `${d}:00 ${suffix}`;
      }
      progressPct() {
        return (this.day * TICKS_PER_DAY + this.tick) / (DAYS.length * TICKS_PER_DAY);
      }
      advanceTick() {
        if (Math.random() < 0.15) this.mood = (Math.random()-0.5) * 0.016;
        else this.mood *= 0.9;
        for (const s of Object.values(this.stocks)) { s.tick(this.mood); }
        if (Math.random() < 0.20) this._fireNews();
        this.tick++;
        if (this.tick >= TICKS_PER_DAY) {
          this.tick = 0; this.day++;
          if (this.day >= DAYS.length) { this.running = false; this.phase = 'end'; }
        }
      }
      _fireNews() {
        const ev = NEWS_POOL[Math.floor(Math.random()*NEWS_POOL.length)];
        const [headline, target, lo, hi, dur] = ev;
        const impact = lo + Math.random() * (hi - lo);
        const positive = impact > 0;
        for (const s of Object.values(this.stocks)) {
          if (!target || s.ticker === target) { s.trend += impact / Math.max(dur,1); s.newsCd = dur; }
        }
        this.news = [{text: headline, positive}, ...this.news].slice(0, 5);
      }
      buy(ticker, shares) {
        const s = this.stocks[ticker];
        const cost = shares * s.price;
        if (cost > this.cash + 0.005) return {ok:false, msg:`Insufficient funds. Need ${price(cost)}, have ${price(this.cash)}.`};
        this.cash -= cost;
        this.holdings[ticker] = (this.holdings[ticker] || 0) + shares;
        this.trades.push({action:'BUY', ticker, shares, at: s.price});
        return {ok:true, msg:`Bought ${shares.toFixed(4)} ${H.cyan(ticker)} @ ${price(s.price)}`};
      }
      sell(ticker, shares) {
        const owned = this.holdings[ticker] || 0;
        if (shares > owned + 0.0001) return {ok:false, msg:`You only own ${owned.toFixed(4)} shares.`};
        const s = this.stocks[ticker];
        this.cash += shares * s.price;
        this.holdings[ticker] = Math.max(0, owned - shares);
        if (this.holdings[ticker] < 0.0001) delete this.holdings[ticker];
        this.trades.push({action:'SELL', ticker, shares, at: s.price});
        return {ok:true, msg:`Sold ${shares.toFixed(4)} ${H.cyan(ticker)} @ ${price(s.price)}`};
      }
    }

    // ─── Output helpers ───────────────────────────────────────────────────────
    function println(html='', animate=true) {
      const el = document.createElement('div');
      el.className = 'line' + (animate ? ' line-anim' : '');
      el.innerHTML = html;
      out.appendChild(el);
      out.scrollTop = out.scrollHeight;
      return el;
    }
    function printLines(lines, animate=false) {
      lines.forEach(l => println(l, animate));
    }
    function rule(char='─', colour='cyan') {
      return H[colour](char.repeat(80));
    }

    let game;

    function renderBoard() {
      out.innerHTML = '';
      const g = game;
      const total  = g.totalValue();
      const profit = g.netProfit();
      const tRatio = Math.max(0, Math.min(1, profit > 0 ? profit / TARGET_PROFIT : 0));

      printLines([
        H.cyan('╔' + '═'.repeat(78) + '╗'),
        H.cyan('║') + H.bold('           📈  WALL STREET WEEK  —  CLI Trading Simulation              ') + H.cyan('║'),
        H.cyan('╠' + '═'.repeat(78) + '╣'),
        H.cyan('║') + `  ${H.yellow(H.bold(g.dayName()))}  ${H.dim(g.timeStr())}   Day ${g.day+1}/${DAYS.length}  [${bar(g.progressPct(), 16)}]                  ` + H.cyan('║'),
        H.cyan('║') + `  Portfolio: ${price(total)}   Net: ${money(profit)}   Target: ${price(TARGET_TOTAL)}               ` + H.cyan('║'),
        H.cyan('║') + `  Goal:  [${bar(tRatio, 22)}] ${H.yellow(Math.round(tRatio*100)+'%')}                                    ` + H.cyan('║'),
        H.cyan('╠' + '═'.repeat(78) + '╣'),
      ], false);

      println(H.cyan('║') + `  ${H.bold('TICKER')}  ${H.dim('PRICE')}         ${H.dim('CHG')}      ${H.dim('WEEK')}    ${H.dim('CHART')}           ${H.dim('OWN')}    ` + H.cyan('║'), false);
      println(H.cyan('╠' + '─'.repeat(78) + '╣'), false);

      for (const s of Object.values(g.stocks)) {
        const owned = g.holdings[s.ticker] || 0;
        const ownedStr = owned > 0 ? H.cyan(`${owned.toFixed(2)}sh`) : '      ';
        const chart = sparkline(s.history, 12);
        println(
          H.cyan('║') +
          `  ${H.bold(H.cyan(s.ticker.padEnd(5)))} ` +
          rpad(price(s.price), 18) + '  ' +
          rpad(pct(s.changePct), 14) +
          rpad(pct(s.weekChangePct), 12) + '  ' +
          chart + '  ' + ownedStr +
          '   ' + H.cyan('║'),
        false);
      }
      println(H.cyan('╠' + '═'.repeat(78) + '╣'), false);

      const holdKeys = Object.keys(g.holdings);
      println(H.cyan('║') + H.bold(`  YOUR HOLDINGS   Cash: ${price(g.cash)}`) + '                                    ' + H.cyan('║'), false);
      if (!holdKeys.length) {
        println(H.cyan('║') + H.dim('  (No open positions)') + '                                                         ' + H.cyan('║'), false);
      } else {
        for (const ticker of holdKeys) {
          const s = g.stocks[ticker]; const sh = g.holdings[ticker];
          const val = sh * s.price;
          const buys = g.trades.filter(t=>t.action==='BUY'&&t.ticker===ticker);
          let pnlStr = '';
          if (buys.length) {
            const avgCost = buys.reduce((a,t)=>a+t.shares*t.at,0) / buys.reduce((a,t)=>a+t.shares,0);
            pnlStr = '  ' + pct((s.price - avgCost)/avgCost*100);
          }
          println(H.cyan('║') + `  ${H.bold(H.cyan(ticker.padEnd(6)))} ${sh.toFixed(4)} sh  ${price(val)}${pnlStr}                              ` + H.cyan('║'), false);
        }
      }
      println(H.cyan('╠' + '═'.repeat(78) + '╣'), false);

      println(H.cyan('║') + H.bold('  LATEST NEWS') + '                                                                 ' + H.cyan('║'), false);
      if (!g.news.length) {
        println(H.cyan('║') + H.dim('  Markets quiet… for now.') + '                                                   ' + H.cyan('║'), false);
      } else {
        g.news.slice(0,3).forEach((n,i) => {
          const dot = i===0 ? (n.positive ? H.green('●') : H.red('●')) : H.dim('○');
          const text = i===0 ? (n.positive ? H.green(n.text) : H.red(n.text)) : H.dim(n.text);
          println(H.cyan('║') + `  ${dot} ${text}` + '                                                   '.slice(n.text.length % 20) + H.cyan('║'), false);
        });
      }
      println(H.cyan('╚' + '═'.repeat(78) + '╝'), false);

      println('', false);
      println(
        `  ${H.bold(H.yellow('Commands:'))}  ` +
        `${H.cyan('[b]')}uy   ${H.cyan('[s]')}ell   ` +
        `${H.cyan('[t]')}ick (1hr)   ` +
        `${H.cyan('[n]')}ext day   ` +
        `${H.cyan('[r]')}efresh   ` +
        `${H.cyan('[q]')}uit`,
      false);
    }

    function renderIntro() {
      out.innerHTML = '';
      printLines([
        '',
        H.cyan('  ╔══════════════════════════════════════════════════╗'),
        H.cyan('  ║') + H.bold('    📈  WALL STREET WEEK                         ') + H.cyan('║'),
        H.cyan('  ║') + H.dim('       A Self-Contained Browser Trading Sim      ') + H.cyan('║'),
        H.cyan('  ╚══════════════════════════════════════════════════╝'),
        '',
        `  You start with  ${price(STARTING_CASH)}.`,
        `  Goal:           reach ${price(TARGET_TOTAL)} by end of Friday.`,
        `  Net profit needed: ${money(TARGET_PROFIT)}.`,
        '',
        H.yellow(H.bold('  Tips:')),
        H.dim('  • Watch the news feed — it triggers stock-specific moves.'),
        H.dim('  • Prefix with $ to buy by dollar amount, e.g.  b TSLA $500'),
        H.dim('  • GME and BTC are high-risk, high-reward plays.'),
        H.dim('  • [t] or just Enter to advance one trading hour.'),
        H.dim('  • [n] skips to the next trading day.'),
        '',
        `  Type ${H.cyan(H.bold('start'))} to begin trading.`,
        '',
      ], false);
    }

    function renderEnd() {
      out.innerHTML = '';
      const g = game;
      const total  = g.totalValue();
      const profit = g.netProfit();
      const won    = total >= TARGET_TOTAL;
      printLines([
        '',
        won ? H.green('  ┌─────────────────────────────────────────────┐')
            : H.red  ('  ┌─────────────────────────────────────────────┐'),
        won ? H.green(H.bold('  │  🏆  CONGRATULATIONS — YOU HIT YOUR TARGET! │'))
            : H.red  (H.bold('  │  📉  MARKET CLOSED — TARGET MISSED           │')),
        won ? H.green('  └─────────────────────────────────────────────┘')
            : H.red  ('  └─────────────────────────────────────────────┘'),
        '',
        `  Starting capital : ${price(STARTING_CASH)}`,
        `  Final portfolio  : ${price(total)}`,
        `  Net profit/loss  : ${money(profit)}`,
        `  Target           : ${price(TARGET_TOTAL)}`,
        '',
        won ? H.green(`  You exceeded target by ${money(profit - TARGET_PROFIT)}!`)
            : H.red  (`  You fell short by ${price(TARGET_TOTAL - total)}. Better luck next week.`),
        '',
        `  Total trades: ${H.cyan(g.trades.length)}`,
        '',
        H.yellow(H.bold('  Final stock prices:')),
        ...Object.values(g.stocks).map(s =>
          `    ${H.bold(H.cyan(s.ticker.padEnd(6)))} ${price(s.price)}  week: ${pct(s.weekChangePct)}`
        ),
        '',
        `  Type ${H.cyan(H.bold('restart'))} to play again.`,
        '',
      ], false);
    }

    function updateTickerBar() {
      if (!game || !tickerInnerRef.current) return;
      const parts = Object.values(game.stocks).map(s => {
        const arrow = s.changePct >= 0 ? '▲' : '▼';
        const col   = s.changePct >= 0 ? '#00ff88' : '#ff3d5a';
        return `<span style="color:${col}">${s.ticker} $${s.price.toFixed(2)} ${arrow}${Math.abs(s.changePct).toFixed(2)}%</span>`;
      }).join('  \u00a0\u00a0  ');
      const doubled = parts + '  \u00a0\u00a0\u00a0\u00a0  ' + parts;
      tickerInnerRef.current.innerHTML = doubled;
    }

    function handleGameInput(raw) {
      const cmd = raw.toLowerCase();

      if (game.phase === 'intro') {
        if (cmd === 'start') { game.phase = 'play'; renderBoard(); }
        else { println(H.dim('  Type ' + H.cyan('start') + ' to begin.')); }
        return;
      }
      if (game.phase === 'end') {
        if (cmd === 'restart') { game = new Game(); renderIntro(); game.phase = 'intro'; }
        return;
      }
      if (game.phase === 'sub_ticker') {
        const t = raw.toUpperCase();
        if (!game.stocks[t]) {
          println(H.red(`  Unknown ticker '${t}'. Valid: ${Object.keys(game.stocks).join(', ')}`));
          println(H.yellow('  Enter ticker:'));
          return;
        }
        game.subTicker = t;
        game.phase = game.subAction === 'buy' ? 'sub_shares_buy' : 'sub_shares_sell';
        const s = game.stocks[t];
        if (game.subAction === 'buy') {
          const maxSh = game.cash / s.price;
          println(H.dim(`  ${t} @ ${price(s.price)}   Max buyable: ${H.cyan(maxSh.toFixed(4))} sh`));
          println(H.yellow('  Shares (or $amount like $500):'));
        } else {
          const owned = game.holdings[t] || 0;
          println(H.dim(`  ${t} @ ${price(s.price)}   You own: ${H.cyan(owned.toFixed(4))} sh`));
          println(H.yellow('  Shares to sell (or $amount, or "all"):'));
        }
        return;
      }
      if (game.phase === 'sub_shares_buy' || game.phase === 'sub_shares_sell') {
        const action = game.subAction;
        const ticker = game.subTicker;
        const s = game.stocks[ticker];
        let shares;
        if (raw.toLowerCase() === 'all' && action === 'sell') {
          shares = game.holdings[ticker] || 0;
        } else if (raw.startsWith('$')) {
          shares = parseFloat(raw.slice(1)) / s.price;
        } else {
          shares = parseFloat(raw);
        }
        if (!isFinite(shares) || shares <= 0) {
          println(H.red('  Invalid amount.'));
        } else {
          const result = action === 'buy' ? game.buy(ticker, shares) : game.sell(ticker, shares);
          println(result.ok ? H.green('  ✓ ' + result.msg) : H.red('  ✗ ' + result.msg));
        }
        game.phase = 'play';
        game.subTicker = null; game.subAction = null;
        setTimeout(() => renderBoard(), 300);
        return;
      }

      const parts = raw.split(/\s+/);
      const verb  = parts[0].toLowerCase();

      if ((verb === 'b' || verb === 'buy') && parts.length >= 2) {
        const ticker = parts[1].toUpperCase();
        if (!game.stocks[ticker]) { println(H.red(`  Unknown ticker '${ticker}'.`)); renderBoard(); return; }
        let shares;
        if (parts[2]) {
          shares = parts[2].startsWith('$') ? parseFloat(parts[2].slice(1)) / game.stocks[ticker].price : parseFloat(parts[2]);
        }
        if (isFinite(shares) && shares > 0) {
          const r = game.buy(ticker, shares);
          println(r.ok ? H.green('  ✓ ' + r.msg) : H.red('  ✗ ' + r.msg));
          setTimeout(() => renderBoard(), 300); return;
        }
        game.subAction = 'buy'; game.subTicker = ticker; game.phase = 'sub_shares_buy';
        const s = game.stocks[ticker];
        println(H.dim(`  ${ticker} @ ${price(s.price)}   Max buyable: ${H.cyan((game.cash/s.price).toFixed(4))} sh`));
        println(H.yellow('  Shares (or $amount like $500):'));
        return;
      }

      if ((verb === 's' || verb === 'sell') && parts.length >= 2) {
        const ticker = parts[1].toUpperCase();
        if (!game.stocks[ticker]) { println(H.red(`  Unknown ticker '${ticker}'.`)); renderBoard(); return; }
        if (!game.holdings[ticker]) { println(H.red(`  You don't own ${ticker}.`)); renderBoard(); return; }
        let shares;
        if (parts[2]) {
          if (parts[2].toLowerCase()==='all') shares = game.holdings[ticker];
          else shares = parts[2].startsWith('$') ? parseFloat(parts[2].slice(1)) / game.stocks[ticker].price : parseFloat(parts[2]);
        }
        if (isFinite(shares) && shares > 0) {
          const r = game.sell(ticker, shares);
          println(r.ok ? H.green('  ✓ ' + r.msg) : H.red('  ✗ ' + r.msg));
          setTimeout(() => renderBoard(), 300); return;
        }
        game.subAction = 'sell'; game.subTicker = ticker; game.phase = 'sub_shares_sell';
        const s = game.stocks[ticker];
        println(H.dim(`  ${ticker} @ ${price(s.price)}   You own: ${H.cyan((game.holdings[ticker]||0).toFixed(4))} sh`));
        println(H.yellow('  Shares to sell (or $amount, or "all"):'));
        return;
      }

      if ((verb === 'b' || verb === 'buy') && parts.length === 1) {
        game.subAction = 'buy'; game.phase = 'sub_ticker';
        println(H.yellow(`  Tickers: ${Object.keys(game.stocks).map(t=>H.cyan(t)).join('  ')}`));
        println(H.yellow('  Enter ticker:'));
        return;
      }
      if ((verb === 's' || verb === 'sell') && parts.length === 1) {
        if (!Object.keys(game.holdings).length) { println(H.red('  No open positions.')); return; }
        game.subAction = 'sell'; game.phase = 'sub_ticker';
        println(H.yellow(`  Your positions: ${Object.keys(game.holdings).map(t=>H.cyan(t)).join('  ')}`));
        println(H.yellow('  Enter ticker:'));
        return;
      }

      if (cmd === 't' || cmd === 'tick' || cmd === '') {
        if (!game.running) { game.phase = 'end'; renderEnd(); return; }
        game.advanceTick();
        updateTickerBar();
        if (!game.running) { game.phase = 'end'; setTimeout(renderEnd, 400); return; }
        renderBoard();
        return;
      }
      if (cmd === 'n' || cmd === 'next') {
        const rem = TICKS_PER_DAY - game.tick;
        for (let i = 0; i < rem && game.running; i++) game.advanceTick();
        updateTickerBar();
        if (!game.running) { game.phase = 'end'; renderEnd(); return; }
        println(H.yellow(`  ⏭  Advanced to ${game.dayName()}.`));
        setTimeout(() => renderBoard(), 200);
        return;
      }
      if (cmd === 'r' || cmd === 'refresh') { renderBoard(); return; }
      if (cmd === 'restart') { game = new Game(); renderIntro(); game.phase = 'intro'; return; }
      if (cmd === 'q' || cmd === 'quit') {
        out.innerHTML = '';
        println(H.dim('  Market closed. Goodbye.'));
        return;
      }
      if (cmd === 'help') {
        println(H.yellow(H.bold('  Commands:')));
        println(H.dim('  b [TICKER] [shares|$amount]  — buy shares'));
        println(H.dim('  s [TICKER] [shares|$amount|all] — sell shares'));
        println(H.dim('  t / Enter   — advance 1 trading hour'));
        println(H.dim('  n           — advance to next trading day'));
        println(H.dim('  r           — refresh display'));
        println(H.dim('  q           — quit'));
        return;
      }
      println(H.dim(`  Unknown command '${raw}'. Type ${H.cyan('help')} for commands.`));
    }

    // Boot
    game = new Game();
    game.phase = 'intro';
    renderIntro();
    updateTickerBar();
    inp.focus();

    // Input handler
    function onKeydown(e) {
      if (e.key !== 'Enter') return;
      const raw = inp.value.trim();
      inp.value = '';
      handleGameInput(raw);
    }
    inp.addEventListener('keydown', onKeydown);

    // Auto-tick
    let lastInput = Date.now();
    inp.addEventListener('keydown', () => { lastInput = Date.now(); });
    const autoTickInterval = setInterval(() => {
      if (game && game.phase === 'play' && game.running && (Date.now() - lastInput > 8000)) {
        game.advanceTick();
        updateTickerBar();
        if (!game.running) { game.phase = 'end'; renderEnd(); return; }
        renderBoard();
      }
    }, 4000);

    return () => {
      inp.removeEventListener('keydown', onKeydown);
      clearInterval(autoTickInterval);
    };
  }, []);

  return (
    <div className="wsw-body">
      <header>
        <Link id="back-link" to="/games">Back</Link>
      </header>
      <div id="terminal">
        <div id="titlebar">
          <div className="dot dot-r"></div>
          <div className="dot dot-y"></div>
          <div className="dot dot-g"></div>
          <span id="titlebar-text">Wall Street Week — CLI Trading Sim</span>
        </div>
        <div id="ticker-bar"><span id="ticker-inner" ref={tickerInnerRef}>Loading market data…</span></div>
        <div id="output" ref={outputRef}></div>
        <div id="input-row">
          <span id="prompt-label">▶</span>
          <input
            ref={inputRef}
            id="cmd-input"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="type a command and press Enter…"
          />
        </div>
      </div>
    </div>
  );
}
