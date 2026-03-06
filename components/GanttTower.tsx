"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Globe, Zap, CheckCircle2, XCircle,
  Mail, Linkedin, Megaphone, MapPin,
  Users, Code2, BarChart3, Flag, TrendingUp,
  ChevronDown, ChevronRight, RefreshCw,
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

// DB row shape
interface DbTask {
  id: string; workstream_id: string; name: string;
  start_date: string; end_date: string;
  status: TaskStatus; priority: Priority; note: string | null;
}
interface DbKpi {
  id: string; label: string; current_value: number;
  target_value: number; unit: string; color: string;
}

const WS_META: {id:WsKey;label:string;icon:React.ReactNode}[] = [
  {id:"landing",    label:"🚀 랜딩페이지 & 유효성 검증",     icon:<Globe size={12}/>},
  {id:"acquisition",label:"📢 베타 모객 채널 (전방위 홍보)", icon:<Megaphone size={12}/>},
  {id:"coldmail",   label:"📧 타겟 콜드메일 캠페인",         icon:<Mail size={12}/>},
  {id:"linkedin",   label:"🔗 LinkedIn Build in Public",     icon:<Linkedin size={12}/>},
  {id:"venuedb",    label:"🏢 베뉴 DB & 큐레이션 엔진",      icon:<MapPin size={12}/>},
  {id:"influencer", label:"🎯 인플루언서 DB & 비용 산출",    icon:<Users size={12}/>},
  {id:"mvp",        label:"⚙️ MVP 핵심 기능 개발",           icon:<Code2 size={12}/>},
];

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

// Convert DB rows → Workstream[]
function buildWorkstreams(rows: DbTask[]): Workstream[] {
  return WS_META.map(meta => ({
    id: meta.id,
    label: meta.label,
    icon: meta.icon,
    color: meta.id,
    tasks: rows
      .filter(r => r.workstream_id === meta.id)
      .map(r => ({
        id: r.id,
        name: r.name,
        start: r.start_date,
        end: r.end_date,
        status: r.status,
        priority: r.priority,
        note: r.note ?? undefined,
      })),
  }));
}

export default function GanttTower() {
  const [ws, setWs] = useState<Workstream[]>([]);
  const [open, setOpen] = useState<Record<string,boolean>>(Object.fromEntries(WS_META.map(w=>[w.id,true])));
  const [kpis, setKpis] = useState<{id:string;label:string;current:number;target:number;unit:string;color:string}[]>([]);
  const [editK, setEditK] = useState<string|null>(null);
  const [kInp, setKInp]   = useState("");
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState<string>("");

  // ─── Fetch from Supabase ─────────────────────────
  const fetchAll = useCallback(async () => {
    const [{ data: taskRows }, { data: kpiRows }] = await Promise.all([
      supabase.from("tasks").select("*").order("id"),
      supabase.from("kpis").select("*").order("id"),
    ]);
    if (taskRows) setWs(buildWorkstreams(taskRows as DbTask[]));
    if (kpiRows) setKpis((kpiRows as DbKpi[]).map(k => ({
      id: k.id, label: k.label, current: Number(k.current_value),
      target: Number(k.target_value), unit: k.unit, color: k.color,
    })));
    setLoading(false);
    setSynced(new Date().toLocaleTimeString("ko-KR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
  }, []);

  // ─── Initial load + Realtime subscription ────────
  useEffect(() => {
    fetchAll();

    const taskSub = supabase
      .channel("tasks-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
        fetchAll();
      })
      .subscribe();

    const kpiSub = supabase
      .channel("kpis-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "kpis" }, () => {
        fetchAll();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(taskSub);
      supabase.removeChannel(kpiSub);
    };
  }, [fetchAll]);

  // ─── Cycle task status → write to Supabase ───────
  const cycleStatus = async (wsId: string, taskId: string) => {
    // Find current status
    const task = ws.find(w=>w.id===wsId)?.tasks.find(t=>t.id===taskId);
    if (!task) return;
    const newStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(task.status)+1)%STATUS_CYCLE.length];

    // Optimistic update
    setWs(prev=>prev.map(w=>{
      if(w.id!==wsId)return w;
      return{...w,tasks:w.tasks.map(t=>{
        if(t.id!==taskId)return t;
        return{...t,status:newStatus};
      })};
    }));

    // Persist to Supabase
    await supabase.from("tasks").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", taskId);
  };

  // ─── Save KPI → write to Supabase ────────────────
  const saveKpi = async (id: string) => {
    const v = parseInt(kInp);
    if (!isNaN(v)) {
      setKpis(p=>p.map(k=>k.id===id?{...k,current:v}:k));
      await supabase.from("kpis").update({ current_value: v, updated_at: new Date().toISOString() }).eq("id", id);
    }
    setEditK(null); setKInp("");
  };

  const todayX = toX(todayStr);
  const allT = ws.flatMap(w=>w.tasks);
  const doneN = allT.filter(t=>t.status==="done").length;
  const actN  = allT.filter(t=>t.status==="active").length;

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fafc",fontFamily:"-apple-system,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <RefreshCw size={24} style={{animation:"spin 1s linear infinite",color:"#4f46e5"}}/>
        <div style={{marginTop:8,fontSize:12,color:"#64748b"}}>Supabase에서 데이터 로딩 중...</div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

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
            <div style={{fontSize:9,color:"#94a3b8",display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end"}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"#10b981",display:"inline-block"}}/>
              <span>LIVE</span>
              <span style={{color:"#cbd5e1"}}>·</span>
              <span>{synced}</span>
            </div>
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
          <span style={{fontSize:9,color:"#cbd5e1",marginLeft:"auto"}}>● 클릭 → 상태 변경 | KPI 숫자 클릭 → 수정 | Supabase Realtime 연동</span>
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
                  <div style={{position:"absolute",top:0,bottom:0,left:0,background:"rgba(255,255,255,.45)",borderRadius:2,width:(w.tasks.length?dCnt/w.tasks.length*100:0)+"%",transition:"width .4s"}}/>
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
            {label:"달성률",     val:(allT.length?Math.round(doneN/allT.length*100):0)+"%",color:"#4f46e5",icon:<TrendingUp size={13}/>},
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
          Gen-da Control Tower · Sora (10Y PCO) · 1,000 Beta Goal · Supabase Realtime 🟢
        </div>
      </main>
    </div>
  );
}
