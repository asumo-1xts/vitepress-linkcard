import type MarkdownIt from "markdown-it";

export type LinkToCardPlugin =
  MarkdownIt.PluginWithOptions<LinkToCardPluginOptions>;

/*
 *   - https://daringfireball.net/projects/markdown/syntax#link
 *   - https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/title
 *   - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
 */
export interface LinkToCardPluginOptions {
  target?: ATarget /* 在哪里显示链接的 URL，默认：_blank ，即新开 Tab 页打开链接*/;
  classPrefix?: string /* 卡片 DOM 类名前缀，若设置该项，将不注入内链样式，直接注入相关类目。如，'my-docs__link-card' */;
  render?: CardDomRender /* 自定义渲染 DOM Fragment */;
  borderColor?: string; // 輪郭線の色
  bgColor?: string; // 背景色
}

export interface UrlMetadata {
  title?: string;
  description?: string;
  logo?: string;
  [key: string]: unknown; // Add index signature to satisfy Record<string, unknown>
}

export type ATarget = "_self" | "_blank" | "_top" | "_parent";

export interface CardDomRenderOptions {
  href: string;
  linkTitle: string;
  target: ATarget;
  classPrefix?: string;
  borderColor?: string;
  bgColor?: string;
}

export type CardDomRender = (
  data: UrlMetadata,
  options: CardDomRenderOptions,
) => string;
