import { NextResponse } from "next/server";
import { PROFILE } from "@/config/profile";

// Highly accurate regex scanner to determine language based on text characteristics
function detectLanguage(text: string): "zh" | "en" | "ja" {
  // 1. Japanese check: Japanese MUST contain flat kana (Hiragana/Katakana)
  const jpRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
  if (jpRegex.test(text)) {
    return "ja";
  }

  // 2. Chinese check: If Hanzi character density is higher than 8%, it is Chinese
  const hanChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  const totalLength = text.length || 1;
  const hanRatio = hanChars.length / totalLength;

  if (hanRatio > 0.08) {
    return "zh";
  }

  // 3. Fallback: English
  return "en";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jd, lang: frontendLang = "zh" } = body;

    // 1. Strict Input Validation & Sanitization
    if (!jd || typeof jd !== "string") {
      return NextResponse.json(
        { error: "Invalid Job Description. It must be a non-empty string." },
        { status: 400 }
      );
    }

    // Limit length to prevent excessive tokens / prompt injection
    const sanitizedJd = jd.trim().slice(0, 4000);

    // Auto-detect the job description language to match the output language perfectly
    const lang = detectLanguage(sanitizedJd);

    const apiKey = process.env.LLM_API_KEY;
    const apiUrl = process.env.LLM_API_URL || "https://api.deepseek.com/chat/completions";
    const apiModel = process.env.LLM_MODEL || "deepseek-chat";

    // 2. High-fidelity Mock Fallback for Local Testing
    // If API Key is placeholder or missing, return beautiful mock data so the app never crashes
    if (!apiKey || apiKey === "your_api_key_here") {
      const mockResult = getMockEvaluation(sanitizedJd, lang);
      return NextResponse.json(mockResult);
    }

    // 3. Build System Prompt & Secure Direct Template Construction
    const systemPrompt = `You are a highly rigorous, objective, and expert Global Technical Recruiter specializing in heavy industrial EPC, plant engineering, and industrial DX/AI solutions.
Your goal is to evaluate a provided Job Description (JD) against the Candidate Profile of ${PROFILE.name.en} and output a detailed scoring assessment in JSON format.

CANDIDATE PROFILE:
------------------
Name: ${PROFILE.name.en} / ${PROFILE.name.zh} / ${PROFILE.name.ja}
Title: ${PROFILE.title.en}
Target Salary Range: Desired 12M - 15M JPY. Absolute minimum: 11M JPY (inclusive of bonuses/allowances/overtime). Open to 11M JPY ONLY IF the workload is comfortable, location is very close to home (Kawasaki), or supports extensive remote work.
Preferred Locations: Kanagawa Kawasaki (BEST/MOST PREFERRED), Yokohama, Tokyo, or Remote.
Travel Receptivity: Up to 50% annual travel ratio, open to 2-3 months single-trip dispatch. Highly welcomes global overseas site dispatch with premium allowances. Discourages domestic site travel.
Career Preference: Strongly targeting Heavy Industrial Project Manager (PM) or Industrial DX (Digital Transformation) & AI application roles.
EXCLUSION: DO NOT consider pure, traditional Quality Control / Quality Assurance (QC/QA) dedicated roles. The candidate is shifting away from QC/QA.
AI Role Preference: Receptive to cutting-edge AI implementation roles, especially those with minimal compliance restrictions and high freedom to utilize latest AI technologies.
Target Employers: Strongly prefers foreign-affiliated firms (外資系) and flat organizations. Focus on EPC contractors, rotating machinery/heavy equipment manufacturers, or industrial software SaaS companies serving manufacturing/EPC.
Team Culture: Flat, minimal corporate hierarchy, low reporting overhead, highly communicative and open teams.
Professional Credentials: ${PROFILE.skills.frontend.join(", ")}
IT & DX Capabilities: ${PROFILE.skills.backend.join(", ")}
Core Domain Expertise: ${PROFILE.skills.tools.join(", ")}
Language Proficiency: Chinese (Native), English (TOEIC 945, business fluent), Japanese (JLPT N1, business fluent).

EVALUATION SYSTEM INSTRUCTIONS:
- Grade the candidate on exactly 7 dimensions:
  1. salaryMatch (薪资匹配) - Compare JD salary with candidate's expectations. Highly rate (90+) if JD meets 12M-15M JPY, or meets 11M JPY with low-workload / close-to-home / remote. If JD has no salary mentioned, default to 75 and note standard EPC/PM ranges.
  2. locationMatch (位置匹配) - Best score (98+) for Kanto commuter cities (Kawasaki, Yokohama, Tokyo) or Remote work. These are candidate's premium preferred local areas. For travel: Rate high (95+) if it involves global overseas site dispatch with premium allowances. Assign lower scores only if it demands extensive domestic site dispatch within Japan.
  3. skillMatch (能力匹配) - Map JD engineering requirements to candidate's skills. High match for PM, DX leadership, RPA, and industrial AI implementation. Deduct points heavily if it is a pure traditional QC/QA inspector role.
  4. experienceMatch (职业经历匹配) - Check if the job matches senior Project Manager, DX director, or heavy industrial PM (13+ years). Give lower score if it targets junior roles or dedicated QC manager role.
  5. industryMatch (行业契合度) - High score (95+) if JD is in EPC, Heavy Machinery, or industrial DX software. Receptive to foreign-affiliated, flat organizations.
  6. languageMatch (语言要求匹配) - Chinese (Native), English (TOEIC 945), Japanese (JLPT N1). Rate 98+ if English or Japanese is business standard.
  7. overallScore (综合推荐指数) - A weighted average representing the fit index based on the above priorities.

RESPONSE REQUIREMENTS:
- Your response MUST be written in the language specified by the user: "${lang}" (use "zh" for simplified Chinese, "en" for English, "ja" for Japanese).
- You MUST respond in a strict JSON format matching the following typescript type:

interface EvaluationResponse {
  dimensions: {
    salaryMatch: { score: number; comment: string };
    locationMatch: { score: number; comment: string };
    skillMatch: { score: number; comment: string };
    experienceMatch: { score: number; comment: string };
    industryMatch: { score: number; comment: string };
    languageMatch: { score: number; comment: string };
    overallScore: { score: number; comment: string };
  };
  recommendationLetter: string; // Synthesized evaluation summary and actionable suggestions in ${lang} markdown.
}

Ensure all comments and the recommendationLetter are strictly written in "${lang}". Output ONLY raw valid JSON, no markdown wrapping like \`\`\`json...\`\`\`.`;

    // 4. Secure API invocation
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: apiModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please evaluate this Job Description: \n\n${sanitizedJd}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `LLM API returned an error: ${response.status} - ${errorText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const contentText = data.choices?.[0]?.message?.content;

    if (!contentText) {
      return NextResponse.json(
        { error: "Empty response from LLM API." },
        { status: 502 }
      );
    }

    // Parse verified LLM JSON
    const parsedData = JSON.parse(contentText);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("Evaluation API Error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// High fidelity Mock Generator
// Used when API keys are not yet configured, allowing instant UI demo
// -------------------------------------------------------------
function getMockEvaluation(jd: string, lang: string) {
  const isZh = lang === "zh";
  const isJa = lang === "ja";

  const lowerJd = jd.toLowerCase();
  
  // 1. Core Role Alignment Check (Special exclusion for pure QC/QA)
  const isPureQcQa = (lowerJd.includes("qc") || lowerJd.includes("qa") || lowerJd.includes("quality") || lowerJd.includes("品质") || lowerJd.includes("品質")) &&
                     !(lowerJd.includes("pm") || lowerJd.includes("project") || lowerJd.includes("项目") || lowerJd.includes("案件") || lowerJd.includes("dx") || lowerJd.includes("ai") || lowerJd.includes("转型") || lowerJd.includes("自動") || lowerJd.includes("automation"));
  
  const isHeavyPM = lowerJd.includes("project") || lowerJd.includes("pm") || lowerJd.includes("项目经理") || lowerJd.includes("プロマネ");
  const isDxAI = lowerJd.includes("dx") || lowerJd.includes("ai") || lowerJd.includes("python") || lowerJd.includes("rpa") || lowerJd.includes("数字化") || lowerJd.includes("デジタル");

  // 2. Skill & Experience Scoring (Heavy penalty for pure QC/QA, massive bonus for PM and DX/AI)
  let skillScore = 75;
  let expScore = 80;
  
  let skillComment = "";
  let expComment = "";

  if (isPureQcQa) {
    skillScore = 55;
    expScore = 60;
    skillComment = isZh 
      ? "匹配度较低。候选人已全面转向重工项目管理 (PM) 与数字化转型 (DX)/AI 落地，不再考虑单纯的传统品质管理 (QC/QA) 专职岗位。"
      : isJa
      ? "マッチング率は低めです。候補者は現在、重工業系シニアPMおよびDX/AI実装へのキャリアシフトを完了しており、従来の品質管理（QC/QA）専任職は希望していません。"
      : "Low alignment. The candidate is shifting away from traditional QC/QA dedicated roles, focusing entirely on PM and industrial DX/AI implementations.";
    expComment = isZh
      ? "虽然候选人拥有极为庞大的全球 EPC 模块与设备 QC 资历，但与目前的职业规划方向（PM/DX）不匹配。"
      : isJa
      ? "候補者は極めて豊富なグローバルEPCモジュール・装置QC実務経験を有していますが、現在のPM/DXシフトの方向性と合致しません。"
      : "Though offering heavy global modular/rotating equipment QA/QC background, it conflicts with his current career focus (PM/DX).";
  } else {
    let skillBonus = 0;
    if (isHeavyPM) skillBonus += 15;
    if (isDxAI) skillBonus += 20;
    skillScore = Math.min(68 + skillBonus, 99);
    expScore = isHeavyPM || isDxAI ? 96 : 85;

    skillComment = isZh
      ? "专业资格与业务技术匹配度极佳：持有 PMP® 证书，兼备极其卓越的 Python/RPA 数字化落地与生成式 AI (RAG/PoC) 自由开发创新力。"
      : isJa
      ? "保有資格と技術の適合率が極めて高い：PMP®資格に加え、Python/RPAによる実務自動化、生成AI(RAG/PoC)の迅速な開発・推進力を完備。"
      : "Excellent match: Holds PMP®, combined with outstanding Python/RPA automation and robust Generative AI (RAG/PoC) agile implementation skills.";
      
    expComment = isZh
      ? "候选人拥有 13 年以上的全球大型工程 (EPC) 与制造业深厚阅历，极度契合重工项目管理 PM 或企业数字化转型 DX 负责人的岗位职责。"
      : isJa
      ? "候補者は13年以上のグローバル大型プラント（EPC）および製造業における豊富な経験を有し、重工業系PMまたはDXリーダー職に完全に適合しています。"
      : "Offers 13+ years of global large-scale EPC and heavy industrial engineering footprint, ideal for senior PM or industrial DX implementation leadership.";
  }

  // 3. Location & Travel Scoring (Kawasaki/Yokohama/Tokyo/Remote=100, Overseas Travel with allowance=95+, Domestic Site travel=lower)
  let locScore = 75;
  let locComment = "";
  
  const isKawasaki = lowerJd.includes("kawasaki") || lowerJd.includes("川崎");
  const isRemote = lowerJd.includes("remote") || lowerJd.includes("远程") || lowerJd.includes("リモート");
  
  const isPreferredLocal = isKawasaki || isRemote ||
                           lowerJd.includes("yokohama") || lowerJd.includes("横浜") ||
                           lowerJd.includes("tokyo") || lowerJd.includes("东京") || lowerJd.includes("東京");
  const isOverseas = lowerJd.includes("overseas") || lowerJd.includes("海外") || lowerJd.includes("saudi") || lowerJd.includes("indonesia") || lowerJd.includes("驻外");
  const isDomesticSite = (lowerJd.includes("domestic") || lowerJd.includes("日本国内") || lowerJd.includes("工地") || lowerJd.includes("現場") || lowerJd.includes("出張")) && !isOverseas;

  if (isPreferredLocal) {
    locScore = 100;
    locComment = isZh
      ? "最佳地点匹配！该职位位于最理想的关东核心通勤圈（川崎、横滨、东京）或支持远程办公，与候选人的日常通勤和生活圈高度契合。"
      : isJa
      ? "最高の勤務地マッチ！最も理想的な関東主要エリア（川崎・横浜・東京）での勤務、またはリモート勤務に対応しており、ワークライフバランスに最適です。"
      : "Perfect Location Match! Based in Kanto's premium commuting circle (Kawasaki, Yokohama, Tokyo) or supports remote work, aligning perfectly with lifestyle expectations.";
  } else if (isOverseas) {
    locScore = 93;
    locComment = isZh
      ? "出差适配度优秀：该职位包含海外现场派驻/出差并提供丰厚津贴，完全契合候选人可接受单次2-3个月、年均50%出差比例的优势。"
      : isJa
      ? "出張適合性良好：海外現地駐在・出張手当ありの案件で、1回あたり2〜3ヶ月、年間最大50%の出張対応力と見事に合致しています。"
      : "Great travel fit: Involves global overseas site assignments with premium allowances, well matching candidate's travel bandwidth.";
  } else if (isDomesticSite) {
    locScore = 72;
    locComment = isZh
      ? "匹配度一般。虽然可接受出差，但对于日本国内工地的出差，候选人倾向于减少频次。"
      : isJa
      ? "マッチング率は控えめです。出張自体は可能ですが、日本国内の建設現場への出張は頻度を抑えたい意向があります。"
      : "Moderate match. While open to business trips, candidate prefers to minimize domestic site dispatches.";
  } else {
    locScore = 80;
    locComment = isZh
      ? "地点符合日本关东通勤圈要求，出差频次及比例基本在候选人接受范围之内。"
      : isJa
      ? "勤務地は関東通勤圏に合致しており、出張頻度や比率も候補者の受容範囲内です。"
      : "Location fits the Kanto region commuting circle with manageable business travel ratio.";
  }

  // 4. Salary Matching (11M bottom-line JPY特判)
  let salaryScore = 75;
  let salaryComment = "";
  const isComfortable = lowerJd.includes("comfortable") || lowerJd.includes("easy") || lowerJd.includes("轻松") || lowerJd.includes("残業少") || lowerJd.includes("残業なし") || lowerJd.includes("flex") || lowerJd.includes("フレックス");
  
  if (lowerJd.includes("1200") || lowerJd.includes("1300") || lowerJd.includes("1400") || lowerJd.includes("1500") || lowerJd.includes("12m") || lowerJd.includes("15m") || lowerJd.includes("1200万") || lowerJd.includes("1500万")) {
    salaryScore = 98;
    salaryComment = isZh
      ? "极佳的薪资匹配！提供的预算处于候选人期望的高端区间（1200万 - 1500万 JPY）。"
      : isJa
      ? "極めて高い年収合致！提示予算は候補者の希望レンジ（1200万〜1500万円）の上限付近に位置しています。"
      : "Superb salary match! The offered range lies perfectly within the candidate's desired range (12M - 15M JPY).";
  } else if (lowerJd.includes("1100") || lowerJd.includes("11m") || lowerJd.includes("1100万")) {
    if (isRemote || isComfortable || isKawasaki) {
      salaryScore = 93;
      salaryComment = isZh
        ? "高度契合！虽然属于底线年薪 1100万 JPY，但由于工作离家近、节奏舒适或支持大量远程，完全符合候选人的特判接受标准。"
        : isJa
        ? "高度に適合！最低ラインの 1100万 円ですが、勤務地が川崎と非常に近く、残業が少ないか、またはリモート勤務が可能なため、受容条件を完全に満たしています。"
        : "Highly compliant! Although at the baseline of 11M JPY, since the job is close to home, workload is comfortable, or remote work is supported, it fully satisfies candidate's criteria.";
    } else {
      salaryScore = 80;
      salaryComment = isZh
        ? "属于候选人的底线年薪 1100万 JPY（含全部补贴）。若工作负荷较重或通勤距离较远，溢价空间稍显不足。"
        : isJa
        ? "候補者の最低許容ラインの 1100万 円です。業務負荷が高め、あるいは遠距離通勤の場合は、インセンティブがやや不足する可能性があります。"
        : "Reaches the absolute baseline of 11M JPY. If the commute is long or workload is high, the margin is tight.";
    }
  } else {
    salaryScore = 75;
    salaryComment = isZh
      ? "未明确标明具体薪资。评估将以候选人理想年薪 (1200万 - 1500万 JPY) 作为后续沟通与谈判基准。"
      : isJa
      ? "求人票に明示的な年収表記がありません。董一舟の希望（1200万-1500万円）を基準に、オファー面談での交渉が必要となります。"
      : "Salary not explicitly mentioned. Evaluation baseline remains candidate's desired range of 12M - 15M JPY.";
  }

  // 5. Industry Alignment (EPC, Heavy Machinery, SaaS for Industry, Foreign Flat structure)
  let indScore = 80;
  let indComment = "";
  const isForeign = lowerJd.includes("foreign") || lowerJd.includes("global") || lowerJd.includes("multicultural") || lowerJd.includes("外資") || lowerJd.includes("グローバル");
  const isFlat = lowerJd.includes("flat") || lowerJd.includes("agile") || lowerJd.includes("扁平") || lowerJd.includes("フラット") || lowerJd.includes("スタートアップ");
  const isSoftware = lowerJd.includes("software") || lowerJd.includes("saas") || lowerJd.includes("software company") || lowerJd.includes("软件") || lowerJd.includes("ソフトウェア") || lowerJd.includes("it");

  let indBonus = 0;
  if (lowerJd.includes("epc") || lowerJd.includes("plant") || lowerJd.includes("machinery") || lowerJd.includes("重工") || lowerJd.includes("プラント") || lowerJd.includes("メーカー")) indBonus += 10;
  if (isForeign) indBonus += 5;
  if (isFlat) indBonus += 5;
  if (isSoftware) indBonus += 5;
  
  indScore = Math.min(75 + indBonus, 98);
  indComment = isZh
    ? `行业与雇主高度吻合：契合 EPC 及装备制造大背景${isForeign ? "，且完美契合外资系扁平、汇报少的开放氛围" : ""}。`
    : isJa
    ? `業界・企業文化の高い親和性：EPCや重工業機器メーカーの背景に合致し${isForeign ? "、かつ外資系のフラットで意思決定の早い環境に完璧に適合しています" : ""}。`
    : `Great industry alignment: Matches heavy industry/EPC background${isForeign ? " and strongly aligns with foreign-affiliated flat communication styles" : ""}.`;

  const finalOverallScore = isPureQcQa 
    ? 58 
    : Math.round((locScore + skillScore + salaryScore + expScore + indScore + 98) / 6);

  const mockEval: any = {
    isDemo: true,
    dimensions: {
      salaryMatch: { score: salaryScore, comment: salaryComment },
      locationMatch: { score: locScore, comment: locComment },
      skillMatch: { score: skillScore, comment: skillComment },
      experienceMatch: { score: expScore, comment: expComment },
      industryMatch: { score: indScore, comment: indComment },
      languageMatch: {
        score: 98,
        comment: isZh
          ? "中文为母语，英语沟通极流利 (TOEIC 945, 商务流利)，日语商务流利 (JLPT N1 / 永住权)，多国籍协作沟通绝佳。"
          : isJa
          ? "中国語ネイティブ、英語極めて流暢（TOEIC 945、ビジネス流暢）、日本語流暢（JLPT N1・永住者）、多国籍なビジネス折衝に完璧に対応。"
          : "Native Chinese, fluent English (TOEIC 945), and business fluent Japanese (JLPT N1 / Permanent Resident). Exceptional multination integration."
      },
      overallScore: {
        score: finalOverallScore,
        comment: isZh
          ? isPureQcQa 
            ? "综合建议：该岗位属于专职品质管理 (QC/QA) 岗位，与候选人目前转向【重工项目经理 (PM)】与【DX/AI工程落地】的求职意向存在根本偏差，故总体不推荐。"
            : "综合来看，此岗位与董一舟的重核转型资质（项目管理/数字化转型/AI落地）极其契合，强烈推荐进一步面谈！"
          : isJa
          ? isPureQcQa
            ? "総合判断：このポジションは従来のQC/QA専任業務であるため、候補者の現在のPM・DXキャリア方針と合致せず、推奨しません。"
            : "総合評価：董一舟の強力なキャリア・強み（プロジェクトマネジメント・前沿DX/AI実装）に非常に合致しており、面接を強く推奨します！"
          : isPureQcQa
            ? "Overall: This is a traditional dedicated QC/QA role which conflicts with the candidate's career shift to Project Management and Industrial DX/AI. Not recommended."
            : "Overall, this position represents an outstanding fit for Dong Yizhou's background (Heavy Project Management / Industrial DX & Generative AI). Highly recommended!"
      }
    },
    recommendationLetter: isZh
      ? `### 🌟 董一舟 的精选推荐诊断报告 (Demo Mode)

> **⚠️ 提示**：此报告为**演示模式生成**。当前未检测到 \`.env.local\` 中配置的 \`LLM_API_KEY\`。

#### ✅ 核心匹配与转型分析
1. **重工 Project Management 实力**：具备 13 年以上的大型国际 EPC（日挥）和流体机械（荏原）项目实战经验，抗索赔抗压能力（沙特 30 亿日元挽回）强悍，完全胜任中大型重工 PM 统筹。
2. **拒绝专职 QC/QA，投身前沿 AI/DX 落地**：候选人已**坚决向重工业数字化和 AI 自由开发转型**。利用 Python/RPA 极速构建原型，累计消减了 4,000 工时。非常适合在**限制较少、鼓励自由拥抱最新大模型**的团队中主导工业软件或 DX 实施。
3. **完美的生活工作平衡**：工作地点高度偏好**川崎**及远程办公。若环境舒适、支持远程或通勤极短，可接受底线年薪 **1100万 JPY**（包含全部福利补贴），否则期望标准为 **1200万 - 1500万 JPY**。

#### ⚠️ 规避与注意事项
* **传统 QC/QA 岗位规避**：若本岗位属于仅负责检验、探伤见证、ITP 审批的传统专职品质管理岗位，即使属于日挥或同级大厂，候选人也不予考虑。
* **日本国内工地长出差规避**：候选人偏好高津贴的**海外长期派驻**（单次 2-3 个月，年出差 50% 均可）；但倾向于少去日本国内工地长期出差。`
      : isJa
      ? `### 🌟 董一舟 の総合推薦診断書 (Demo Mode)

> **⚠️ 注意**：このレポートは**デモモードで生成**されました。

#### ✅ 強みとキャリア適合度
1. **重工業系PMとしての即戦力**：日揮グローバルおよび荏原エリオットにて13年以上の巨大EPCプロジェクト工程管理に従事。約30億円規模の索賠クレームをアラムコから回収した圧倒的プロジェクトマネジメント（PM）推進力。
2. **DX・前沿AI実装の推進**：従来の単なる検査・品质保证（QC/QA）業務から**完全に脱却**し、Python/RPAおよび生成AI(RAG/PoC)を用いた「実務自动化」と「システム開発」を志向。ルール制限の少ない環境でのイノベーション創出に最適。
3. **フレキシブルな条件交渉**：**神奈川県川崎市**の勤務またはリモートワークがベスト。残业少なめ・近距離・リモート環境であれば、最低許容ラインの **1100万 円**（手当・残業代等込み）でのオファーも合意可能です（通常希望：**1200万〜1500万円**）。

#### ⚠️ 懸念点・見送り基準
* **純粋な品質管理職務**：検査官、溶接仕様審査、サプライヤー監査など、従来の品質管理専任ロール（QC/QA）はお見送り対象となります。
* **国内現場出張の制限**：海外プラント現地への出張（手当付き、年間50%まで）は歓迎しますが、手当の薄い日本国内建設现场への頻繁な長期出張は極力回避したい意向があります。`
      : `### 🌟 Dong Yizhou's Expert Evaluation (Demo Mode)

> **⚠️ Notice**: This report is generated in **Demo Mode**.

#### ✅ Core Match & Career Evolution
1. **Rigorous Industrial PM background**: 13+ years global EPC (JGC) and turbomachinery (Ebara) delivery expertise, capable of handling complex heavy industrial Project Management and massive claim negotiations.
2. **Pivoting Away from QA/QC to DX/AI Innovation**: Strongly determined to drive industrial digitalization. Highly prefers agile teams with fewer compliance restrictions to freely deploy bleeding-edge Generative AI and Python automation. Pure dedicated QA/QC roles are excluded.
3. **Flexible and Rational Package Baseline**: Desires **12M - 15M JPY**. Receptive to **11M JPY** (inclusive of all bonuses) only if workload is comfortable, location is in **Kawasaki** (near home), or remote work is heavily integrated.

#### ⚠️ Exclusion Criteria
* **Exclude dedicated QC/QA positions**: Pure welding inspector/NDT witness/ITP auditor roles will be declined.
* **Domestic Site Travel vs. Global Overseas site**: Highly welcoming global site dispatch with premium allowances (up to 50% ratio); prefers to minimize domestic site travel.`
  };
  
  return mockEval;
}