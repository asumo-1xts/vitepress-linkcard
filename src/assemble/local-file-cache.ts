import { isPureObject } from "@luckrya/utility";
import fs from "node:fs";

const CONFIG_FILE = () => `${process.cwd()}/.linkcardrc`;

export default class LocalFileCache<V extends Record<string, unknown>> {
  constructor() {}

  /**
   * @param data
   */
  private setFile(data: Record<string, V>) {
    let content = data;
    const _content = this.readFile();
    if (_content) {
      content = Object.assign(_content, content);
    }
    fs.writeFileSync(CONFIG_FILE(), JSON.stringify(content));
  }

  /**
   * @returns
   */
  private readFile(): Record<string, V> | undefined {
    const content = fs.readFileSync(CONFIG_FILE(), "utf-8");
    const data = JSON.parse(content);
    if (isPureObject(data)) return data;

    return undefined;
  }

  /**
   * @param url
   * @returns
   */
  has(url: string) {
    return !!this.get(url);
  }

  /**
   * @param url
   * @returns
   */
  get(url: string) {
    const cache = this.readFile();
    return cache?.[url];
  }

  /**
   * @param url
   * @param data
   */
  set(url: string, data: V) {
    this.setFile({ [url]: data });
  }
}
