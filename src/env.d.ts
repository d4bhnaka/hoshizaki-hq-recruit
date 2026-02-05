/// <reference types="astro/client" />

declare module "*.svg" {
  const content: {
    src: string;
    width?: number;
    height?: number;
  };
  export default content;
}

// fetchpriority属性の型定義を追加
declare namespace JSX {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    fetchpriority?: "high" | "low" | "auto";
  }
}
