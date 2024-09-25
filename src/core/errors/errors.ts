/**
 * アプリケーション固有のエラークラス
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * バリデーションエラー
 */
export class ValidationError extends AppError {
  constructor(message: string = "入力データが不正です") {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * 不明なエラー
 */
export class UnknownError extends AppError {
  constructor(message: string = "予期しないエラーが発生しました") {
    super(message);
    this.name = "UnknownError";
  }
}
