import { Logger } from "./logger";

/**
 * アプリケーションの設定を管理するクラス。
 * 環境変数からの値の取得と検証を行います。
 */
export class Config {
  /**
   * このクラスはインスタンス化できません。
   * すべてのメソッドは静的メソッドとして提供されます。
   */
  private constructor() {}

  /**
   * 現在の実行環境を取得します。
   * @returns {string} 現在の実行環境（'development', 'production', 'test'など）
   */
  static get env(): string {
    return process.env.NODE_ENV;
  }

  /**
   * APIホストのURLを取得します。
   * @returns {string} APIホストのURL
   * @throws {Error} API_HOST環境変数が設定されていない場合
   */
  static get apiHost(): string {
    const data = process.env.NEXT_PUBLIC_API_HOST;
    if (data === undefined) {
      const e = new Error("API_HOST is not set");
      Logger.error(e);
      throw e;
    }
    return data;
  }
}
