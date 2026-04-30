/**
 * SPECIAL CONTENTS 3 本のストーリーデータ。
 * トップページ（`/`）の SPECIAL CONTENTS セクションと
 * SPECIAL CONTENTS インデックスページ（`/special/`）の両方から参照する。
 *
 * `bg` は `images/...` から始まる相対パス断片。
 * 参照側で `basePath` を前置して `${basePath}${bg}` の形で使う。
 */
export interface SpecialStory {
  slug: "crosstalk" | "project" | "talk";
  num: string;
  category: string;
  /** 単一行版の見出し（トップで使用） */
  title: string;
  /** 2 行分割版の見出し（SPECIAL CONTENTS インデックスのバナーで使用） */
  titleLines: [string, string];
  sub: string;
  /** basePath 相対のバッググラウンド画像パス */
  bg: string;
  avatars: number;
}

export const specialStories: SpecialStory[] = [
  {
    slug: "crosstalk",
    num: "01",
    category: "クロストーク",
    title: "若手が語るはたらく環境",
    titleLines: ["若手が語る", "はたらく環境"],
    sub: "入社3年目社員に聞いてみた！会社のリアル",
    bg: "images/special/special_01/hero.jpg",
    avatars: 3,
  },
  {
    slug: "project",
    num: "02",
    category: "プロジェクトストーリー",
    title: "妥協なき、食の未来への挑戦",
    titleLines: ["妥協なき、", "食の未来への挑戦"],
    sub: "開発若手社員×中堅先輩社員",
    bg: "images/special/special_02/hero.jpg",
    avatars: 2,
  },
  {
    slug: "talk",
    num: "03",
    category: "スペシャルトーク",
    title: "ホシザキの技術が作る未来",
    titleLines: ["ホシザキの技術が", "作る未来"],
    sub: "ホシザキの開発責任者による特別トーク",
    bg: "images/special/special_03/hero.jpg",
    avatars: 1,
  },
];
