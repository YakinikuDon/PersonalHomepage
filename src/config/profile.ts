// This configuration is strictly imported server-side in API routes.
// It will NEVER be exposed in the frontend client-side bundles.

export interface WorkExperience {
  company: string;
  role: string | {
    zh: string;
    en: string;
    ja: string;
  };
  period: string | {
    zh: string;
    en: string;
    ja: string;
  };
  description: {
    zh: string;
    en: string;
    ja: string;
  };
  highlights?: {
    zh: string[];
    en: string[];
    ja: string[];
  };
}

export interface Project {
  name: string | {
    zh: string;
    en: string;
    ja: string;
  };
  description: {
    zh: string;
    en: string;
    ja: string;
  };
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface CandidateProfile {
  name: {
    zh: string;
    en: string;
    ja: string;
  };
  title: {
    zh: string;
    en: string;
    ja: string;
  };
  contact: {
    email: string;
    github: string;
    bilibili: string;
  };
  expectedSalary: {
    minAnnualRMB: number; // For comparative analysis in prompt
    currency: string;
    details: {
      zh: string;
      en: string;
      ja: string;
    };
  };
  preferredLocations: {
    cities: string[];
    details: {
      zh: string;
      en: string;
      ja: string;
    };
  };
  careerPreferences: {
    roles: {
      zh: string[];
      en: string[];
      ja: string[];
    };
    preferredEmployers: {
      zh: string;
      en: string;
      ja: string;
    };
    cultureAndAtmosphere: {
      zh: string;
      en: string;
      ja: string;
    };
    details: {
      zh: string;
      en: string;
      ja: string;
    };
  };
  skills: {
    frontend: { zh: string; en: string; ja: string }[]; // Reused as Professional Certifications
    backend: { zh: string; en: string; ja: string }[];  // Reused as IT Capabilities
    tools: { zh: string; en: string; ja: string }[];    // Reused as Core Domain Expertise
    languages: {
      zh: string;
      en: string;
      ja: string;
    };
  };
  experiences: WorkExperience[];
  projects: Project[];
}

export const PROFILE: CandidateProfile = {
  name: {
    zh: "董一舟",
    en: "Dong Yizhou",
    ja: "董 一舟"
  },
  title: {
    zh: "项目管理与数字化转型（DX）专家 (JGC Global / 日挥全球)",
    en: "Project Management & Digital Transformation (DX) Expert (JGC Global)",
    ja: "プロジェクトマネジメント ＆ デジタルトランスフォーメーション (DX) エキスパート"
  },
  contact: {
    email: "touissyu@gmail.com",
    github: "https://github.com/YakinikuDon",
    bilibili: "https://space.bilibili.com/76658258" // B站：烤肉株式会社 真实地址
  },
  expectedSalary: {
    minAnnualRMB: 550000, // Equates to ~11M JPY baseline
    currency: "JPY",
    details: {
      zh: "理想年薪 1200万 - 1500万 JPY；底线年薪 1100万 JPY（包含所有补贴、奖金和加班费）。若离家近、轻松或支持大量远程，可接受底线年薪。",
      en: "Desired: 12M - 15M JPY. Hard baseline: 11M JPY (inclusive of bonuses, allowances, and overtime). Open to 11M JPY if the workload is light, close to home, or supports extensive remote work.",
      ja: "希望年収 1200万 - 1500万 円。最低許容ラインは 1100万 円（手当・残業代・賞与込み）。残業少・近距離またはリモート可であれば最低ラインでも受託可能。"
    }
  },
  preferredLocations: {
    cities: ["神奈川", "川崎", "Kawasaki", "横浜", "Yokohama", "东京", "Tokyo", "远程办公", "Remote", "海外出差", "Overseas Travel"],
    details: {
      zh: "神奈川县川崎市最理想，横滨、东京或完全远程亦可。可接受 2-3 个月单次长期出差（年均比例最高 50%）。海外出差（带津贴）接受度极高；日本国内工地出差则倾向于少去。",
      en: "Best fit: Kawasaki City, Kanagawa. Yokohama, Tokyo, or Remote is acceptable. Open to long-term business trips (2-3 months at a time, up to 50% annually). Highly receptive to overseas site trips with allowances; domestic site trips should be minimized.",
      ja: "神奈川県川崎市がベスト、横浜・東京、または完全リモートも可。長期出張（1回あたり2〜3ヶ月、年間最大50%まで）対応可。海外出張（出張手当あり）は歓迎、国内現場出張は極力控えめを希望。"
    }
  },
  careerPreferences: {
    roles: {
      zh: ["重工系项目经理 (Project Manager)", "数字化转型 (DX) / AI 落地应用专家"],
      en: ["Heavy Industrial Project Manager (PM)", "Digital Transformation (DX) / AI Implementation Leader"],
      ja: ["重工業系プロジェクトマネージャー (PM)", "デジタルトランスフォーメーション (DX) / AI 実装エキスパート"]
    },
    preferredEmployers: {
      zh: "优先外资系企业、扁平化组织。包括大型 EPC 承包商、高端装备制造厂、或提供制造业/EPC相关软件服务的科技公司。",
      en: "Prioritize foreign-affiliated firms and flat-structured organizations, including large EPC contractors, rotating machinery/equipment manufacturers, or industrial SaaS/AI software tech companies.",
      ja: "外資系企業、フラットな組織を優先。大手EPCコントラクター、産業用装置・回転機械メーカー、または製造・EPC向けSaaS/AIソリューションを提供するITテック企業。"
    },
    cultureAndAtmosphere: {
      zh: "扁平化组织、极少死板汇报、沟通高效顺畅且自由开放的团队氛围。极度渴望在能够不受限制、能自由应用最新前沿 AI 技术的宽容环境中工作。",
      en: "Flat hierarchy, minimal corporate bureaucracy, highly efficient and open multicultural communication. Strongly prefers highly innovative environments where utilizing bleeding-edge Generative AI and automation faces fewer compliance hurdles.",
      ja: "フラットな組織、承認ルートや定型レポートが少なく、自由で風通しの良い対話的な文化。最新AIの試用や実務活用に対するルール制限が少なく、イノベーションに対して寛容な環境を希望。"
    },
    details: {
      zh: "候选人目前正全面转向【重工项目管理 PM】与【DX/AI工程落地】的深层结合，不再考虑单纯的传统品质管理 (QC/QA) 业务。优先考虑创新包容度高、扁平且自由的外资背景跨国团队。",
      en: "Candidate is pivoting to senior heavy industrial PM and industrial DX/AI applications, and is NOT considering traditional Quality Control (QC/QA) roles. Strong preference for flat, agile, innovative foreign-affiliated firms.",
      ja: "現在シニアPMおよび産業系DX/AI実装のハイブリッドロールへ完全シフトしており、従来の品質管理（QC/QA）専任職務は考慮しません。フラットで迅速な外資系グローバルテック・EPC環境を強く希望。"
    }
  },
  skills: {
    frontend: [
      {
        zh: "PMP® (项目管理专业人士认证)",
        en: "PMP® (Project Management Professional)",
        ja: "PMP®（プロジェクトマネジメントプロフェッショナル）"
      },
      {
        zh: "溶接管理技術者 1级 (焊接技术管理认证)",
        en: "Welding Engineering Specialist Grade 1",
        ja: "溶接管理技術者 1級"
      },
      {
        zh: "JSNDI 非破坏性检测技术者 Level 2 (PT, MT, RT)",
        en: "JSNDI NDT Level 2 (PT, MT, RT)",
        ja: "JSNDI 非破壊試験技術者 レベル2 (PT, MT, RT)"
      },
      {
        zh: "G检定 2026#1 (JDLA 生成式 AI 商业应用认证)",
        en: "JDLA Deep Learning G-Certificate 2026#1",
        ja: "JDLA G検定 2026#1 (ジェネレーティブAI)"
      },
      {
        zh: "Python 3 认定技术者 (基础程序设计认证)",
        en: "Python 3 Certified Programmer",
        ja: "Python 3 認定技術者 (基礎試験)"
      }
    ],
    backend: [
      {
        zh: "Python (数据处理与脚本编写)",
        en: "Python (Data Processing & Custom Scripting)",
        ja: "Python (データ処理・カスタムスクリプト)"
      },
      {
        zh: "Power Automate (RPA 业务流程自动化)",
        en: "Power Automate (RPA Workflow Automation)",
        ja: "Power Automate (RPA 業務自動化)"
      },
      {
        zh: "生成式 AI 落地应用 (RAG, Copilot PoC)",
        en: "Generative AI Applications (RAG & Copilot PoCs)",
        ja: "生成AI業務統合 (RAG / Copilot 概念実証)"
      },
      {
        zh: "Vibe Coding (交互原型与系统极速构建)",
        en: "Vibe Coding (Rapid Interaction Prototyping)",
        ja: "Vibe Coding (UIプロトタイプ迅速構築)"
      },
      {
        zh: "数字化双胞胎 (Digital Twin) 技术落地",
        en: "Digital Twin Technology Implementation",
        ja: "デジタルツイン (Digital Twin) 技術実装"
      },
      {
        zh: "信息管理系统 (IM 大型数据高保真迁移)",
        en: "Information Management (IM Large Database Migration)",
        ja: "情報管理システム (IM 大規模データ移行)"
      }
    ],
    tools: [
      {
        zh: "EPC 工程项目全生命周期执行与协调",
        en: "EPC Project Lifecycle Execution & Control",
        ja: "EPCプラントプロジェクト全ライフサイクル管理"
      },
      {
        zh: "品质管理与品质保证 (QC/QA 体系搭建与见证)",
        en: "Quality Control & Assurance (QC/QA Setup & Witness)",
        ja: "品質管理・品質保証 (QA/QC 体系構築・検査立会)"
      },
      {
        zh: "旋转机械与重型设备工程设计与集成 (压缩机/透平机)",
        en: "Rotating Machinery & Heavy Equipment System Integration",
        ja: "回転機械・大型装置システム設計およびインテグレーション"
      },
      {
        zh: "采购品全球监造与 Vendor 供应商管理评价",
        en: "Global Procurement Inspection & Vendor Assessment",
        ja: "グローバル機器監造およびベンダー品質評価"
      },
      {
        zh: "合同重大索赔谈判与财务损失挽回 (约30亿日元)",
        en: "Contract Claim Negotiations & Recovery (~3 Billion JPY)",
        ja: "コントラクトクレーム交渉・財務損失補填 (~30億円)"
      }
    ],
    languages: {
      zh: "母语 (Native)",
      en: "流利 (Fluent, TOEIC 945, business fluent)",
      ja: "ビジネス流暢 (Fluent, JLPT N1 永住)"
    }
  },
  experiences: [
    {
      company: "JGC Global / 日揮グローバル",
      role: {
        zh: "DX Promotion Key Person / 数字化转型推动人 (兼任)",
        en: "DX Promotion Key Person (Concurrent)",
        ja: "DX Promotion Key Person / DX推進キーパーソン (兼任)"
      },
      period: {
        zh: "2025.07 - 至今",
        en: "2025.07 - Present",
        ja: "2025.07 - 現在"
      },
      description: {
        zh: "在质量控制（QC）部门主导全社数字化转型（DX）战略规划与落地，利用 AI 与自动化大幅提升传统工程的运营效能。",
        en: "Lead digital transformation (DX) strategies in the Quality Control (QC) department, integrating AI and automation into traditional engineering practices to cut overheads.",
        ja: "QC部門を起点とした全社的なデジタルトランスフォーメーション（DX）戦略の立案および実行推進を担当。AIやRPAを実業務に統合。"
      },
      highlights: {
        zh: [
          "制定中长期 5 年数字化路线图，开展用户调研与跨部门研讨，保障 DX 预算合规高效申请。",
          "主导生成式 AI（RAG 检索增强生成）系统的概念验证（PoC）与内部技术攻坚，推动 AI 落地业务流。",
          "利用 Vibe Coding 与 Python 进行前端交互原型系统的高速迭代，将管理层设计反馈周期缩短数倍，累计节约工时 4,000 小时。"
        ],
        en: [
          "Formulated the 5-year digital transformation roadmap through user interviews and multi-department workshops to secure budget allocations.",
          "Led the Proof of Concept (PoC) and technical execution of Generative AI (RAG) retrieval systems for internal operations.",
          "Utilized Vibe Coding and Python for rapid prototyping of frontend dashboards, significantly compressing feedback loops and saving 4,000 man-hours."
        ],
        ja: [
          "中長期的な5ヶ年DX戦略ロードマップの策定。現場の潜在的課題を言語化し、管理層との合意形成及び投資予算申請を推進。",
          "社内生成AIコミュニティに参画し、RAG（検索拡張生成）システムのPoC（概念実証）開発および社内へのAI展開を主導。",
          "Vibe Codingを駆使してWebフロントエンドのプロトタイプを高速開発。管理層からの迅速なフィードバックを引き出し開発期間を圧縮。"
        ]
      }
    },
    {
      company: "JGC Global / 日揮グローバル",
      role: {
        zh: "Information Management Leader / 信息管理负责人",
        en: "Information Management Leader",
        ja: "Information Management Leader / インフォメーションマネジメントリーダー"
      },
      period: {
        zh: "2024.11 - 至今",
        en: "2024.11 - Present",
        ja: "2024.11 - 現在"
      },
      description: {
        zh: "服务于印尼 Tangguh UCC 大型数字双胞胎建设项目（TUCC），主导多国籍 10 人团队的跨国信息统筹与数据安全管理。",
        en: "Assigned as Information Management Leader for the Tangguh UCC Project (TUCC) in Indonesia, directing a multi-national team of 10 for digital twin implementations.",
        ja: "Tangguh UCC Project (TUCC) におけるInformation Management Leaderを務め、多国籍チーム（約10名）を指揮。インドネシア駐在。"
      },
      highlights: {
        zh: [
          "全面主导建立符合 BP 标准的数字双胞胎（Digital Twin）数据采录与品质保证工作流标准体系。",
          "负责对接业主（BP）、自研技术人员与第三方供应商，统筹系统需求分析、软件版本管理与开发排程控制。",
          "成功实现首次大型数据无损无差错迁移，成功将 25,058 个高精密标签数据零溢漏交付给业主系统。"
        ],
        en: [
          "Led the implementation of standard workflows and data quality assurance systems for Digital Twin realizations following BP standards.",
          "Coordinated directly with the Client (BP), internal engineering developers, and vendors on requirement scopes and schedule releases.",
          "Successfully executed the primary database migration, delivering 25,058 high-precision tag datasets to the Owner system with zero errors."
        ],
        ja: [
          "BPの厳格な基準に従ったデジタルツイン実現のため、情報管理体制の主導、計画策定、手順書の作成を実施。",
          "客先（BP）の要求に合わせ、自社およびVendor用のデータ管理システム開発をリード。仕様書作成、要件定義、進捗管理を担当。",
          "TUCCプロジェクトの初回のデータ移行において、25,058個のタグデータをエラーなしでオーナーシステムへ完全移行することに成功。"
        ]
      }
    },
    {
      company: "JGC Global / 日揮グローバル",
      role: {
        zh: "Project Engineer / 项目工程师",
        en: "Project Engineer",
        ja: "Project Engineer / プロジェクトエンジニア"
      },
      period: "2023.10 - 2024.10",
      description: {
        zh: "服务于沙特阿拉伯大型 GOSP（油气分离）总包 EPC 项目，作为核心后台项目工程师，主导重大合同变更索赔与模拟调测技术统筹。",
        en: "Assigned to the GOSP Plant EPC Project in Saudi Arabia as a core back-office Project Engineer, managing massive claims, contract change orders, and engineering simulators.",
        ja: "サウジアラビアにおける GOSP プラントプロジェクトにプロジェクトエンジニア（バックオフィス）として参画。"
      },
      highlights: {
        zh: [
          "负责索赔谈判与财务损失挽回，全面梳理设计交界面变更与积压索赔包，为项目最终索赔挽回约 30 亿日元（占总损失的 30%）。",
          "统筹旋转机械的动态系统仿真业务对接、变更指示单（Change Order）审批流与技术规格偏离澄清控制。",
          "组织协调仪表调试专家社区会议，并使用 Python/RPA 技术自主开发设计图纸库文件批处理工具，实现交付图册自动流转。"
        ],
        en: [
          "Led claim recovery and dispute management, collecting scope discrepancies to successfully claim approximately 30 Billion JPY from Aramco.",
          "Coordinated rotating machinery dynamic simulation interfaces, change order evaluations, and deviations reviews.",
          "Orchestrated analyzer package expert panels, and developed customized RPA automations for batch handover documentations."
        ],
        ja: [
          "Zulufプロジェクトにて、請求のタイミングを逃した変更や責任所掌が不明確な変更点を収集・分析。約30億円（損失の30%）のクレーム回収・補填に成功。",
          "回転機械のダイナミックシミュレーション業務の調整、アラムコ（ARAMCO）向け変更指示（Change Order）の調整を担当。",
          "パッケージ計器コミュニティ会議の組織、およびハンドオーバーに向けた設計図書処理を自動化するRPAツールを独自開発。"
        ]
      }
    },
    {
      company: "JGC Global / 日揮グローバル",
      role: {
        zh: "Field QC Engineer / 现场质量控制工程师",
        en: "Field QC Engineer",
        ja: "Field QC Engineer / フィールド品質管理エンジニア"
      },
      period: "2023.03 - 2023.10",
      description: {
        zh: "驻沙特伊拉克巴士拉炼厂项目中国建造场地，全面统筹总重达 23,000 吨、总计 99 个大型复杂钢结构模块的焊接与质量控制。",
        en: "Dispatched to China Module Fabrication Yard for Iraq Basra Refinery Project, overseeing quality control for 99 modular items totaling 23,000 tons.",
        ja: "イラクのバスラプロジェクトにて、中国モジュールヤードでのモジュール製作のフィールド品質管理エンジニアとして駐在。"
      },
      highlights: {
        zh: [
          "现场指挥并统领 10 名专业 QC 检验员，把控大型配管压力试验包（Test Pack）消缺与试压见证，严格监督 AWS D1.1/ASME 焊缝合规度。",
          "创新性推行 WPS（焊接工艺规程）现场考问与焊工激励文化，从源头上杜绝焊接隐患，保障建造质量。",
          "针对现场检验报告书的繁琐录入流程，自主设计研发 Power Automate 云工作流表单系统，荣获日挥集团 QC 部门表彰。"
        ],
        en: [
          "Mentored and directed 10 inspection supervisors on-site, overseeing pipe testing loops, Walk Downs, and ASME/AWS weldments compliance.",
          "Pioneered a WPS (Welding Procedure Specification) awareness campaign in the fabrication yard to build a high-quality welding culture.",
          "Built full-stack Power Automate workflows to streamline on-site inspection report submissions, securing the JGC Department Quality Award."
        ],
        ja: [
          "総重量 23,000 トン、計 99 個のモジュールの品質管理を担当。現場にてQC検査員10名を率いて品質管理業務を統率。",
          "配管テストパックパンチのクローズ処理、配管溶接品質管理、水圧試験アレンジ、Completion Walk Down及びASME/AWS準拠管理を実施。",
          "現場検査レポート自動登録Webフォーム用のPowerAutomateクラウドフローを独自開発。業務効率化への貢献でJGC部門表彰を受賞。"
        ]
      }
    },
    {
      company: "JGC Global / 日揮グローバル",
      role: {
        zh: "Procurement QC Engineer / 采购质量控制工程师",
        en: "Procurement QC Engineer",
        ja: "Procurement QC Engineer / 調達品質管理エンジニア"
      },
      period: "2019.09 - 2023.02",
      description: {
        zh: "负责伊拉克、泰国等多个十亿美元级特大油气化工项目的关键设备采购质量控制（QC/QA）。",
        en: "Managed global procurement quality control (QA/QC) for multiple multi-billion dollar refinery projects in Iraq and Thailand.",
        ja: "イラクやタイの石油化学プロジェクト向けに、グローバル調達機器の品質管理（Procurement QC）業務を担当。"
      },
      highlights: {
        zh: [
          "负责高难度精密设备（包括离心压缩机、往复式压缩机、蒸汽涡轮机系统等）的全球供货商制造过程质量监控。",
          "决策并主持海外制造厂的检验试验计划（ITP），主导大型不符合项报告（NCR）的审核澄清、供货商评级与出厂检验放行。",
          "在极其严苛的时间窗口内累计高标准放行超过 100 个成套关键技术设备包，实现现场核心旋转动设备致命缺陷‘零发生’。"
        ],
        en: [
          "Controlled vendor production processes for critical equipment packages (centrifugal compressors, reciprocating compressors, steam turbines).",
          "Determined and enforced Inspection & Test Plans (ITP), conducted NCR reviews, and executed factory release inspection handovers.",
          "Successfully released 100+ high-value machinery packages under tight schedule pressure, keeping site commissioning defects at zero."
        ],
        ja: [
          "遠心圧縮機、往復圧縮機、蒸気タービンを含む主要な回転機械、空冷表面凝縮器、バルブ、配管材料等の調達品品質管理を担当。",
          "国内外ベンダーのITP（検査・試験計画）を策定・実行。不適合報告書（NCR）の技術的レビュー・承認、出荷前最終検査を担当。",
          "コンプレッサーや蒸気タービンシステム等、100以上のパッケージを検査合格・リリースし、現地での致命的品質不具合ゼロを達成。"
        ]
      }
    },
    {
      company: "Ebara Elliott / 荏原エリオット (Ebara Corp 出向)",
      role: {
        zh: "Project Engineer & Application Engineer / 项目与应用工程师",
        en: "Project Engineer & Application Engineer",
        ja: "Project Engineer & Application Engineer / プロジェクトエンジニア ＆ アプリケーションエンジニア"
      },
      period: "2013.04 - 2019.08",
      description: {
        zh: "从事特大型化工流体机械压缩机与蒸汽轮机组的系统集成研发、联合设计与应用技术提案工作。",
        en: "Engaged in system integration engineering, detailed design, and bid proposal technical integrations for large-scale centrifugal compressors and steam turbines.",
        ja: "特大型流体機械（遠心圧縮機・蒸気タービン）のシステムエンジニアリング設計及びアプリケーション技術提案に従事。"
      },
      highlights: {
        zh: [
          "服务于全球第三大恒力石化（Hengli）乙烯百万吨级压缩机项目，主导机组管线仪表系统（P&ID）设计与辅助系统设计，获业主追加合同采购意向。",
          "协调韩国、阿联酋、中国等跨国 EPC 及供应商，主办开工会（Kick-off）与多方设计审查会议，理顺工程规格偏离表（Clarifications）。",
          "与营业团队紧密联合，向复杂透平机组提出壳体结构改造方案，达成团队最佳销售贡献纪录，累计成交 50 台大型机组。"
        ],
        en: [
          "Engineered detailed P&IDs and auxiliary systems for the world's 3rd largest Hengli Ethylene Compressor project, winning phase 2 extensions.",
          "Served as technical window and hosted kick-off / design reviews with global EPC contractors (Korea, UAE, China) and sub-vendors.",
          "Partnered closely with sales to propose customized casing solutions, securing orders for 50 compressor/turbine units (top company record)."
        ],
        ja: [
          "世界第3位の恒力石化（Hengli）エチレン圧縮機プロジェクトにて、圧縮機パッケージのP&ID設計及び補助機器設計を担当。継続受注を獲得。",
          "韓国、UAE、中国などの多国籍EPCやベンダーとの折衝。設計レビュー会議等を主催し、技術仕様の明確化と調整の中心を担った。",
          "営業と頻繁に連携し、ケーシングソリューションを技術提案。同僚の中で最高数の販売貢献を達成し、計50台の圧縮機受注に成功。"
        ]
      }
    }
  ],
  projects: [
    {
      name: {
        zh: "QC Quest (工程品质管理冒险培训游戏)",
        en: "QC Quest (JRPG Style QC Training Game)",
        ja: "QC Quest (品質管理アドベンチャーゲーム)"
      },
      description: {
        zh: "专为工程品质管理（QC/QA）新人量身定制的日系 JRPG 像素风格视觉小说（AVG）培训游戏。逼真模拟从技术评估到 MDRB 归档审查的完整工程业务冲突，搭载动态 SVG 交互剧情树、时空倒流机制与荣誉证书生成。",
        en: "A retro JRPG-styled AVG training visual novel designed for EPC Project Quality Control (QC/QA) engineers. Simulates real-world engineering dilemmas from technical evaluation to MDRB archiving, featuring an interactive SVG branching plot tree, time-travel rewind, and shareable certificates.",
        ja: "プラントエンジニアリングの品質管理（QC/QA）新入社員向けに設計されたJRPG風AVG研修ゲーム。技術評価からMDRB引渡図書審査までの実務シナリオを再現し、動的SVG分岐ツリー、タイムトラベル巻き戻し機能、修了証書生成を搭載。"
      },
      techStack: ["HTML5", "Vanilla JS", "Vanilla CSS", "SVG Plot Tree", "Canvas Effects", "i18n"],
      demoUrl: "https://qc-game.vercel.app/",
      githubUrl: "https://github.com/YakinikuDon/QCGame"
    },
    {
      name: {
        zh: "XPTI 性格测试 (XP Test)",
        en: "XPTI Subconscious Personality Test",
        ja: "XPTI 性格診断テスト (XP Test)"
      },
      description: {
        zh: "一款极富趣味性与隐私安全的亲密关系潜意识性格测试系统。支持 16 种深层人格量化，搭载流畅的玻璃拟物化动效，使用 html2canvas 实现专属分享卡片的生成。在 B 站及社交平台极受欢迎，完全开源。",
        en: "An engaging, privacy-focused relationship subconscious personality test. Features 16-dimensional scoring, beautiful glassmorphic UI cards, and dynamic shareable result card generation using html2canvas. Highly popular on social media.",
        ja: "親密な関係における潜在意識を探求するプライバシー重視の性格診断システム。美しいグラスモーフィズムデザインとhtml2canvasによる結果のシェア画像生成機能を備え、SNSで話題のオープンソースWebアプリ。"
      },
      techStack: ["HTML5", "Vanilla JS", "Glassmorphic CSS", "html2canvas API", "Dynamic Scoring"],
      demoUrl: "https://xpti.yakinikudon.top/",
      githubUrl: "https://github.com/YakinikuDon/xptest"
    },
    {
      name: {
        zh: "带薪拉屎搭子 (ToiletBuddy)",
        en: "ToiletBuddy (Paid-to-Poop Tracker)",
        ja: "ToiletBuddy (有給トイレットトラッカー)"
      },
      description: {
        zh: "打工人专属的趣味打卡与带薪拉屎效率统筹平台。融合趣味数据分析与日常时间统计，以极简优雅的现代化卡片界面帮助用户追踪“带薪拉屎”带来的被动收益，让繁重的工作拥有一份快乐的日常。",
        en: "A fun, beautifully designed productivity tracker for office workers. Tracks 'paid-to-poop' duration, calculates passive earnings, and presents playful workspace calendars, wrapping everyday tasks in an enjoyable, state-of-the-art UI.",
        ja: "会社員向けのユニークな休憩時間・パッシブ収益トラッキングWebアプリケーション。日常のオフィスライフに楽しさをもたらすデータ視覚化とモダンなカードUIを導入したライフスタイルツール。"
      },
      techStack: ["React", "TypeScript", "Vite", "Local Storage", "Framer Motion", "TailwindCSS"],
      demoUrl: "https://poop.yakinikudon.top/",
      githubUrl: "https://github.com/YakinikuDon/ToiletBuddy"
    },
    {
      name: {
        zh: "「今天午饭吃什么」🎡横滨港未来篇",
        en: "“What to Eat for Lunch Today” 🎡 Minato Mirai",
        ja: "「今日ランチ何を食べよう」🎡みなとみらい編"
      },
      description: {
        zh: "专为日本横滨“港未来 (Minato Mirai)”商业区打造的午餐选择困难终结器。提供覆盖 Landmark Tower、Mark Is 等商圈的美食轮盘抽签，结合智能类型过滤、精美音效与人性化推荐设计。",
        en: "A localized lunch lottery/roulette utility application tailored for office workers and tourists in Minato Mirai, Yokohama. End decision fatigue with a dynamic lottery wheel covering landmarks, detailed filters, and playful UX audio.",
        ja: "横浜みなとみらいエリアのランチ決定に迷うオフィスワーカーや観光客向けルーレットアプリ。お昼ご飯の運命の店を決定するスマートなグルメガイドユーティリティ。"
      },
      techStack: ["React", "TypeScript", "Vite", "Roulette Engine", "Google AdSense", "CSS Transitions"],
      demoUrl: "https://todayslunch-minatomirai.vercel.app/",
      githubUrl: "https://github.com/YakinikuDon"
    }
  ]
};
