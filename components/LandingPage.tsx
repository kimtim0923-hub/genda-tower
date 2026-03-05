"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { translations, LOCALES, type Locale, type Translation } from "@/lib/i18n";

// ─── 색상 토큰 ────────────────────────────────────────────────────
const C = {
  primary:   "#4f46e5",
  primaryDk: "#4338ca",
  primaryLt: "#eef2ff",
  accent:    "#06b6d4",
  success:   "#10b981",
  gray50:    "#f8fafc",
  gray100:   "#f1f5f9",
  gray200:   "#e2e8f0",
  gray400:   "#94a3b8",
  gray600:   "#475569",
  gray800:   "#1e293b",
  gray900:   "#0f172a",
  white:     "#ffffff",
};

// ─── 계산 로직 (베뉴 큐레이션 알고리즘 MD 기반) ─────────────────
function calcEstimate(region: string, budget: string, theme: string) {
  const budgetMap: Record<string, { venue: [number,number]; infl: [number,number] }> = {
    "0": { venue:[300,800],   infl:[200,690]    }, // $5k 이하
    "1": { venue:[800,2500],  infl:[690,1380]   }, // $5k~15k
    "2": { venue:[2500,6000], infl:[1380,2300]  }, // $15k~30k
    "3": { venue:[6000,15000],infl:[2300,5750]  }, // $30k+
  };
  const idx = ["0","1","2","3"].indexOf(budget);
  const b = budgetMap[idx >= 0 ? String(idx) : "1"];
  const venue = Math.round((b.venue[0]+b.venue[1])/2);
  const infl  = Math.round((b.infl[0]+b.infl[1])/2);
  const asset = 800;
  return { venue, infl, asset, total: venue+infl+asset };
}

// ─── 공통 컴포넌트 ────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display:"inline-block", background:C.primaryLt, color:C.primary,
      fontSize:11, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase",
      padding:"4px 12px", borderRadius:99, marginBottom:12,
    }}>
      {children}
    </span>
  );
}

function SectionWrap({ children, bg, id }: { children: React.ReactNode; bg?: string; id?: string }) {
  return (
    <section id={id} style={{ background:bg||C.white, padding:"80px 0" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
        {children}
      </div>
    </section>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────
function Navbar({ t, locale, setLocale }: { t: Translation; locale: Locale; setLocale:(l:Locale)=>void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cur = LOCALES.find(l => l.code === locale)!;

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      background: scrolled ? "rgba(255,255,255,.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.gray200}` : "none",
      transition:"all .2s",
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>

        {/* 로고 */}
        <a href="#" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{
            width:32, height:32, background:C.primary, borderRadius:8,
            display:"flex", alignItems:"center", justifyContent:"center",
            color:C.white, fontWeight:900, fontSize:14,
          }}>G</div>
          <span style={{ fontSize:18, fontWeight:900, color:C.gray900 }}>Gen-da</span>
        </a>

        {/* 데스크톱 메뉴 */}
        <div style={{ display:"flex", alignItems:"center", gap:28 }}>
          {[t.nav.features, t.nav.pricing, t.nav.about].map((item, i) => (
            <a key={i} href={["#features","#pricing","#about"][i]}
              style={{ fontSize:14, color:C.gray600, textDecoration:"none", fontWeight:500 }}
              onMouseEnter={e=>(e.currentTarget.style.color=C.primary)}
              onMouseLeave={e=>(e.currentTarget.style.color=C.gray600)}
            >{item}</a>
          ))}

          {/* 관제탑 링크 */}
          <Link href="/dashboard" style={{
            fontSize:12, color:C.gray600, textDecoration:"none", fontWeight:600,
            padding:"5px 10px", borderRadius:7, background:C.gray100, border:`1px solid ${C.gray200}`,
          }}>
            🗂 관제탑
          </Link>

          {/* 언어 선택 드롭다운 */}
          <div style={{ position:"relative" }}>
            <button onClick={()=>setLangOpen(!langOpen)}
              style={{
                display:"flex", alignItems:"center", gap:5,
                background:C.gray100, border:"none", borderRadius:8,
                padding:"6px 10px", cursor:"pointer", fontSize:13, fontWeight:600, color:C.gray800,
              } as React.CSSProperties}>
              <span>{cur.flag}</span>
              <span>{cur.label}</span>
              <span style={{ fontSize:10 }}>▾</span>
            </button>
            {langOpen && (
              <div style={{
                position:"absolute", top:"calc(100% + 6px)", right:0,
                background:C.white, border:`1px solid ${C.gray200}`,
                borderRadius:10, boxShadow:"0 8px 24px rgba(0,0,0,.1)",
                overflow:"hidden", minWidth:130, zIndex:200,
              }}>
                {LOCALES.map(l => (
                  <button key={l.code}
                    onClick={()=>{ setLocale(l.code); setLangOpen(false); }}
                    style={{
                      display:"flex", alignItems:"center", gap:8,
                      width:"100%", padding:"9px 14px", border:"none",
                      background: l.code===locale ? C.primaryLt : C.white,
                      cursor:"pointer", fontSize:13, fontWeight:l.code===locale?700:400,
                      color: l.code===locale ? C.primary : C.gray800,
                      textAlign:"left",
                    } as React.CSSProperties}>
                    <span>{l.flag}</span><span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a href="#beta" style={{
            background:C.primary, color:C.white,
            padding:"9px 20px", borderRadius:8, fontSize:14, fontWeight:700,
            textDecoration:"none", transition:"background .15s",
          }}
            onMouseEnter={e=>(e.currentTarget.style.background=C.primaryDk)}
            onMouseLeave={e=>(e.currentTarget.style.background=C.primary)}
          >{t.nav.cta}</a>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────
function Hero({ t }: { t: Translation }) {
  return (
    <section style={{
      background:`linear-gradient(150deg, ${C.primaryLt} 0%, ${C.white} 60%)`,
      padding:"140px 0 80px", borderBottom:`1px solid ${C.gray100}`,
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", textAlign:"center" }}>
        {/* 뱃지 */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:6,
          background:C.white, border:`1px solid ${C.gray200}`,
          borderRadius:99, padding:"6px 16px", fontSize:13, fontWeight:600,
          color:C.primary, marginBottom:28, boxShadow:"0 2px 8px rgba(79,70,229,.1)",
        }}>
          {t.hero.badge}
        </div>

        {/* 헤드라인 */}
        <h1 style={{
          fontSize:"clamp(36px,5vw,64px)", fontWeight:900,
          lineHeight:1.15, color:C.gray900, marginBottom:0,
          letterSpacing:"-.02em",
        }}>
          {t.hero.headline}<br/>
          <span style={{
            background:`linear-gradient(135deg, ${C.primary}, ${C.accent})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>
            {t.hero.headlineAccent}
          </span>
        </h1>

        {/* 서브헤드 */}
        <p style={{
          fontSize:"clamp(15px,2vw,19px)", color:C.gray600,
          maxWidth:640, margin:"24px auto 0", lineHeight:1.7,
        }}>
          {t.hero.subheadline}
        </p>

        {/* CTA 버튼 */}
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:36, flexWrap:"wrap" }}>
          <a href="#beta" style={{
            background:C.primary, color:C.white,
            padding:"14px 28px", borderRadius:10, fontSize:15, fontWeight:700,
            textDecoration:"none", boxShadow:`0 4px 16px ${C.primary}40`,
            transition:"all .15s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background=C.primaryDk; e.currentTarget.style.transform="translateY(-1px)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=C.primary; e.currentTarget.style.transform="translateY(0)"; }}
          >{t.hero.ctaPrimary}</a>
          <a href="#demo" style={{
            background:C.white, color:C.primary,
            padding:"14px 28px", borderRadius:10, fontSize:15, fontWeight:700,
            textDecoration:"none", border:`2px solid ${C.primaryLt}`,
            transition:"all .15s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.primary; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.primaryLt; }}
          >{t.hero.ctaSecondary}</a>
        </div>

        {/* 신뢰 라인 */}
        <p style={{ fontSize:12, color:C.gray400, marginTop:20 }}>
          ✦ {t.hero.trustLine}
        </p>

        {/* 통계 */}
        <div style={{
          display:"flex", justifyContent:"center", gap:48, marginTop:48,
          paddingTop:40, borderTop:`1px solid ${C.gray200}`, flexWrap:"wrap",
        }}>
          {t.hero.stats.map((s, i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:36, fontWeight:900, color:C.primary, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:13, color:C.gray600, marginTop:6 } as React.CSSProperties}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pain Section ─────────────────────────────────────────────────
function PainSection({ t }: { t: Translation }) {
  return (
    <SectionWrap bg={C.gray50} id="about">
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <Tag>{t.pain.tag}</Tag>
        <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, color:C.gray900, marginBottom:12 }}>
          {t.pain.headline}
        </h2>
        <p style={{ fontSize:16, color:C.gray600, maxWidth:540, margin:"0 auto" }}>
          {t.pain.subheadline}
        </p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
        {t.pain.items.map((item, i) => (
          <div key={i} style={{
            background:C.white, borderRadius:16, padding:"28px 24px",
            border:`1px solid ${C.gray200}`, boxShadow:"0 1px 4px rgba(0,0,0,.05)",
          }}>
            <div style={{ fontSize:36, marginBottom:14 }}>{item.emoji}</div>
            <h3 style={{ fontSize:18, fontWeight:800, color:C.gray900, marginBottom:8 }}>{item.title}</h3>
            <p style={{ fontSize:14, color:C.gray600, lineHeight:1.65 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

// ─── Features ─────────────────────────────────────────────────────
function FeaturesSection({ t }: { t: Translation }) {
  return (
    <SectionWrap id="features">
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <Tag>{t.features.tag}</Tag>
        <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, color:C.gray900 }}>
          {t.features.headline}
        </h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
        {t.features.items.map((item, i) => (
          <div key={i} style={{
            borderRadius:16, padding:"28px 22px",
            background: i===0 ? `linear-gradient(135deg,${C.primaryLt},${C.white})` : C.gray50,
            border:`1.5px solid ${i===0 ? C.primary+"30" : C.gray200}`,
            position:"relative", overflow:"hidden",
          }}>
            {item.badge && (
              <span style={{
                position:"absolute", top:14, right:14,
                background:C.primary, color:C.white,
                fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:99,
              }}>{item.badge}</span>
            )}
            <div style={{ fontSize:32, marginBottom:14 }}>{item.icon}</div>
            <h3 style={{ fontSize:16, fontWeight:800, color:C.gray900, marginBottom:8 }}>{item.title}</h3>
            <p style={{ fontSize:13, color:C.gray600, lineHeight:1.65 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

// ─── Aha Moment (즉시 견적 계산기) ────────────────────────────────
function AhaMoment({ t }: { t: Translation }) {
  const f = t.ahaMoment.form;
  const r = t.ahaMoment.result;

  const [region,  setRegion]  = useState("0");
  const [budget,  setBudget]  = useState("1");
  const [theme,   setTheme]   = useState("0");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<ReturnType<typeof calcEstimate>|null>(null);

  const handleCalc = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(calcEstimate(region, budget, theme));
      setLoading(false);
    }, 1400);
  };

  const fmt = (n: number) => "$" + n.toLocaleString();

  const selectStyle: React.CSSProperties = {
    width:"100%", padding:"11px 14px", borderRadius:8,
    border:`1.5px solid ${C.gray200}`, fontSize:14, color:C.gray800,
    background:C.white, outline:"none", cursor:"pointer",
    appearance:"auto",
  };

  return (
    <SectionWrap bg={`linear-gradient(135deg,${C.primary}08,${C.accent}08)`} id="demo">
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <Tag>{t.ahaMoment.tag}</Tag>
        <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, color:C.gray900, marginBottom:10 }}>
          {t.ahaMoment.headline}
        </h2>
        <p style={{ fontSize:16, color:C.gray600 }}>{t.ahaMoment.subheadline}</p>
      </div>

      <div style={{
        background:C.white, borderRadius:20, padding:"40px",
        boxShadow:"0 8px 40px rgba(79,70,229,.1)", border:`1px solid ${C.gray200}`,
        maxWidth:800, margin:"0 auto",
      }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:24 }}>
          {/* 지역 */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:C.gray600, display:"block", marginBottom:6 }}>
              {f.region}
            </label>
            <select value={region} onChange={e=>setRegion(e.target.value)} style={selectStyle}>
              {f.regionOptions.map((o,i)=><option key={i} value={String(i)}>{o}</option>)}
            </select>
          </div>
          {/* 예산 */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:C.gray600, display:"block", marginBottom:6 }}>
              {f.budget}
            </label>
            <select value={budget} onChange={e=>setBudget(e.target.value)} style={selectStyle}>
              {f.budgetOptions.map((o,i)=><option key={i} value={String(i)}>{o}</option>)}
            </select>
          </div>
          {/* 테마 */}
          <div>
            <label style={{ fontSize:12, fontWeight:700, color:C.gray600, display:"block", marginBottom:6 }}>
              {f.theme}
            </label>
            <select value={theme} onChange={e=>setTheme(e.target.value)} style={selectStyle}>
              {f.themeOptions.map((o,i)=><option key={i} value={String(i)}>{o}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleCalc} disabled={loading}
          style={{
            width:"100%", padding:"14px", borderRadius:10,
            background: loading ? C.gray400 : C.primary,
            color:C.white, border:"none", cursor: loading?"not-allowed":"pointer",
            fontSize:15, fontWeight:700, transition:"background .15s",
          }}>
          {loading ? (
            <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <span style={{ display:"inline-block", animation:"spin 1s linear infinite",
                width:14,height:14,border:"2px solid rgba(255,255,255,.3)",
                borderTopColor:C.white,borderRadius:"50%" }}/>
              {f.calculating}
            </span>
          ) : f.cta}
        </button>

        {/* 결과 */}
        {result && (
          <div style={{ marginTop:28, animation:"fadeIn .4s ease" }}>
            <div style={{
              display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
              gap:12, marginBottom:16,
            }}>
              {[
                { label:r.venueTitle,  val:fmt(result.venue), color:"#4f46e5" },
                { label:r.inflTitle,   val:fmt(result.infl),  color:"#7c3aed" },
                { label:r.assetTitle,  val:fmt(result.asset), color:"#0284c7" },
                { label:r.totalTitle,  val:fmt(result.total), color:"#059669" },
              ].map((item,i) => (
                <div key={i} style={{
                  background:C.gray50, borderRadius:12, padding:"16px",
                  border:`1.5px solid ${item.color}20`,
                  borderLeft:`3px solid ${item.color}`,
                }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.gray600, textTransform:"uppercase", letterSpacing:".04em", marginBottom:4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize:22, fontWeight:900, color:item.color }}>{item.val}</div>
                </div>
              ))}
            </div>

            <button style={{
              width:"100%", padding:"13px",
              background:`linear-gradient(135deg,${C.primary},${C.accent})`,
              color:C.white, border:"none", borderRadius:10,
              fontSize:14, fontWeight:700, cursor:"pointer",
            }}>
              {r.unlockCta}
            </button>
            <p style={{ fontSize:11, color:C.gray400, textAlign:"center", marginTop:8 }}>
              {r.disclaimer}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </SectionWrap>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────
function PricingSection({ t }: { t: Translation }) {
  return (
    <SectionWrap bg={C.gray50} id="pricing">
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <Tag>{t.pricing.tag}</Tag>
        <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:900, color:C.gray900, marginBottom:10 }}>
          {t.pricing.headline}
        </h2>
        <p style={{ fontSize:16, color:C.gray600 }}>{t.pricing.subheadline}</p>
      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
        gap:20, alignItems:"start",
      }}>
        {t.pricing.plans.map((plan, i) => (
          <div key={i} style={{
            background:C.white, borderRadius:20, padding:"32px 28px",
            border: plan.highlight ? `2px solid ${C.primary}` : `1px solid ${C.gray200}`,
            boxShadow: plan.highlight ? `0 8px 40px ${C.primary}20` : "0 1px 4px rgba(0,0,0,.05)",
            position:"relative", overflow:"hidden",
          }}>
            {plan.highlight && (
              <div style={{
                position:"absolute", top:0, left:0, right:0,
                height:3, background:`linear-gradient(90deg,${C.primary},${C.accent})`,
              }}/>
            )}
            {plan.badge && (
              <span style={{
                position:"absolute", top:16, right:16,
                background:C.primary, color:C.white,
                fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:99,
              }}>{plan.badge}</span>
            )}

            <div style={{ marginBottom:6 }}>
              <span style={{
                fontSize:10, fontWeight:700, color:C.gray400,
                textTransform:"uppercase", letterSpacing:".06em",
              }}>{plan.type}</span>
            </div>
            <h3 style={{ fontSize:22, fontWeight:900, color:C.gray900, marginBottom:12 }}>{plan.name}</h3>
            <div style={{ display:"flex", alignItems:"baseline", gap:2, marginBottom:24 }}>
              <span style={{ fontSize:38, fontWeight:900, color: plan.highlight ? C.primary : C.gray900 }}>
                {plan.price}
              </span>
              <span style={{ fontSize:14, color:C.gray600 }}>{plan.period}</span>
            </div>

            <ul style={{ listStyle:"none", marginBottom:28, display:"flex", flexDirection:"column", gap:8 }}>
              {plan.features.map((f, j) => (
                <li key={j} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:C.gray800 }}>
                  <span style={{ color:C.success, flexShrink:0, marginTop:1 }}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <a href="#beta" style={{
              display:"block", textAlign:"center",
              padding:"12px", borderRadius:10, fontSize:14, fontWeight:700,
              textDecoration:"none", transition:"all .15s",
              background: plan.highlight ? C.primary : "transparent",
              color: plan.highlight ? C.white : C.primary,
              border: plan.highlight ? "none" : `2px solid ${C.primary}`,
            }}
              onMouseEnter={e=>{
                e.currentTarget.style.background = plan.highlight ? C.primaryDk : C.primaryLt;
              }}
              onMouseLeave={e=>{
                e.currentTarget.style.background = plan.highlight ? C.primary : "transparent";
              }}
            >{plan.cta}</a>
          </div>
        ))}
      </div>

      <p style={{ textAlign:"center", fontSize:13, color:C.gray600, marginTop:28 }}>
        {t.pricing.note}
      </p>
    </SectionWrap>
  );
}

// ─── Beta Form ────────────────────────────────────────────────────
function BetaFormSection({ t }: { t: Translation }) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [company, setCompany] = useState("");
  const [done,    setDone]    = useState(false);
  const [count]               = useState(47); // 실제 Supabase 연동 시 실시간 카운트

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: Supabase / n8n webhook 연동
    setDone(true);
  };

  const inputStyle: React.CSSProperties = {
    width:"100%", padding:"12px 16px", borderRadius:9,
    border:`1.5px solid ${C.gray200}`, fontSize:14,
    outline:"none", transition:"border-color .15s", boxSizing:"border-box",
    fontFamily:"inherit",
  };

  return (
    <section id="beta" style={{
      background:`linear-gradient(135deg,${C.primary},${C.primaryDk})`,
      padding:"80px 0",
    }}>
      <div style={{ maxWidth:560, margin:"0 auto", padding:"0 24px", textAlign:"center" }}>
        <span style={{
          display:"inline-block", background:"rgba(255,255,255,.15)",
          color:C.white, fontSize:11, fontWeight:700,
          letterSpacing:".06em", textTransform:"uppercase",
          padding:"4px 12px", borderRadius:99, marginBottom:16,
        }}>{t.betaForm.tag}</span>

        <h2 style={{ fontSize:"clamp(24px,4vw,40px)", fontWeight:900, color:C.white, marginBottom:12 }}>
          {t.betaForm.headline}
        </h2>
        <p style={{ fontSize:15, color:"rgba(255,255,255,.8)", marginBottom:8 }}>
          {t.betaForm.subheadline}
        </p>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.6)", marginBottom:32 }}>
          {count} {t.betaForm.counter}
        </p>

        {done ? (
          <div style={{
            background:"rgba(255,255,255,.15)", borderRadius:16,
            padding:"28px", color:C.white, fontSize:16, fontWeight:600,
          }}>
            {t.betaForm.success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <input value={name} onChange={e=>setName(e.target.value)}
              placeholder={t.betaForm.namePlaceholder}
              style={inputStyle}
              onFocus={e=>e.target.style.borderColor=C.primary}
              onBlur={e=>e.target.style.borderColor=C.gray200}
            />
            <input value={email} onChange={e=>setEmail(e.target.value)}
              type="email" required placeholder={t.betaForm.emailPlaceholder}
              style={inputStyle}
              onFocus={e=>e.target.style.borderColor=C.primary}
              onBlur={e=>e.target.style.borderColor=C.gray200}
            />
            <input value={company} onChange={e=>setCompany(e.target.value)}
              placeholder={t.betaForm.companyPlaceholder}
              style={inputStyle}
              onFocus={e=>e.target.style.borderColor=C.primary}
              onBlur={e=>e.target.style.borderColor=C.gray200}
            />
            <button type="submit" style={{
              padding:"14px", borderRadius:10, border:"none",
              background:C.white, color:C.primary,
              fontSize:15, fontWeight:800, cursor:"pointer",
              transition:"all .15s", marginTop:4,
            }}
              onMouseEnter={e=>e.currentTarget.style.background=C.gray100}
              onMouseLeave={e=>e.currentTarget.style.background=C.white}
            >{t.betaForm.cta}</button>
            <p style={{ fontSize:11, color:"rgba(255,255,255,.5)", marginTop:4 }}>
              {t.betaForm.privacy}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────
function Footer({ t }: { t: Translation }) {
  return (
    <footer style={{
      background:C.gray900, color:C.gray400,
      padding:"40px 0", textAlign:"center",
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:16 }}>
          <div style={{
            width:28, height:28, background:C.primary, borderRadius:7,
            display:"flex", alignItems:"center", justifyContent:"center",
            color:C.white, fontWeight:900, fontSize:13,
          }}>G</div>
          <span style={{ color:C.white, fontWeight:700, fontSize:15 }}>Gen-da</span>
        </div>
        <p style={{ fontSize:13, marginBottom:20 }}>{t.footer.tagline}</p>
        <div style={{ display:"flex", justifyContent:"center", gap:24, marginBottom:20 }}>
          {t.footer.links.map((l, i) => (
            <a key={i} href={l.href}
              style={{ fontSize:13, color:C.gray400, textDecoration:"none" }}
              onMouseEnter={e=>e.currentTarget.style.color=C.white}
              onMouseLeave={e=>e.currentTarget.style.color=C.gray400}
            >{l.label}</a>
          ))}
        </div>
        <p style={{ fontSize:12 }}>{t.footer.copyright}</p>
      </div>
    </footer>
  );
}

// ─── 메인 랜딩페이지 ─────────────────────────────────────────────
export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("ko");
  const t = translations[locale];

  return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <Navbar t={t} locale={locale} setLocale={setLocale} />
      <Hero t={t} />
      <PainSection t={t} />
      <FeaturesSection t={t} />
      <AhaMoment t={t} />
      <PricingSection t={t} />
      <BetaFormSection t={t} />
      <Footer t={t} />
    </div>
  );
}
