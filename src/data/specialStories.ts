/**
 * SPECIAL CONTENTS 3 本のストーリーデータ。
 * トップページ（`/`）の SPECIAL CONTENTS セクションと
 * SPECIAL CONTENTS インデックスページ（`/special/`）の両方から参照する。
 *
 * 画像は配列インデックス（1 始まり）から導出する。参照側で basePath を前置する:
 *   背景:     `${basePath}images/special/0{n}.png`
 *   アバター:  `${basePath}images/special/sp0{n}_pic0{m}.png`
 */
export interface SpecialStory {
  slug: "crosstalk" | "project" | "special-talk";
  num: string;
  category: string;
  /** 単一行版の見出し（トップで使用） */
  title: string;
  /** 2 行分割版の見出し（SPECIAL CONTENTS インデックスのバナーで使用） */
  titleLines: [string, string];
  sub: string;
  /** 出演者アバターの枚数（sp0{n}_pic0{m}.png の枚数に対応） */
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
    avatars: 4,
  },
  {
    slug: "project",
    num: "02",
    category: "プロジェクトストーリー",
    title: "互いの知恵を重ね、前例なきモノづくりへ。",
    titleLines: ["互いの知恵を重ね、", "前例なきモノづくりへ。"],
    sub: "設計×生産技術、職種を越えた共創",
    avatars: 2,
  },
  {
    slug: "special-talk",
    num: "03",
    category: "スペシャルトーク",
    title: "ホシザキの技術、その未来とは？",
    titleLines: ["ホシザキの技術、", "その未来とは？"],
    sub: "ホシザキの開発責任者による特別トーク",
    avatars: 1,
  },
];
