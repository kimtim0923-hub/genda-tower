"use client";

import { useState } from "react";
import {
  Globe, Zap, CheckCircle2, XCircle,
  Mail, Linkedin, Megaphone, MapPin,
  Users, Code2, BarChart3, Flag, TrendingUp,
  ChevronDown, ChevronRight,
} from "lucide-react";

type TaskStatus = "todo" | "active" | "done" | "blocked";
type Priority   = "critical" | "high" | "medium" | "low";
type WsKey = "landing"|"acquisition"|"coldmail"|"linkedin"|"venuedb"|"influencer"|"mvp";

interface GanttTask {
  id: string; name: string; start: string; end: string;
  status: TaskStatus; priority: Priority; note?: string;
}
interface Workstream {
  id: string; label: string; icon: React.ReactNode; color: WsKey; tasks: GanttTask[];
}

const WS_COLORS: Record<WsKey,{hdr:string;row:string;bar:string}> = {
  landing:     {hdr:"#4f46e5",row:"#eef2ff",bar:"#818cf8"},
  acquisition: {hdr:"#db2777",row:"#fdf2f8",bar:"#f472b6"},
  coldmail:    {hdr:"#2563eb",row:"#eff6ff",bar:"#60a5fa"},
  linkedin:    {hdr:"#0284c7",row:"#f0f9ff",bar:"#38bdf8"},
  venuedb:     {hdr:"#059669",row:"#ecfdf5",bar:"#34d399"},
  influencer:  {hdr:"#7c3aed",row:"#f5f3ff",bar:"#a78bfa"},
  mvp:         {hdr:"#d97706",row:"#fffbeb",bar:"#fbbf24"},
};

const STATUS_CFG: Record<TaskStatus,{label:string;bg:string;text:string;dot:string}> = {
  todo:    {label:"예정",   bg:"#f1f5f9",text:"#64748b",dot:"#94a3b8"},
  active:  {label:"진행중", bg:"#dbeafe",text:"#1d4ed8",dot:"#3b82f6"},
  done:    {label:"완료",   bg:"#d1fae5",text:"#065f46",dot:"#10b981"},
  blocked: {label:"블락",   bg:"#fee2e2",text:"#991b1b",dot:"#ef4444"},
};

const PRIORITY_DOT: Record<Priority,string> = {
  critical:"#ef4444",high:"#f97316",medium:"#eab308",low:"#94a3b8",
};

const STATUS_CYCLE: TaskStatus[] = ["todo","active","done","blocked"];
const TL_START="2026-03-01", TL_END="2026-11-30";
const TL_MS = new Date(TL_END).getTime()-new Date(TL_START).getTime();
const todayStr = new Date().toISOString().slice(0,10);
const toX = (d:string) => Math.max(0,Math.min(100,
  ((new Date(d).getTime()-new Date(TL_START).getTime())/TL_MS)*100));

const MONTHS=(()=>{
  const arr:{label:string;x:number}[]=[];
  let c=new Date(2026,2,1);
  while(c<=new Date(2026,11,1)){
    arr.push({label:c.toLocaleDateString("ko-KR",{month:"short"}),x:toX(c.toISOString().slice(0,10))});
    c=new Date(c.getFullYear(),c.getMonth()+1,1);
  }
  return arr;
})();

const MILESTONES=[
  {date:"2026-03-22",label:"랜딩 LIVE",color:"#4f46e5"},
  {date:"2026-04-07",label:"PH 론칭",  color:"#db2777"},
  {date:"2026-06-01",label:"MVP LIVE", color:"#d97706"},
  {date:"2026-09-01",label:"BEP 70%", color:"#f97316"},
  {date:"2026-11-01",label:"BEP 100%",color:"#059669"},
];

const INIT_WS: Workstream[] = [
  { id:"landing",label:"🚀 랜딩페이지 & 유효성 검증",icon:<Globe size={12}/>,color:"landing",tasks:[
    {id:"l1",name:"랜딩페이지 와이어프레임 설계",   start:"2026-03-06",end:"2026-03-10",status:"done",  priority:"critical"},
    {id:"l2",name:"Next.js 랜딩페이지 개발",         start:"2026-03-10",end:"2026-03-22",status:"active",priority:"critical"},
    {id:"l3",name:"베타 사전등록 폼 연동 (Supabase)", start:"2026-03-18",end:"2026-03-24",status:"todo", priority:"critical"},
    {id:"l4",name:"OG 이미지 & SEO 메타 세팅",       start:"2026-03-22",end:"2026-03-25",status:"todo", priority:"high"},
    {id:"l5",name:"웰컴 이메일 자동화 (n8n→Gmail)",   start:"2026-03-24",end:"2026-03-28",status:"todo", priority:"high"},
    {id:"l6",name:"유효성 데이터 분석 (100→500→1000명)",start:"2026-03-28",end:"2026-06-30",status:"todo",priority:"critical"},
  ]},
  { id:"acquisition",label:"📢 베타 모객 채널 (전방위 홍보)",icon:<Megaphone size={12}/>,color:"acquisition",tasks:[
    {id:"a1",name:"Betalist 등록",                    start:"2026-03-15",end:"2026-03-18",status:"todo",priority:"high"},
    {id:"a2",name:"Product Hunt 론칭 준비",           start:"2026-03-15",end:"2026-04-05",status:"todo",priority:"critical",note:"Hunter 섭외 + 에셋 준비"},
    {id:"a3",name:"Indie Hackers 포스팅",             start:"2026-03-20",end:"2026-03-23",status:"todo",priority:"high"},
    {id:"a4",name:"Reddit (r/SideProject, r/entrepreneur)",start:"2026-03-20",end:"2026-03-25",status:"todo",priority:"medium"},
    {id:"a5",name:"X(Twitter) 계정 세팅 & 첫 스레드",start:"2026-03-15",end:"2026-03-20",status:"todo",priority:"medium"},
    {id:"a6",name:"JP/SEA 커뮤니티 타겟 포스팅",      start:"2026-03-25",end:"2026-04-10",status:"todo",priority:"high"},
    {id:"a7",name:"Product Hunt 론칭 실행 🚀",        start:"2026-04-07",end:"2026-04-08",status:"todo",priority:"critical"},
    {id:"a8",name:"ITB Asia 사전 네트워킹 리드 수집",  start:"2026-06-01",end:"2026-09-30",status:"todo",priority:"high"},
  ]},
  { id:"coldmail",label:"📧 타겟 콜드메일 캠페인",icon:<Mail size={12}/>,color:"coldmail",tasks:[
    {id:"c1",name:"JP/SEA/US 리드 리스트 100건",      start:"2026-03-10",end:"2026-03-20",status:"todo",priority:"critical"},
    {id:"c2",name:"Template A (스몰브랜드 오너)",      start:"2026-03-15",end:"2026-03-20",status:"todo",priority:"critical",note:"3-Step Hook 프레임워크"},
    {id:"c3",name:"Template B (해외 에이전시)",        start:"2026-03-15",end:"2026-03-20",status:"todo",priority:"high"},
    {id:"c4",name:"n8n 자동화 구축 (LLM 개인화)",     start:"2026-03-22",end:"2026-04-05",status:"todo",priority:"critical"},
    {id:"c5",name:"1차 테스트 발송 10건 & 오픈율 확인",start:"2026-04-05",end:"2026-04-10",status:"todo",priority:"high"},
    {id:"c6",name:"2차 발송 100건 + Hook 최적화",     start:"2026-04-10",end:"2026-04-25",status:"todo",priority:"high"},
    {id:"c7",name:"대규모 발송 500건 + 리플라이 관리", start:"2026-05-01",end:"2026-05-31",status:"todo",priority:"high"},
  ]},
  { id:"linkedin",label:"🔗 LinkedIn Build in Public",icon:<Linkedin size={12}/>,color:"linkedin",tasks:[
    {id:"li1",name:"LinkedIn 프로필 최적화 (PCO→SaaS Founder)",start:"2026-03-06",end:"2026-03-10",status:"done",priority:"critical"},
    {id:"li2",name:"Post #1: The Pivot",                       start:"2026-03-10",end:"2026-03-11",status:"todo",priority:"high"},
    {id:"li3",name:"Post #2: Tech Stack (n8n+FastAPI)",        start:"2026-03-17",end:"2026-03-18",status:"todo",priority:"medium"},
    {id:"li4",name:"Post #3: Market Insight (서울 88% 쏠림)", start:"2026-03-24",end:"2026-03-25",status:"todo",priority:"medium"},
    {id:"li5",name:"Post #4: Behind the Scenes",              start:"2026-03-31",end:"2026-04-01",status:"todo",priority:"medium"},
    {id:"li6",name:"n8n Notion→LLM→LinkedIn 자동 배포",       start:"2026-03-20",end:"2026-04-05",status:"todo",priority:"high"},
    {id:"li7",name:"주 1회 BIP 정기 포스팅 자동화 (4월~)",    start:"2026-04-06",end:"2026-08-31",status:"todo",priority:"medium"},
  ]},
  { id:"venuedb",label:"🏢 베뉴 DB & 큐레이션 엔진",icon:<MapPin size={12}/>,color:"venuedb",tasks:[
    {id:"v1",name:"KTO/BTO 유니크베뉴 API 연동",      start:"2026-03-15",end:"2026-03-30",status:"todo",priority:"critical"},
    {id:"v2",name:"Google Places API 연동",           start:"2026-03-20",end:"2026-04-05",status:"todo",priority:"high"},
    {id:"v3",name:"부산 베뉴 수동 DB 파일럿 100개소", start:"2026-04-01",end:"2026-04-30",status:"todo",priority:"critical",note:"Sora 10년 실무 데이터"},
    {id:"v4",name:"Hard Filter 로직 (예산/수용규모)", start:"2026-04-15",end:"2026-05-05",status:"todo",priority:"high"},
    {id:"v5",name:"Soft Scoring (Vibe Match+Traffic)",start:"2026-04-25",end:"2026-05-20",status:"todo",priority:"high"},
    {id:"v6",name:"전국 5,000개소 DB 확장",           start:"2026-07-01",end:"2026-08-31",status:"todo",priority:"high"},
    {id:"v7",name:"지자체 스폰서드 노출 계약 연동",   start:"2026-09-01",end:"2026-09-30",status:"todo",priority:"medium"},
  ]},
  { id:"influencer",label:"🎯 인플루언서 DB & 비용 산출",icon:<Users size={12}/>,color:"influencer",tasks:[
    {id:"in1",name:"Nano~Macro 티어별 후보 DB",         start:"2026-03-20",end:"2026-04-10",status:"todo",priority:"high",note:"Cbase × 1.15"},
    {id:"in2",name:"Cbase 자동 계산 FastAPI 엔드포인트",start:"2026-04-05",end:"2026-04-20",status:"todo",priority:"high"},
    {id:"in3",name:"참여율 가중치(Weng) 연동",          start:"2026-04-15",end:"2026-04-30",status:"todo",priority:"medium"},
    {id:"in4",name:"해외 팔로워 비중(Wglobal) 연동",   start:"2026-04-20",end:"2026-05-05",status:"todo",priority:"medium"},
    {id:"in5",name:"Launch 패키지 후보 3인 자동 추천 UI",start:"2026-05-10",end:"2026-06-10",status:"todo",priority:"high"},
  ]},
  { id:"mvp",label:"⚙️ MVP 핵심 기능 개발",icon:<Code2 size={12}/>,color:"mvp",tasks:[
    {id:"m1",name:"베뉴 검색 & 필터 UI",              start:"2026-04-01",end:"2026-05-15",status:"todo",priority:"critical"},
    {id:"m2",name:"즉시 견적 산출 'Aha Moment' 컴포넌트",start:"2026-04-10",end:"2026-04-30",status:"todo",priority:"critical",note:"Master.md 핵심 훅"},
    {id:"m3",name:"인플루언서 매칭 UI",               start:"2026-04-20",end:"2026-05-31",status:"todo",priority:"critical"},
    {id:"m4",name:"마케팅 에셋 AI 생성 (3-Step Chain)",start:"2026-05-01",end:"2026-06-15",status:"todo",priority:"high"},
    {id:"m5",name:"크레딧 결제 Stripe ($99/$499/$1,500)",start:"2026-05-15",end:"2026-06-30",status:"todo",priority:"critical"},
    {id:"m6",name:"팀 협업 보드 (해외↔현지 스태프)",  start:"2026-06-01",end:"2026-07-31",status:"todo",priority:"medium"},
    {id:"m7",name:"Actionable Proposal 자동 생성",    start:"2026-06-15",end:"2026-07-31",status:"todo",priority:"critical",note:"1 크레딧 = 실행형 견적서"},
  ]},
];

const INIT_KPIS=[
  {id:"beta",  label:"베타 모객",   current:0,target:1000,unit:"명", color:"#4f46e5"},
  {id:"cr",    label:"전환율",      current:0,target:15,  unit:"%",  color:"#db2777"},
  {id:"open",  label:"메일 오픈율", current:0,target:40,  unit:"%",  color:"#2563eb"},
  {id:"credit",label:"크레딧 판매", current:0,target:6,   unit:"건", color:"#d97706"},
];

export default function GanttTower() {
  const [ws, setWs]       = useState(INIT_WS);
  const [open, setOpen]   = useState<Record<string,boolean>>(Object.fromEntries(INIT_WS.map(w=>[w.id,true])));
  const [kpis, setKpis]   = useState(INIT_KPIS);
  const [editK, setEditK] = useState<string|null>(null);
  const [kInp, setKInp]   = useState("");
  const todayX = toX(todayStr);

  const cycleStatus=(wsId:string,taskId:string)=>setWs(prev=>prev.map(w=>{
    if(w.id!==wsId)return w;
    return{...w,tasks:w.tasks.map(t=>{
      if(t.id!==taskId)return t;
      return{...t,status:STATUS_CYCLE[(STATUS_CYCLE.indexOf(t.status)+1)%STATUS_CYCLE.length]};
    })};
  }));

  const saveKpi=(id:string)=>{
    const v=parseInt(kInp);if(!isNaN(v))setKpis(p=>p.map(k=>k.id===id?{...k,current:v}:k));
    setEditK(null);setKInp("");
  };

  const allT=ws.flatMap(w=>w.tasks);
  const doneN=allT.filter(t=>t.status==="done").length;
  const actN=allT.filter(t=>t.status==="active").length;

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",fontSize:13}}>

      {/* 헤더 */}
      <header style={{background:"#fff",borderBottom:"1px solid #e2e8f0",position:"sticky",top:48,zIndex:40,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
        <div style={{maxWidth:1600,margin:"0 auto",padding:"10px 20px",display:"flex",alignItems:"center",gap:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <div>
              <div style={{fontWeight:900,fontSize:14,lineHeight:1.1}}>관제탑 Dashboard</div>
              <div style={{fontSize:9,color:"#94a3b8",marginTop:1}}>1,000명 베타 모객 · GTM 전체 워크플로우</div>
            </div>
          </div>

          {/* KPI */}
          <div style={{display:"flex",gap:8,flex:1,marginLeft:8}}>
            {kpis.map(k=>{
              const pct=Math.min(100,(k.current/k.target)*100);
              return(
                <div key={k.id} onClick={()=>{setEditK(k.id);setKInp(String(k.current));}}
                  style={{flex:1,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:9,padding:"6px 10px",cursor:"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <span style={{fontSize:9,color:"#64748b",fontWeight:600}}>{k.label}</span>
                    {editK===k.id
                      ?<input autoFocus value={kInp} onChange={e=>setKInp(e.target.value)}
                          onBlur={()=>saveKpi(k.id)} onKeyDown={e=>e.key==="Enter"&&saveKpi(k.id)}
                          onClick={e=>e.stopPropagation()}
                          style={{width:44,fontSize:9,border:"1px solid "+k.color,borderRadius:3,padding:"1px 3px",outline:"none"}}/>
                      :<span style={{fontSize:10,fontWeight:700,color:"#1e293b"}}>{k.current}/{k.target}{k.unit}</span>
                    }
                  </div>
                  <div style={{height:3,background:"#e2e8f0",borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",background:k.color,borderRadius:99,width:pct+"%",transition:"width .4s"}}/>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:9,color:"#94a3b8"}}>{todayStr}</div>
            <div style={{fontSize:10,fontWeight:700,color:"#4f46e5"}}>완료 {doneN} · 진행 {actN} / {allT.length}</div>
          </div>
        </div>
      </header>

      <main style={{maxWidth:1600,margin:"0 auto",padding:"14px 20px"}}>

        {/* 범례 */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:20,height:2,background:"#f87171"}}/>
            <span style={{fontSize:9,color:"#94a3b8"}}>오늘</span>
          </div>
          {(Object.entries(STATUS_CFG) as [TaskStatus,typeof STATUS_CFG[TaskStatus]][]).map(([s,c])=>(
            <div key={s} style={{display:"flex",alignItems:"center",gap:3}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:c.dot}}/>
              <span style={{fontSize:9,color:"#64748b"}}>{c.label}</span>
            </div>
          ))}
          {(["critical","high","medium","low"] as Priority[]).map(p=>(
            <div key={p} style={{display:"flex",alignItems:"center",gap:3}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:PRIORITY_DOT[p]}}/>
              <span style={{fontSize:9,color:"#94a3b8"}}>{p}</span>
            </div>
          ))}
          <span style={{fontSize:9,color:"#cbd5e1",marginLeft:"auto"}}>● 클릭 → 상태 변경 | KPI 숫자 클릭 → 수정</span>
        </div>

        {/* 타임라인 헤더 */}
        <div style={{display:"flex",alignItems:"center",background:"#fff",border:"1px solid #e2e8f0",borderRadius:9,padding:"5px 8px",marginBottom:5,position:"sticky",top:108,zIndex:30,boxShadow:"0 1px 2px rgba(0,0,0,.04)"}}>
          <div style={{width:238,flexShrink:0,fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".05em"}}>태스크</div>
          <div style={{flex:1,position:"relative",height:14}}>
            {MONTHS.map((m,i)=>(
              <span key={i} style={{position:"absolute",left:m.x+"%",fontSize:8,color:"#94a3b8",fontWeight:600,transform:"translateX(-50%)"}}>{m.label}</span>
            ))}
            <div style={{position:"absolute",left:todayX+"%",top:-3,bottom:-3,width:1,background:"rgba(248,113,113,.5)"}}/>
          </div>
          <div style={{width:58,flexShrink:0,fontSize:9,fontWeight:700,color:"#94a3b8",textAlign:"right"}}>상태</div>
        </div>

        {/* 워크스트림 */}
        {ws.map(w=>{
          const cfg=WS_COLORS[w.color];
          const dCnt=w.tasks.filter(t=>t.status==="done").length;
          const isOpen=open[w.id];
          return(
            <div key={w.id} style={{border:`1px solid ${cfg.hdr}35`,borderRadius:9,overflow:"hidden",marginBottom:7,boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
              <button onClick={()=>setOpen(p=>({...p,[w.id]:!p[w.id]}))}
                style={{width:"100%",display:"flex",alignItems:"center",background:cfg.hdr,color:"#fff",padding:"6px 8px",border:"none",cursor:"pointer",textAlign:"left"}}>
                <div style={{width:238,flexShrink:0,display:"flex",alignItems:"center",gap:5}}>
                  {isOpen?<ChevronDown size={11}/>:<ChevronRight size={11}/>}
                  {w.icon}
                  <span style={{fontSize:10,fontWeight:700}}>{w.label}</span>
                </div>
                <div style={{flex:1,position:"relative",height:4}}>
                  <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,.15)",borderRadius:2}}/>
                  <div style={{position:"absolute",top:0,bottom:0,left:0,background:"rgba(255,255,255,.45)",borderRadius:2,width:(dCnt/w.tasks.length*100)+"%",transition:"width .4s"}}/>
                  <div style={{position:"absolute",left:todayX+"%",top:-3,bottom:-3,width:1,background:"rgba(255,255,255,.4)"}}/>
                </div>
                <div style={{width:58,flexShrink:0,textAlign:"right",fontSize:9,opacity:.8}}>{dCnt}/{w.tasks.length}</div>
              </button>

              {isOpen&&w.tasks.map(t=>{
                const sc=STATUS_CFG[t.status];
                const lx=toX(t.start),rx=toX(t.end);
                const bw=Math.max(0.6,rx-lx);
                const barBg=t.status==="done"||t.status==="active"?cfg.bar:cfg.bar+"55";
                const nowPct=Math.min(100,Math.max(0,
                  ((new Date().getTime()-new Date(t.start).getTime())/(new Date(t.end).getTime()-new Date(t.start).getTime()))*100
                ));
                return(
                  <div key={t.id}
                    style={{display:"flex",alignItems:"center",height:32,borderBottom:`1px solid ${cfg.hdr}12`,background:cfg.row,transition:"background .1s"}}
                    onMouseEnter={e=>(e.currentTarget.style.background=cfg.hdr+"14")}
                    onMouseLeave={e=>(e.currentTarget.style.background=cfg.row)}
                  >
                    <div style={{width:238,flexShrink:0,display:"flex",alignItems:"center",gap:4,padding:"0 6px"}}>
                      <button onClick={()=>cycleStatus(w.id,t.id)}
                        title={`현재: ${sc.label} → 클릭해서 변경`}
                        style={{border:"none",background:"none",cursor:"pointer",padding:0,flexShrink:0,display:"flex",alignItems:"center"}}>
                        <div style={{width:9,height:9,borderRadius:"50%",background:sc.dot}}/>
                      </button>
                      <div style={{width:5,height:5,borderRadius:"50%",background:PRIORITY_DOT[t.priority],flexShrink:0}}/>
                      <span title={t.note||t.name} style={{
                        fontSize:10,color:"#334155",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                        textDecoration:t.status==="done"?"line-through":"none",
                        opacity:t.status==="done"?.5:1,
                      }}>{t.name}</span>
                    </div>

                    <div style={{flex:1,position:"relative",height:"100%",overflow:"visible"}}>
                      <div style={{position:"absolute",left:todayX+"%",top:0,bottom:0,width:1,background:"rgba(248,113,113,.55)",zIndex:2,pointerEvents:"none"}}/>
                      <div title={`${t.start} ~ ${t.end}${t.note?"\n"+t.note:""}`}
                        style={{position:"absolute",left:lx+"%",width:bw+"%",top:"50%",transform:"translateY(-50%)",
                          height:16,borderRadius:3,background:barBg,opacity:t.status==="blocked"?.35:1,overflow:"hidden",zIndex:1}}>
                        {t.status==="active"&&<div style={{position:"absolute",top:0,bottom:0,left:0,background:"rgba(255,255,255,.35)",width:nowPct+"%"}}/>}
                        {bw>7&&<span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",padding:"0 4px",fontSize:8,fontWeight:600,color:"#fff",whiteSpace:"nowrap",overflow:"hidden"}}>{t.name}</span>}
                      </div>
                    </div>

                    <div style={{width:58,flexShrink:0,textAlign:"right",paddingRight:6}}>
                      <span style={{fontSize:8,padding:"2px 5px",borderRadius:99,fontWeight:600,background:sc.bg,color:sc.text}}>{sc.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* 통계 */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:14}}>
          {[
            {label:"전체 태스크",val:allT.length+"건",color:"#475569",icon:<BarChart3 size={13}/>},
            {label:"진행 중",    val:actN+"건",       color:"#2563eb",icon:<Zap size={13}/>},
            {label:"완료",       val:doneN+"건",      color:"#059669",icon:<CheckCircle2 size={13}/>},
            {label:"달성률",     val:Math.round(doneN/allT.length*100)+"%",color:"#4f46e5",icon:<TrendingUp size={13}/>},
          ].map(s=>(
            <div key={s.label} style={{background:"#fff",borderRadius:10,padding:"12px 14px",border:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:10}}>
              <span style={{color:s.color}}>{s.icon}</span>
              <div>
                <div style={{fontSize:20,fontWeight:900,color:"#0f172a",lineHeight:1}}>{s.val}</div>
                <div style={{fontSize:9,color:"#94a3b8",marginTop:2}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 마일스톤 */}
        <div style={{marginTop:10,background:"#fff",borderRadius:10,padding:"12px 14px",border:"1px solid #e2e8f0"}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:10}}>
            <Flag size={11} color="#94a3b8"/>
            <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".05em"}}>BEP 마일스톤</span>
          </div>
          <div style={{position:"relative",height:38}}>
            <div style={{position:"absolute",top:"40%",left:0,right:0,height:2,background:"#f1f5f9"}}/>
            <div style={{position:"absolute",top:"40%",left:0,height:2,background:"linear-gradient(90deg,#4f46e5,#db2777,#d97706)",width:todayX+"%"}}/>
            {MILESTONES.map(m=>(
              <div key={m.date} style={{position:"absolute",left:toX(m.date)+"%",top:"40%",transform:"translate(-50%,-50%)",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:11,height:11,borderRadius:"50%",background:m.color,border:"2px solid #fff",boxShadow:`0 0 0 2px ${m.color}50`,zIndex:2}}/>
                <span style={{fontSize:8,fontWeight:700,color:"#475569",whiteSpace:"nowrap",marginTop:10,position:"absolute"}}>{m.label}</span>
                <span style={{fontSize:7,color:"#94a3b8",whiteSpace:"nowrap",marginTop:19,position:"absolute"}}>{m.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign:"center",fontSize:9,color:"#cbd5e1",marginTop:12,paddingBottom:16}}>
          Gen-da Control Tower · Sora (10Y PCO) · 1,000 Beta Goal
        </div>
      </main>
    </div>
  );
}
