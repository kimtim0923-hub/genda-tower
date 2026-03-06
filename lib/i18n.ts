// ============================================================
// Gen-da i18n 번역 로직
// 지원 언어: ko (한국어) → en (영어) → de (독일어) → es (스페인어)
// 사용법: const t = useTranslation(); t.hero.headline
// ============================================================

export type Locale = "ko" | "en" | "de" | "es";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export interface Translation {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    features: string;
    pricing: string;
    report: string;
    about: string;
    cta: string;
  };
  hero: {
    badge: string;
    headline: string;
    headlineAccent: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustLine: string;
    stats: { value: string; label: string }[];
  };
  pain: {
    tag: string;
    headline: string;
    subheadline: string;
    items: { emoji: string; title: string; desc: string }[];
  };
  solution: {
    tag: string;
    headline: string;
    subheadline: string;
  };
  features: {
    tag: string;
    headline: string;
    items: { icon: string; title: string; desc: string; badge?: string }[];
  };
  ahaMoment: {
    tag: string;
    headline: string;
    subheadline: string;
    form: {
      region: string;
      regionOptions: string[];
      budget: string;
      budgetOptions: string[];
      theme: string;
      themeOptions: string[];
      cta: string;
      calculating: string;
    };
    result: {
      venueTitle: string;
      inflTitle: string;
      assetTitle: string;
      totalTitle: string;
      unlockCta: string;
      disclaimer: string;
    };
  };
  pricing: {
    tag: string;
    headline: string;
    subheadline: string;
    plans: {
      name: string;
      type: string;
      price: string;
      period: string;
      highlight?: boolean;
      badge?: string;
      features: string[];
      cta: string;
    }[];
    note: string;
  };
  betaForm: {
    tag: string;
    headline: string;
    subheadline: string;
    emailPlaceholder: string;
    namePlaceholder: string;
    companyPlaceholder: string;
    cta: string;
    success: string;
    privacy: string;
    counter: string;
  };
  weeklyReport: {
    tag: string;
    headline: string;
    subheadline: string;
    thisWeek: string;
    popups: { brand: string; category: string; location: string; scale: string; takeaway: string }[];
    discoveryCta: string;
    discoveryDesc: string;
    sampleLabel: string;
  };
  footer: {
    tagline: string;
    links: { label: string; href: string }[];
    copyright: string;
  };
}

// ─── 한국어 (기준 언어) ───────────────────────────────────────
const ko: Translation = {
  meta: {
    title: "Gen-da | 한국 K-팝업, 수 시간 만에",
    description: "글로벌 스몰 브랜드의 한국 팝업을 위한 원스톱 자동화 플랫폼. 베뉴 예약부터 인플루언서 매칭까지.",
  },
  nav: {
    features: "기능",
    pricing: "요금제",
    report: "리포트",
    about: "소개",
    cta: "베타 신청",
  },
  hero: {
    badge: "🚀 베타 사전등록 오픈",
    headline: "한국 K-팝업,",
    headlineAccent: "수일이 아닌 수 시간 만에.",
    subheadline: "해외 브랜드가 한국에서 팝업을 열 때 드는 20% 대행비와 수일의 리서치를 AI로 끝냅니다. 베뉴 견적부터 인플루언서 매칭까지, 한 화면에서.",
    ctaPrimary: "무료로 베타 신청하기 →",
    ctaSecondary: "데모 견적 체험하기",
    trustLine: "10년 차 PCO 소라 대표가 직접 만든 플랫폼",
    stats: [
      { value: "90%", label: "리서치 시간 단축" },
      { value: "1/3", label: "에이전시 대비 비용" },
      { value: "5,000+", label: "검증된 베뉴 DB" },
    ],
  },
  pain: {
    tag: "기존 방식의 문제",
    headline: "한국 팝업, 왜 이렇게 어려운가요?",
    subheadline: "해외 브랜드가 한국 팝업을 준비할 때 겪는 3가지 현실",
    items: [
      { emoji: "💸", title: "20% 대행 수수료", desc: "에이전시 없이는 불가능하고, 있으면 전체 예산의 20%가 수수료로 빠져나갑니다." },
      { emoji: "⏳", title: "수일의 리서치", desc: "베뉴 하나 찾는 데 수일, 인플루언서 섭외에 또 수일. 런칭 전에 지칩니다." },
      { emoji: "🌐", title: "언어·문화 장벽", desc: "한국 현지 정보가 없으면 트렌디한 공간도, 팔리는 마케팅도 만들기 어렵습니다." },
    ],
  },
  solution: {
    tag: "Gen-da의 해법",
    headline: "AI가 10년 차 PCO의 노하우를 대신합니다",
    subheadline: "공공 API(KTO/BTO)와 실무 DB를 결합해 즉시 실행 가능한 견적을 만들어냅니다.",
  },
  features: {
    tag: "핵심 기능",
    headline: "원스톱으로 끝나는 4가지",
    items: [
      { icon: "🏢", title: "베뉴 AI 큐레이션", desc: "지역·예산·브랜드 바이브를 입력하면 KTO/BTO 공공 데이터 기반 Top 3 베뉴를 즉시 추천합니다.", badge: "핵심" },
      { icon: "🎯", title: "인플루언서 매칭", desc: "Nano~Macro 5단계 티어로 브랜드 핏에 맞는 인플루언서를 자동 매칭하고 예상 비용을 투명하게 산출합니다." },
      { icon: "✨", title: "AI 마케팅 에셋", desc: "한국 MZ세대 감성에 맞는 SNS 카피, 이미지 프롬프트, 릴스 스크립트를 자동 생성합니다." },
      { icon: "🤝", title: "팀 협업 보드", desc: "해외 본사와 한국 현지 스태프가 하나의 화면에서 타임라인을 공유하고 실시간으로 소통합니다." },
    ],
  },
  ahaMoment: {
    tag: "Aha Moment",
    headline: "지금 바로 견적을 받아보세요",
    subheadline: "조건 입력 후 3초 안에 베뉴 견적 + 인플루언서 비용이 산출됩니다",
    form: {
      region: "지역 선택",
      regionOptions: ["부산 (Busan)", "서울 (Seoul)", "제주 (Jeju)", "기타 지방"],
      budget: "총 예산 (USD)",
      budgetOptions: ["$5,000 이하", "$5,000–$15,000", "$15,000–$30,000", "$30,000 이상"],
      theme: "팝업 테마",
      themeOptions: ["패션 / 뷰티", "F&B / 푸드", "라이프스타일", "아트 / 전시"],
      cta: "무료 견적 산출하기",
      calculating: "AI 분석 중...",
    },
    result: {
      venueTitle: "추천 베뉴 견적",
      inflTitle: "인플루언서 예상 비용",
      assetTitle: "마케팅 에셋",
      totalTitle: "예상 총 비용",
      unlockCta: "전체 Proposal 언락하기 (1 크레딧)",
      disclaimer: "* 위 견적은 예시입니다. 실제 Proposal은 1 크레딧으로 언락됩니다.",
    },
  },
  pricing: {
    tag: "요금제",
    headline: "필요한 만큼만 지불하세요",
    subheadline: "정부 예산에 의존하지 않는 순수 B2B 크레딧 모델",
    plans: [
      {
        name: "Discovery",
        type: "구독",
        price: "$99",
        period: "/ 월",
        features: [
          "베뉴 AI 추천 열람 (월 10회)",
          "한국 팝업 트렌드 리포트",
          "인플루언서 티어별 단가 확인",
          "이메일 지원",
        ],
        cta: "무료로 시작",
      },
      {
        name: "Launch",
        type: "크레딧",
        price: "$499",
        period: "/ 1회",
        highlight: true,
        badge: "가장 인기",
        features: [
          "베뉴 Top 3 큐레이션 패키지",
          "인플루언서 후보 3인 + 예상 비용",
          "AI 마케팅 에셋 3종",
          "실행형 Proposal 문서",
          "우선 이메일 지원",
        ],
        cta: "Launch 크레딧 구매",
      },
      {
        name: "Full Setup",
        type: "크레딧",
        price: "$1,500",
        period: "/ 1회",
        features: [
          "베뉴 확정 + 계약 지원",
          "인플루언서 최종 매칭 + 계약 대행",
          "마케팅 에셋 풀패키지",
          "팀 협업 보드 개설",
          "전담 매니저 배정",
        ],
        cta: "Full Setup 신청",
      },
    ],
    note: "💡 에이전시 대행비(전체 예산의 20%) 대비 최대 1/5 수준의 비용",
  },
  betaForm: {
    tag: "베타 사전등록",
    headline: "1,000명 베타 유저를 모집합니다",
    subheadline: "베타 기간 동안 Launch 크레딧을 50% 할인된 가격($249)에 제공합니다",
    emailPlaceholder: "이메일 주소",
    namePlaceholder: "담당자 이름",
    companyPlaceholder: "브랜드 / 회사명",
    cta: "베타 신청하기 (무료)",
    success: "🎉 신청 완료! 베타 오픈 시 가장 먼저 연락드릴게요.",
    privacy: "스팸 없음. 언제든 구독 해지 가능.",
    counter: "명이 이미 신청했습니다",
  },
  weeklyReport: {
    tag: "K-Popup Intelligence",
    headline: "이번 주 서울 팝업 트렌드",
    subheadline: "매주 성수동·서울 팝업을 분석해 글로벌 마케터에게 실행 가능한 인사이트를 제공합니다",
    thisWeek: "2026년 3월 1주차 — 7건 분석 완료",
    popups: [
      { brand: "NikeSKIMS", category: "Sports × Fashion", location: "SCENE 성수", scale: "XL", takeaway: "글로벌 메가 브랜드가 성수동을 Tier-1 론칭 도시로 선택" },
      { brand: "BLACKPINK DEADLINE", category: "Entertainment", location: "무신사 성수", scale: "L", takeaway: "가챠머신 + 스탬프 랠리로 팬덤→커머스 전환" },
      { brand: "Samsung Galaxy S26", category: "Tech", location: "T Factory 성수", scale: "XL", takeaway: "N번째 방문객 전략으로 일일 FOMO 엔진 구축" },
    ],
    discoveryCta: "이번 주 리포트 맛보기 →",
    discoveryDesc: "매주 트렌드한 한국 팝업 심층 분석 + 스몰 브랜드 플레이북 포함",
    sampleLabel: "이번 주 하이라이트",
  },
  footer: {
    tagline: "한국 팝업의 새로운 기준, Gen-da",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Product Hunt", href: "#" },
      { label: "문의", href: "mailto:hello@gen-da.io" },
    ],
    copyright: "© 2026 Gen-da. Built by Sora (10Y PCO). All rights reserved.",
  },
};

// ─── 영어 ────────────────────────────────────────────────────────
const en: Translation = {
  meta: {
    title: "Gen-da | Launch a K-Popup in Hours, Not Days",
    description: "The one-stop automation platform for global brands launching K-popups in Korea.",
  },
  nav: {
    features: "Features",
    pricing: "Pricing",
    report: "Report",
    about: "About",
    cta: "Join Beta",
  },
  hero: {
    badge: "🚀 Beta Waitlist Now Open",
    headline: "Launch a K-Popup in Korea.",
    headlineAccent: "Hours, not weeks.",
    subheadline: "Cut the 20% agency fee and days of research. Gen-da uses AI to deliver venue quotes and influencer matches — instantly.",
    ctaPrimary: "Join the Beta for Free →",
    ctaSecondary: "Try a Demo Quote",
    trustLine: "Built by Sora, a 10-year MICE professional",
    stats: [
      { value: "90%", label: "Less research time" },
      { value: "1/3", label: "of agency costs" },
      { value: "5,000+", label: "verified venues" },
    ],
  },
  pain: {
    tag: "The Problem",
    headline: "Why is launching a K-Popup so hard?",
    subheadline: "3 real barriers global brands face when entering the Korean popup market",
    items: [
      { emoji: "💸", title: "20% Agency Fee", desc: "You can't do it without a local agency — and they take 20% of your entire budget." },
      { emoji: "⏳", title: "Weeks of Research", desc: "Finding one venue takes days. Sourcing influencers takes more days. You're exhausted before launch." },
      { emoji: "🌐", title: "Language & Culture Gap", desc: "Without local knowledge, you can't find the trendy spaces or create marketing that actually sells." },
    ],
  },
  solution: {
    tag: "The Gen-da Way",
    headline: "AI does what a 10-year PCO expert does",
    subheadline: "Combining public APIs (KTO/BTO) with real operational data to generate instantly actionable proposals.",
  },
  features: {
    tag: "Core Features",
    headline: "Everything in one place",
    items: [
      { icon: "🏢", title: "AI Venue Curation", desc: "Input region, budget, and brand vibe. Get Top 3 venues from KTO/BTO verified data — instantly.", badge: "Core" },
      { icon: "🎯", title: "Influencer Matching", desc: "5-tier matching from Nano to Macro. Transparent cost estimates with engagement-rate weighting." },
      { icon: "✨", title: "AI Marketing Assets", desc: "Auto-generate SNS copy, image prompts, and Reels scripts tuned for Korean Gen Z." },
      { icon: "🤝", title: "Team Collaboration", desc: "One board for global HQ and local Korean staff to share timelines and communicate in real-time." },
    ],
  },
  ahaMoment: {
    tag: "Aha Moment",
    headline: "Get your quote in 3 seconds",
    subheadline: "Enter your details and instantly see venue costs + influencer estimates",
    form: {
      region: "Select Region",
      regionOptions: ["Busan", "Seoul", "Jeju", "Other"],
      budget: "Total Budget (USD)",
      budgetOptions: ["Under $5,000", "$5,000–$15,000", "$15,000–$30,000", "$30,000+"],
      theme: "Popup Theme",
      themeOptions: ["Fashion / Beauty", "F&B / Food", "Lifestyle", "Art / Exhibition"],
      cta: "Generate Free Quote",
      calculating: "AI analyzing...",
    },
    result: {
      venueTitle: "Venue Estimate",
      inflTitle: "Influencer Budget",
      assetTitle: "Marketing Assets",
      totalTitle: "Total Estimate",
      unlockCta: "Unlock Full Proposal (1 Credit)",
      disclaimer: "* This is a sample estimate. Unlock the full Proposal with 1 credit.",
    },
  },
  pricing: {
    tag: "Pricing",
    headline: "Pay only for what you need",
    subheadline: "Pure B2B credit model — no government dependency",
    plans: [
      {
        name: "Discovery",
        type: "Subscription",
        price: "$99",
        period: "/ mo",
        features: [
          "AI venue recommendations (10/mo)",
          "Korea popup trend reports",
          "Influencer tier pricing access",
          "Email support",
        ],
        cta: "Start Free",
      },
      {
        name: "Launch",
        type: "Credit",
        price: "$499",
        period: "/ use",
        highlight: true,
        badge: "Most Popular",
        features: [
          "Top 3 venue curation package",
          "3 influencer candidates + estimates",
          "3 AI marketing assets",
          "Actionable Proposal document",
          "Priority email support",
        ],
        cta: "Buy Launch Credit",
      },
      {
        name: "Full Setup",
        type: "Credit",
        price: "$1,500",
        period: "/ use",
        features: [
          "Venue confirmation + contract support",
          "Final influencer match + contract",
          "Full marketing asset package",
          "Team collaboration board",
          "Dedicated account manager",
        ],
        cta: "Apply for Full Setup",
      },
    ],
    note: "💡 Up to 1/5 of typical agency fees (which run 20% of total budget)",
  },
  betaForm: {
    tag: "Beta Waitlist",
    headline: "We're recruiting 1,000 beta users",
    subheadline: "Beta users get Launch credit at 50% off ($249) during the beta period",
    emailPlaceholder: "Email address",
    namePlaceholder: "Your name",
    companyPlaceholder: "Brand / Company",
    cta: "Join Beta (Free)",
    success: "🎉 You're in! We'll reach out when beta launches.",
    privacy: "No spam. Unsubscribe anytime.",
    counter: "people have already joined",
  },
  weeklyReport: {
    tag: "K-Popup Intelligence",
    headline: "This Week's Seoul Popup Trends",
    subheadline: "Every week we analyze Seongsu & Seoul popups and deliver actionable insights for global marketers",
    thisWeek: "March 2026, Week 1 — 7 popups analyzed",
    popups: [
      { brand: "NikeSKIMS", category: "Sports × Fashion", location: "SCENE Seongsu", scale: "XL", takeaway: "Global mega-brand picks Seongsu as Tier-1 launch city" },
      { brand: "BLACKPINK DEADLINE", category: "Entertainment", location: "Musinsa Seongsu", scale: "L", takeaway: "Gacha + stamp rally converts fandom into commerce" },
      { brand: "Samsung Galaxy S26", category: "Tech", location: "T Factory Seongsu", scale: "XL", takeaway: "Numbered-visitor strategy builds daily FOMO engine" },
    ],
    discoveryCta: "Preview this week's report →",
    discoveryDesc: "Weekly trending K-popup deep analysis + small brand playbook included",
    sampleLabel: "This Week's Highlights",
  },
  footer: {
    tagline: "The new standard for K-Popups — Gen-da",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Product Hunt", href: "#" },
      { label: "Contact", href: "mailto:hello@gen-da.io" },
    ],
    copyright: "© 2026 Gen-da. Built by Sora (10Y PCO). All rights reserved.",
  },
};

// ─── 독일어 ──────────────────────────────────────────────────────
const de: Translation = {
  meta: {
    title: "Gen-da | K-Popup in Korea — in Stunden statt Wochen",
    description: "Die All-in-One-Automatisierungsplattform für globale Marken, die K-Popups in Korea launchen.",
  },
  nav: {
    features: "Funktionen",
    pricing: "Preise",
    report: "Bericht",
    about: "Über uns",
    cta: "Beta beitreten",
  },
  hero: {
    badge: "🚀 Beta-Warteliste jetzt offen",
    headline: "K-Popup in Korea launchen.",
    headlineAccent: "Stunden, nicht Wochen.",
    subheadline: "Schluss mit 20% Agenturgebühren und tagelanger Recherche. Gen-da liefert Venue-Angebote und Influencer-Matches per KI — sofort.",
    ctaPrimary: "Kostenlos zur Beta anmelden →",
    ctaSecondary: "Demo-Angebot ausprobieren",
    trustLine: "Entwickelt von Sora, 10 Jahre MICE-Expertin",
    stats: [
      { value: "90%", label: "weniger Recherchezeit" },
      { value: "1/3", label: "der Agenturkosten" },
      { value: "5.000+", label: "geprüfte Venues" },
    ],
  },
  pain: {
    tag: "Das Problem",
    headline: "Warum ist ein K-Popup so schwierig?",
    subheadline: "3 echte Hürden für internationale Marken im koreanischen Popup-Markt",
    items: [
      { emoji: "💸", title: "20% Agenturgebühr", desc: "Ohne lokale Agentur kaum möglich — und die nimmt 20% Ihres gesamten Budgets." },
      { emoji: "⏳", title: "Wochenlange Recherche", desc: "Einen Venue zu finden dauert Tage. Influencer zu sourcen nochmal Tage. Sie sind vor dem Launch bereits erschöpft." },
      { emoji: "🌐", title: "Sprach- und Kulturbarriere", desc: "Ohne lokales Know-how finden Sie weder die trendigen Locations noch die Marketingansätze, die wirklich verkaufen." },
    ],
  },
  solution: {
    tag: "Der Gen-da-Weg",
    headline: "KI übernimmt das Know-how einer 10-jährigen PCO-Expertin",
    subheadline: "Öffentliche APIs (KTO/BTO) kombiniert mit echten Betriebsdaten für sofort umsetzbare Angebote.",
  },
  features: {
    tag: "Kernfunktionen",
    headline: "Alles an einem Ort",
    items: [
      { icon: "🏢", title: "KI-Venue-Kuratierung", desc: "Region, Budget und Marken-Vibe eingeben — sofort Top-3-Venues aus verifizierten KTO/BTO-Daten.", badge: "Kern" },
      { icon: "🎯", title: "Influencer-Matching", desc: "5-stufiges Matching von Nano bis Macro. Transparente Kostenschätzung mit Engagement-Rate-Gewichtung." },
      { icon: "✨", title: "KI-Marketing-Assets", desc: "SNS-Texte, Bild-Prompts und Reels-Skripte, optimiert für die koreanische Gen Z." },
      { icon: "🤝", title: "Team-Kollaboration", desc: "Ein Board für globales HQ und lokale koreanische Mitarbeiter — Timelines teilen, in Echtzeit kommunizieren." },
    ],
  },
  ahaMoment: {
    tag: "Aha-Moment",
    headline: "Ihr Angebot in 3 Sekunden",
    subheadline: "Daten eingeben und sofort Venue-Kosten + Influencer-Schätzungen sehen",
    form: {
      region: "Region wählen",
      regionOptions: ["Busan", "Seoul", "Jeju", "Andere"],
      budget: "Gesamtbudget (USD)",
      budgetOptions: ["Unter $5.000", "$5.000–$15.000", "$15.000–$30.000", "$30.000+"],
      theme: "Popup-Thema",
      themeOptions: ["Mode / Beauty", "F&B / Essen", "Lifestyle", "Kunst / Ausstellung"],
      cta: "Kostenloses Angebot erstellen",
      calculating: "KI analysiert...",
    },
    result: {
      venueTitle: "Venue-Schätzung",
      inflTitle: "Influencer-Budget",
      assetTitle: "Marketing-Assets",
      totalTitle: "Gesamtschätzung",
      unlockCta: "Vollständiges Proposal freischalten (1 Credit)",
      disclaimer: "* Dies ist eine Beispielschätzung. Mit 1 Credit wird das vollständige Proposal freigeschaltet.",
    },
  },
  pricing: {
    tag: "Preise",
    headline: "Zahlen Sie nur für das, was Sie brauchen",
    subheadline: "Reines B2B-Credit-Modell — keine Abhängigkeit von öffentlichen Geldern",
    plans: [
      {
        name: "Discovery",
        type: "Abo",
        price: "$99",
        period: "/ Monat",
        features: [
          "KI-Venue-Empfehlungen (10/Monat)",
          "Korea-Popup-Trendberichte",
          "Influencer-Tier-Preiszugang",
          "E-Mail-Support",
        ],
        cta: "Kostenlos starten",
      },
      {
        name: "Launch",
        type: "Credit",
        price: "$499",
        period: "/ Nutzung",
        highlight: true,
        badge: "Am beliebtesten",
        features: [
          "Top-3-Venue-Kurierungspaket",
          "3 Influencer-Kandidaten + Schätzungen",
          "3 KI-Marketing-Assets",
          "Actionable Proposal-Dokument",
          "Prioritäts-E-Mail-Support",
        ],
        cta: "Launch-Credit kaufen",
      },
      {
        name: "Full Setup",
        type: "Credit",
        price: "$1.500",
        period: "/ Nutzung",
        features: [
          "Venue-Bestätigung + Vertragsunterstützung",
          "Finales Influencer-Match + Vertrag",
          "Volles Marketing-Asset-Paket",
          "Team-Kollaborations-Board",
          "Persönlicher Account Manager",
        ],
        cta: "Full Setup anfragen",
      },
    ],
    note: "💡 Bis zu 1/5 der üblichen Agenturgebühren (20% des Gesamtbudgets)",
  },
  betaForm: {
    tag: "Beta-Warteliste",
    headline: "Wir suchen 1.000 Beta-User",
    subheadline: "Beta-User erhalten den Launch-Credit mit 50% Rabatt ($249) während der Beta-Phase",
    emailPlaceholder: "E-Mail-Adresse",
    namePlaceholder: "Ihr Name",
    companyPlaceholder: "Marke / Unternehmen",
    cta: "Beta beitreten (kostenlos)",
    success: "🎉 Sie sind dabei! Wir melden uns, wenn die Beta startet.",
    privacy: "Kein Spam. Jederzeit abmeldbar.",
    counter: "Personen haben sich bereits angemeldet",
  },
  weeklyReport: {
    tag: "K-Popup Intelligence",
    headline: "Seoul Popup-Trends dieser Woche",
    subheadline: "Jede Woche analysieren wir Seongsu & Seoul Popups und liefern umsetzbare Insights für globale Marketer",
    thisWeek: "März 2026, Woche 1 — 7 Popups analysiert",
    popups: [
      { brand: "NikeSKIMS", category: "Sports × Fashion", location: "SCENE Seongsu", scale: "XL", takeaway: "Globale Mega-Marke wählt Seongsu als Tier-1-Launchstadt" },
      { brand: "BLACKPINK DEADLINE", category: "Entertainment", location: "Musinsa Seongsu", scale: "L", takeaway: "Gacha + Stempel-Rallye wandelt Fandom in Commerce um" },
      { brand: "Samsung Galaxy S26", category: "Tech", location: "T Factory Seongsu", scale: "XL", takeaway: "Besucher-Nummern-Strategie als tägliche FOMO-Engine" },
    ],
    discoveryCta: "Wochenbericht Vorschau ansehen →",
    discoveryDesc: "Wöchentlich trendige K-Popup Tiefenanalysen + Small Brand Playbook inklusive",
    sampleLabel: "Highlights dieser Woche",
  },
  footer: {
    tagline: "Der neue Standard für K-Popups — Gen-da",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Product Hunt", href: "#" },
      { label: "Kontakt", href: "mailto:hello@gen-da.io" },
    ],
    copyright: "© 2026 Gen-da. Entwickelt von Sora (10 Jahre PCO). Alle Rechte vorbehalten.",
  },
};

// ─── 스페인어 ─────────────────────────────────────────────────────
const es: Translation = {
  meta: {
    title: "Gen-da | Lanza un K-Popup en Horas, No en Semanas",
    description: "La plataforma de automatización todo en uno para marcas globales que lanzan K-popups en Corea.",
  },
  nav: {
    features: "Funciones",
    pricing: "Precios",
    report: "Informe",
    about: "Nosotros",
    cta: "Unirse al Beta",
  },
  hero: {
    badge: "🚀 Lista de espera Beta abierta",
    headline: "Lanza un K-Popup en Corea.",
    headlineAccent: "Horas, no semanas.",
    subheadline: "Elimina la comisión del 20% de la agencia y días de investigación. Gen-da usa IA para entregar cotizaciones de venues y matches de influencers — de forma instantánea.",
    ctaPrimary: "Únete al Beta gratis →",
    ctaSecondary: "Probar cotización demo",
    trustLine: "Creado por Sora, profesional MICE con 10 años de experiencia",
    stats: [
      { value: "90%", label: "menos tiempo de investigación" },
      { value: "1/3", label: "del costo de agencia" },
      { value: "5.000+", label: "venues verificados" },
    ],
  },
  pain: {
    tag: "El Problema",
    headline: "¿Por qué es tan difícil un K-Popup?",
    subheadline: "3 barreras reales que enfrentan las marcas globales al entrar al mercado coreano de popups",
    items: [
      { emoji: "💸", title: "Comisión del 20%", desc: "No puedes hacerlo sin una agencia local — y te cobran el 20% de todo tu presupuesto." },
      { emoji: "⏳", title: "Semanas de investigación", desc: "Encontrar un venue toma días. Conseguir influencers toma más días. Estás agotado antes de lanzar." },
      { emoji: "🌐", title: "Barrera idiomática y cultural", desc: "Sin conocimiento local, no puedes encontrar los espacios de moda ni crear marketing que realmente venda." },
    ],
  },
  solution: {
    tag: "La Solución Gen-da",
    headline: "La IA hace lo que hace una experta PCO de 10 años",
    subheadline: "Combinando APIs públicas (KTO/BTO) con datos operativos reales para generar propuestas accionables al instante.",
  },
  features: {
    tag: "Funciones Principales",
    headline: "Todo en un solo lugar",
    items: [
      { icon: "🏢", title: "Curación de Venues con IA", desc: "Ingresa región, presupuesto y vibe de marca. Obtén el Top 3 de venues de datos verificados KTO/BTO — al instante.", badge: "Core" },
      { icon: "🎯", title: "Matching de Influencers", desc: "Matching en 5 niveles de Nano a Macro. Estimaciones de costos transparentes con ponderación de tasa de engagement." },
      { icon: "✨", title: "Assets de Marketing con IA", desc: "Genera automáticamente copies para SNS, prompts de imágenes y scripts de Reels optimizados para la Gen Z coreana." },
      { icon: "🤝", title: "Colaboración de Equipo", desc: "Un tablero para la sede global y el equipo local coreano para compartir timelines y comunicarse en tiempo real." },
    ],
  },
  ahaMoment: {
    tag: "Momento Aha",
    headline: "Obtén tu cotización en 3 segundos",
    subheadline: "Ingresa tus detalles y ve al instante costos de venue + estimaciones de influencers",
    form: {
      region: "Seleccionar región",
      regionOptions: ["Busan", "Seúl", "Jeju", "Otra"],
      budget: "Presupuesto total (USD)",
      budgetOptions: ["Menos de $5.000", "$5.000–$15.000", "$15.000–$30.000", "$30.000+"],
      theme: "Tema del popup",
      themeOptions: ["Moda / Belleza", "F&B / Comida", "Lifestyle", "Arte / Exposición"],
      cta: "Generar cotización gratis",
      calculating: "IA analizando...",
    },
    result: {
      venueTitle: "Estimación de Venue",
      inflTitle: "Presupuesto de Influencers",
      assetTitle: "Assets de Marketing",
      totalTitle: "Estimación Total",
      unlockCta: "Desbloquear Propuesta Completa (1 Crédito)",
      disclaimer: "* Esta es una estimación de ejemplo. Desbloquea la Propuesta completa con 1 crédito.",
    },
  },
  pricing: {
    tag: "Precios",
    headline: "Paga solo por lo que necesitas",
    subheadline: "Modelo de crédito B2B puro — sin dependencia gubernamental",
    plans: [
      {
        name: "Discovery",
        type: "Suscripción",
        price: "$99",
        period: "/ mes",
        features: [
          "Recomendaciones de venues con IA (10/mes)",
          "Reportes de tendencias de popups en Corea",
          "Acceso a precios por tier de influencer",
          "Soporte por email",
        ],
        cta: "Comenzar gratis",
      },
      {
        name: "Launch",
        type: "Crédito",
        price: "$499",
        period: "/ uso",
        highlight: true,
        badge: "Más popular",
        features: [
          "Paquete de curación Top 3 venues",
          "3 candidatos de influencers + estimaciones",
          "3 assets de marketing con IA",
          "Documento de Propuesta Accionable",
          "Soporte prioritario por email",
        ],
        cta: "Comprar crédito Launch",
      },
      {
        name: "Full Setup",
        type: "Crédito",
        price: "$1.500",
        period: "/ uso",
        features: [
          "Confirmación de venue + apoyo contractual",
          "Match final de influencer + contrato",
          "Paquete completo de assets de marketing",
          "Tablero de colaboración de equipo",
          "Account manager dedicado",
        ],
        cta: "Solicitar Full Setup",
      },
    ],
    note: "💡 Hasta 1/5 de las tarifas de agencia típicas (que representan el 20% del presupuesto total)",
  },
  betaForm: {
    tag: "Lista de espera Beta",
    headline: "Reclutamos 1.000 usuarios beta",
    subheadline: "Los usuarios beta obtienen el crédito Launch con 50% de descuento ($249) durante el período beta",
    emailPlaceholder: "Correo electrónico",
    namePlaceholder: "Tu nombre",
    companyPlaceholder: "Marca / Empresa",
    cta: "Unirse al Beta (gratis)",
    success: "🎉 ¡Ya estás dentro! Te avisaremos cuando lance el beta.",
    privacy: "Sin spam. Cancela cuando quieras.",
    counter: "personas ya se han registrado",
  },
  weeklyReport: {
    tag: "K-Popup Intelligence",
    headline: "Tendencias de Popups en Seúl esta semana",
    subheadline: "Cada semana analizamos los popups de Seongsu y Seúl para entregar insights accionables a marketers globales",
    thisWeek: "Marzo 2026, Semana 1 — 7 popups analizados",
    popups: [
      { brand: "NikeSKIMS", category: "Sports × Fashion", location: "SCENE Seongsu", scale: "XL", takeaway: "Mega-marca global elige Seongsu como ciudad de lanzamiento Tier-1" },
      { brand: "BLACKPINK DEADLINE", category: "Entertainment", location: "Musinsa Seongsu", scale: "L", takeaway: "Gacha + rally de sellos convierte fandom en comercio" },
      { brand: "Samsung Galaxy S26", category: "Tech", location: "T Factory Seongsu", scale: "XL", takeaway: "Estrategia de visitante numerado como motor diario de FOMO" },
    ],
    discoveryCta: "Vista previa del informe semanal →",
    discoveryDesc: "Análisis profundos semanales de K-popups de tendencia + playbook para marcas pequeñas incluido",
    sampleLabel: "Destacados de esta semana",
  },
  footer: {
    tagline: "El nuevo estándar para K-Popups — Gen-da",
    links: [
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Product Hunt", href: "#" },
      { label: "Contacto", href: "mailto:hello@gen-da.io" },
    ],
    copyright: "© 2026 Gen-da. Creado por Sora (10 años PCO). Todos los derechos reservados.",
  },
};

// ─── 번역 딕셔너리 ────────────────────────────────────────────────
export const translations: Record<Locale, Translation> = { ko, en, de, es };
