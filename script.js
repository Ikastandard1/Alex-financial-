const chartEl = document.getElementById("chart");
const chart = LightweightCharts.createChart(chartEl, {
  layout: { background: { type: "solid", color: "#050a11" }, textColor: "#8f9baa" },
  grid: { vertLines: { color: "#101923" }, horzLines: { color: "#101923" } },
  rightPriceScale: { borderColor: "#202a35" },
  timeScale: { borderColor: "#202a35", timeVisible: true, secondsVisible: false },
  crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
});
const candleSeries = chart.addSeries(LightweightCharts.CandlestickSeries, {
  upColor:"#19b85b", downColor:"#f23d49", borderVisible:false,
  wickUpColor:"#19b85b", wickDownColor:"#f23d49"
});

function seedCandles() {
  const data=[]; let price=78.4; const now=Math.floor(Date.now()/1000);
  for(let i=95;i>=0;i--){
    const time=now-i*60;
    const open=price;
    const move=(Math.random()-0.46)*0.72;
    const close=Math.max(72, open+move);
    const high=Math.max(open,close)+Math.random()*0.28;
    const low=Math.min(open,close)-Math.random()*0.25;
    data.push({time,open,high,low,close});
    price=close;
  }
  candleSeries.setData(data);
  chart.timeScale().fitContent();
  return data;
}
let candles=seedCandles();

function updateCandle() {
  const last=candles[candles.length-1];
  const move=(Math.random()-0.47)*0.18;
  const close=Math.max(72,last.close+move);
  const current={time:last.time,open:last.open,high:Math.max(last.high,close),low:Math.min(last.low,close),close};
  candles[candles.length-1]=current;
  candleSeries.update(current);

  const price=close.toFixed(2);
  document.getElementById("oilPrice").textContent="$"+price;
  document.getElementById("cardOil").textContent="$"+price;
  const pct=((close-candles[0].open)/candles[0].open*100);
  const sign=pct>=0?"+":"";
  document.getElementById("oilChange").textContent=sign+pct.toFixed(2)+"%";
  document.getElementById("cardOilChange").textContent=sign+pct.toFixed(2)+"%";
  document.getElementById("oilChange").className=pct>=0?"positive":"";
  document.getElementById("cardOilChange").className=pct>=0?"positive":"";
  if(Math.random()<0.18){
    const nextTime=last.time+60;
    const next={time:nextTime,open:close,high:close,low:close,close};
    candles.push(next); candleSeries.update(next);
    if(candles.length>120)candles.shift();
  }
}
setInterval(updateCandle,1800);

let sp=5289.47;
function updateSP(){
  sp += (Math.random()-.43)*2.5;
  const formatted=sp.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  document.getElementById("spPrice").textContent=formatted;
  document.getElementById("cardSp").textContent=formatted;
  const pct=((sp-5289.47)/5289.47)*100;
  const sign=pct>=0?"+":"";
  document.getElementById("spChange").textContent=sign+pct.toFixed(2)+"%";
  document.getElementById("cardSpChange").textContent=sign+pct.toFixed(2)+"%";
}
setInterval(updateSP,2500);

function drawMini(canvas, direction=1){
  const ctx=canvas.getContext("2d"), w=canvas.width=canvas.offsetWidth*2, h=canvas.height=canvas.offsetHeight*2;
  ctx.clearRect(0,0,w,h); ctx.lineWidth=3; ctx.strokeStyle=direction>0?"#27c86a":"#e84a55";
  ctx.beginPath(); let y=h*.7;
  for(let x=0;x<w;x+=12){ y+= (Math.random()-.45)*10 - direction*0.8; y=Math.max(h*.18,Math.min(h*.88,y)); x===0?ctx.moveTo(x,y):ctx.lineTo(x,y); }
  ctx.stroke();
}
document.querySelectorAll(".mini").forEach(c=>drawMini(c,1));
drawMini(document.getElementById("miniOil"),-1);
drawMini(document.getElementById("miniSp"),1);
setInterval(()=>{document.querySelectorAll(".mini").forEach(c=>drawMini(c,1));drawMini(document.getElementById("miniOil"),-1);drawMini(document.getElementById("miniSp"),1)},3500);

window.addEventListener("resize",()=>chart.applyOptions({width:chartEl.clientWidth}));

// OPTIONAL REAL DATA:
// This portfolio version runs immediately with a realistic live simulation.
// For an actual market-data feed, add a Twelve Data API key and replace the
// simulation functions with your licensed feed/WebSocket. Never expose a
// private/professional data-provider secret in public production code.
