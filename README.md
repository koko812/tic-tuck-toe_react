# 〇×ゲーム（Reactで作る Tic-Tac-Toe）

React の学習を目的に制作したシンプルな 〇×（Tic Tac Toe）ゲームです。
状態管理・分岐処理・スタイル整理・CPU実装などを通じて、**Reactの設計思想と実践的な構造化**を体験できます。

---

## 🎮 機能一覧

* 3×3 の盤面で交互に「〇（O）」と「×（X）」を配置
* 縦・横・斜めに3つ並ぶと勝利、勝者のラインをハイライト表示
* ゲーム終了後は入力をブロック、リセットボタンで再プレイ可能
* タイトル画面で以下のプレイモードを選択可能：

  * **1人で遊ぶ（普通CPU）**：勝ち筋・防ぎ筋のみを考慮した初級AI
  * **1人で遊ぶ（強いCPU）**：Minimax アルゴリズムによる無敵AI
  * **2人で遊ぶ**：ローカル対戦

---

## 🛠 技術スタック・設計方針

* **React**（hooksベース）

  * `useState` による状態管理
  * JSX による宣言的UI
* **コンポーネント構成**

  * `App.js`（全体の画面管理・状態制御）
  * `Square.jsx`（マス目のUI）
  * `logic/` ディレクトリに CPU・勝敗判定ロジックを集約
* **スタイル管理**

  * CSS Modules を採用し、UIごとのスコープ分離＆保守性を確保
  * `App.module.css` / `Square.module.css` に分離済

---

## 📁 ディレクトリ構成（抜粋）

```
src/
├── App.js
├── App.module.css
├── components/
│   ├── Square.jsx
│   └── Square.module.css
├── logic/
│   ├── calculateWinner.js
│   ├── cpuMinimax.js
│   └── cpuSimple.js
├── index.js
```

---

## 🚀 起動方法

```bash
git clone https://github.com/your-username/tic-tac-toe-react.git
cd tic-tac-toe-react
npm install
npm start
```

ブラウザで `http://localhost:3000` にアクセスしてプレイできます。

---

## 📓 CHANGELOG・学習の足跡

開発の改善履歴や学びは [`CHANGELOG.md`](./CHANGELOG.md) に詳しく記録しています。

---
[![Image from Gyazo](https://i.gyazo.com/05244510b2611e05cf16473d126f6d23.png)](https://gyazo.com/05244510b2611e05cf16473d126f6d23)
---

## ✍️ 制作メモ（学びの軌跡）

このアプリは「Reactの基本を押さえつつ、設計・拡張・改良を楽しみたい」という思いから始まりました。

* **状態とUIの分離**
* **CPUの戦略思考（Minimax）**
* **ファイル構成の整理・分離**
* **CSS Modulesによるスコープ付きスタイル管理**

といったReactらしい設計思想に沿って改善を重ねています。

---

## 📌 今後の拡張予定（アイデア）

* 勝敗時のアニメーション演出（例：勝利ラインが光るなど）
* スコア記録機能（連勝数、対戦履歴など）
* プレイヤー名の入力・表示
* 音声やサウンドによるUX向上
* 5×5モードやCPUレベル調整への拡張

---

Reactで「小さく始めて、楽しく育てる」体験を得たい方におすすめの教材です 🧠🎮
