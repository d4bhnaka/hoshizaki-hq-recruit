// ============================================================================
// 社員紹介 一覧ページのカードデータ（src/pages/person.astro が参照）
//   - 表示順 = Figma の並び順（左上→右下、4 列。node 978-2031 / PersonCard_01〜15）。
//   - slug は掲載順の連番。詳細データ src/data/personDetails.ts の slug、
//     カード写真 person<NN>.jpg、URL(/person/NN/) と一致させる。
//   - body（キャッチコピー）は writing/sources の確定原稿どおり（personDetails.title と一致）。
//   - jobType（職種）は Figma カードのメタ行表記（node 837:4547 ほか）。
//     一覧カードと個別ページ（person/[slug].astro）のプロフィール双方で「職種」として表示する。
//     ここが職種・入社年の単一ソース（旧 personDetails.dept / year は廃止）。
//   - category（技術系 / 企画管理系）は Figma のカード左下タグ表記。
//   - tags = 絞り込みトークン: カテゴリ / 文理 / 入社区分(newgrad|midcareer)。
//     新卒/中途バッジ（「2024年 新卒入社」等）は year と tags の newgrad|midcareer から生成する
//     ため、入社区分の真実の置き場所は tags 側に一本化している（フィルターと表示を同期）。
// ============================================================================

export interface Person {
  /** URL slug。詳細データ(personDetails)・写真(person<NN>.jpg) と一致（"01" → /person/01/） */
  slug: string;
  /** カード写真ファイル名（public/images/person/ 配下）。base はページ側で付与 */
  image: string;
  /** 職種（カードのメタ行・左／青文字）。Figma 837:4547 のメタ行に対応 */
  jobType: string;
  /** 入社年（"2024年"）。新卒/中途は tags(newgrad|midcareer) と組み合わせてバッジ表示 */
  year: string;
  /** カード見出し（／で改行）。Figma の各カード見出しと一致 */
  body: string;
  /** カード左下のカテゴリタグ。Figma 表記に忠実（技術系 / 企画管理系） */
  category: string;
  /** 絞り込み用トークン: カテゴリ / 文理 / 入社区分(newgrad|midcareer) */
  tags: string[];
  /** 参考：社員名（writing/sources のデータ。カードには非表示） */
  name: string;
}

/**
 * 入社年の表記文言を生成する。"◯◯年 新卒入社" / "◯◯年 中途入社"。
 * 新卒/中途は tags(newgrad|midcareer) から判定（入社区分の単一ソース）。
 * 一覧カードのバッジと個別ページのプロフィールで共用する。
 */
export function entryLabel(person: Pick<Person, "year" | "tags">): string {
  const suffix = person.tags.includes("midcareer") ? "中途入社" : "新卒入社";
  return `${person.year} ${suffix}`;
}

export const persons: Person[] = [
  {
    slug: "01",
    name: "横山千穂",
    image: "person01.jpg",
    jobType: "開発設計",
    year: "2014年",
    body: "「これはお母さんが／作った製品だよ」と／言える仕事。",
    category: "技術系",
    tags: ["tech", "science", "newgrad"],
  },
  {
    slug: "02",
    name: "山本凌大",
    image: "person02.jpg",
    jobType: "開発設計",
    year: "2017年",
    body: "確かな土台の上で、／まだ誰もやっていない／ことに挑む。",
    category: "技術系",
    tags: ["tech", "science", "newgrad"],
  },
  {
    slug: "03",
    name: "古田彰謙",
    image: "person03.jpg",
    jobType: "生産技術",
    year: "2024年",
    body: "挑戦できる環境で、／ものづくりを／支える人になる。",
    category: "技術系",
    tags: ["tech", "science", "newgrad"],
  },
  {
    slug: "04",
    name: "佐々琢磨",
    image: "person04.jpg",
    jobType: "品質保証",
    year: "2022年",
    body: "お客様の安心を、／品質で支える。",
    category: "技術系",
    tags: ["tech", "science", "midcareer"],
  },
  {
    slug: "05",
    name: "南潤哉",
    image: "person05.jpg",
    jobType: "社内SE",
    year: "2025年",
    body: "「食」を支える、／世界で挑み続ける／強固な企業へ",
    category: "企画管理系",
    tags: ["admin", "science", "newgrad"],
  },
  {
    slug: "06",
    name: "勝部葵",
    image: "person06.jpg",
    jobType: "生産技術",
    year: "2024年",
    body: "島根から世界へ。／ものづくりで／未来をつくる",
    category: "技術系",
    tags: ["tech", "science", "newgrad"],
  },
  {
    slug: "07",
    name: "武田大地",
    image: "person07.jpg",
    jobType: "品質保証",
    year: "2020年",
    body: "地元・島根に／貢献したい想いが／私の原点。",
    category: "技術系",
    tags: ["tech", "science", "newgrad"],
  },
  {
    slug: "08",
    name: "野村健人",
    image: "person08.jpg",
    jobType: "生産管理",
    year: "2024年",
    body: "地元で、世界で。／長く働ける／会社を選んだ。",
    category: "企画管理系",
    tags: ["admin", "science", "newgrad"],
  },
  {
    slug: "09",
    name: "山根一眞",
    image: "person09.jpg",
    jobType: "生産管理",
    year: "2024年",
    body: "安定供給で、／お客様の期待に応える。",
    category: "企画管理系",
    tags: ["admin", "humanities", "midcareer"],
  },
  {
    slug: "10",
    name: "加藤圭二",
    image: "person10.jpg",
    jobType: "購買",
    year: "2020年",
    body: "自分の仕事が、／暮らしの中で、／形になる。",
    category: "企画管理系",
    tags: ["admin", "science", "newgrad"],
  },
  {
    slug: "11",
    name: "山羽紗由",
    image: "person11.jpg",
    jobType: "国内販売促進",
    year: "2025年",
    body: "この人たちと働きたい。／そう思えた会社。",
    category: "企画管理系",
    tags: ["admin", "humanities", "newgrad"],
  },
  {
    slug: "12",
    name: "東龍吾",
    image: "person12.jpg",
    jobType: "海外事業企画",
    year: "2016年",
    body: "海外事業のさらなる拡大。／そのミッションを／実現へ導く。",
    category: "企画管理系",
    tags: ["admin", "humanities", "newgrad"],
  },
  {
    slug: "13",
    name: "呉瑋芳",
    image: "person13.jpg",
    jobType: "海外グループ管理",
    year: "2025年",
    body: "限界を決めない。／挑戦が私の／世界を広げる。",
    category: "企画管理系",
    tags: ["admin", "humanities", "midcareer"],
  },
  {
    slug: "14",
    name: "冨江圭佑",
    image: "person14.jpg",
    jobType: "人事",
    year: "2010年",
    body: "人を支える仕事で、／信頼される存在に。",
    category: "企画管理系",
    tags: ["admin", "humanities", "newgrad"],
  },
  {
    slug: "15",
    name: "河村真由",
    image: "person15.jpg",
    jobType: "経理",
    year: "2022年",
    body: "語学を武器に、／世界No.1へ挑む／会社を選んだ。",
    category: "企画管理系",
    tags: ["admin", "humanities", "newgrad"],
  },
];
