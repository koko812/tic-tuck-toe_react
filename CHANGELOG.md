# CHANGELOG
## [v1.7.0] - 2025-05-18

### 🧹 コード整理・構造改善

- アプリの構成を**機能ごとにファイル分割**し、保守性・拡張性を大幅に向上
  - Squareコンポーネントを `components/Square.jsx` に分離
  - CPUロジック（simple / minimax）を `logic/` ディレクトリに整理
  - 勝利判定処理 `calculateWinner` もロジックとして切り出し
- それぞれが明確な責務を持つ構造へと再設計し、拡張（例：ボード拡大）も見据えた設計に

---

### 🎨 CSS Modules対応によるスタイル管理の改善

- すべてのスタイル定義をインラインから `CSS Modules` に移行し、クラス名の衝突を回避
  - `App.module.css` に画面全体のレイアウト・ボタンなどのスタイルを集約
  - `Square.module.css` にマス目のスタイル（通常・X・O・勝利ハイライト）を定義
- これにより **JSXがロジック中心になり、スタイルと見た目の責務が分離**
- スタイル変更やデザイン調整が CSS 側で完結するようになり、UI開発が効率化

---

### 📦 改善の効果

- コード全体が読みやすくなり、**今後の機能追加（アニメーション、テーマ切替など）が容易に**
- スタイルの適用範囲が明示的になり、**不意のレイアウト崩れを防止**
- プレイヤー体験には直接影響しないが、開発体験が大きく向上

---

### 🧩 今後の拡張候補

- `Board.jsx` などの中間コンポーネントの導入によるUIロジックの更なる分離
- styled-components や TailwindCSS への切り替え検討
- スタイル共通化（ボタン系・ラベル系）のデザインシステム化

</br></br></br>
## [v1.6.0] - 2025-05-18

### 💡 改善ポイント

- タイトル画面のモード選択ボタンを横並びから縦並びに変更し、見やすさを向上
- 各ボタンのテキスト内に改行を挿入し、説明を2行で分かりやすく表示
- ボタンの幅を固定し中央揃えに調整して、画面レイアウトの安定化を実現

---

### 🧠 強いCPUロジック（Minimax）導入とその解説

- 3×3の〇×ゲームに最適な、**Minimaxアルゴリズム**による強いCPUモードを実装。
- Minimaxはゲームの全ての可能な手順を再帰的に探索し、最善手を先読みして選択するアルゴリズム。
- CPU（自分）は勝利スコア＋10、敗北は−10、引き分けは0で局面を評価し、最大スコアを狙う。
- 相手はCPUにとって最悪の手を選ぶ（最小スコアを狙う）ため、両者が最善手を選ぶ想定で探索。
- 再帰的に空きマスを試しながら、勝敗が決まっていれば評価値を返し、そうでなければさらに先を探索し続ける。
- これにより、**全ての手の組み合わせ（ゲームツリー）を深さ優先で読み切る**動作を実現している。
- 3×3の〇×ゲームでは、この探索でCPUはほぼ無敵となる。
- 実装の中心は`findBestMoveMinimax`関数と、その内部の`minimax`関数。
- 今後は探索高速化や難易度調整の拡張も視野に。

---

### 🔍 Minimax探索のイメージ（ゲームツリー）
                    [現在の盤面]
                  /       |       \
          [空きマスAに置く] [空きマスBに置く] [空きマスCに置く]
            /       \           ...            /       \
  [相手の手番：空きマスD] [空きマスE]          ...    [空きマスF] ...
       /      \                                      /       \
  [CPU手番：空きマスG] [空きマスH]              [CPU手番：空きマスI] ...
    ...            ...                                ...

- CPUと相手が交互に手を置く全可能手を、木構造（ゲームツリー）として深さ優先で探索する
- 葉（末端）の局面で勝敗判定しスコアを決定し、スコアを上位ノードへ伝搬
- これにより最善の一手を決定する

---

今回のCPU強化により、〇×ゲームの戦略性と対戦の面白さが大きく向上しました。
</br></br></br>


## [v1.5.0] - 2025-05-18

### 💡 思考と気づきの流れ

- 1人プレイ（対CPU）モードに、戦略性を持たせたいと考えた。
- 単なるランダムでは「対戦している感」が出ず、すぐに飽きる。
- そこで、**勝ち筋／防ぎ筋の読み取りロジックを導入**し、CPUが「考えているように見える」動きを実現した。

### 🤖 実装されたCPUロジックの戦略（レベル1）

以下の優先順位で打つ場所を決定：

1. 自分（O）が今すぐ勝てる場所があれば置く  
2. 相手（X）が次に勝ちそうな場所があれば防ぐ  
3. それ以外はランダムに置く

### 🧠 アルゴリズム解説：勝てる／防げる手を見つける方法

8つの勝利ライン（横・縦・斜め）をすべて走査して、次のように判定：

```js
for (const [a, b, c] of lines) {
  const line = [squares[a], squares[b], squares[c]];
  const marks = line.filter(Boolean);

  if (
    marks.filter(m => m === myMark).length === 2 && // 自分のマークが2つ
    line.includes(null)                             // かつ空きマスが1つ
  ) {
    return [a, b, c].find(i => squares[i] === null); // → 勝てる場所
  }
}
```

#### ✅ 解説ポイント：

- `marks.filter(...)`：自分のマークが2つあるかを確認
- `line.includes(null)`：空きマスがあるかを確認
- `.find(...)`：その空きマスの index を返す

このロジックを `myMark = 'O'`（攻撃）／`opponentMark = 'X'`（防御）それぞれに適用。

### 🎲 最後の手段：ランダム選択（fallback）

もし勝ち筋も防ぎ筋もない場合は、空いているマスからランダムに選ぶ：

```js
const emptyIndices = squares
  .map((v, i) => v === null ? i : null)
  .filter(i => i !== null);

return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
```

### 🎮 UI・体験の変化

- ブロックしてくることで **「対戦している感覚」** が明確に生まれた。
- プレイヤーに「読まれている」と感じさせる動きが加わり、緊張感が増した。
- コード構造はシンプルなまま、**戦略レベルを段階的に強化できることも確認**。

### 🧩 次の改善アイデア

- より強い CPU（Minimax アルゴリズム）による無敵AI化  
- 難易度切り替え（easy / hard）  
- スコアや対戦履歴の記録  
- プレイヤー名の入力・表示  
- 音・アニメーションによる演出の強化
</br></br></br>


## [v1.4.0] - 2025-05-18

### 💡 気づきと思考の流れ

- React の状態遷移の理解を深める目的で、タイトル画面とゲーム画面を切り替える設計を導入。
- さらにプレイ体験を拡張するため、「1人プレイ（CPU）」と「2人プレイ」のモードを追加。
- 実装後の動作確認中に、「タイトルに戻る」ボタンがゲーム画面で表示されていない問題に気づく。
  - 実は表示はされていたが、UIの下部に押し出されて視認できなかったことが判明。
  - スタイル調整とDOM構造の整理により、確実に見えるように修正。

---

### ✨ 変更内容（実装ステップ）

#### ✅ プレイモード選択の導入
- `mode`（`'single'` / `'multi'`）という状態を新たに導入。
- タイトル画面でモード選択を行い、選択後に `setView('game')` でゲーム画面へ遷移。

#### ✅ CPUロジック（1人プレイ時）
- 人間（X）が手を置いたあと、O（CPU）がランダムな空マスを1つ選んで自動配置。
- `setTimeout` により、少し間をあけて応答する自然な振る舞いに。

#### ✅ 「タイトルに戻る」ボタンの配置修正
- ゲーム画面下部に常時表示されるようにしていたが、画面内で埋もれていたため、構造とスタイルを見直し。
- `resetButton` と同列に配置し、視認性と操作性を向上。

---

### 🧪 デバッグ過程と気づき

- 「タイトルに戻るボタンが表示されない」という問題が発覚。
- コード上には確かに存在しており、実際は**描画はされていたが視認されていなかった**。
- 要因：`styles.returnButton` により `marginTop` などが設定されていたが、前後のレイアウトとの関係で押し出されていた。
- 対処：ボタンの配置構造を整理し、`resetButton` の直下に配置することで解決。

---

### 🎯 次の改善候補

- CPUの強化（最善手探索ロジックの導入）
- スコア保存・連勝数のトラッキング
- プレイヤー名の入力・表示
- 勝敗決定後の演出（アニメーション、サウンドなど）

---
</br></br></br>

## 🧠 Reactの設計思想と状態管理の学び

### ✅ 状態とUIの明確な分離
Reactでは、UIを「状態の関数」として捉えることで、**状態が変わればUIが自動的に再描画される**という一貫性のある仕組みを提供している。  
このため、直接変数を書き換えるのではなく、`useState` などを通じて明示的に状態を管理する必要がある。

### ✅ useState の役割
`useState` は状態変数と、その更新用の関数（例: `setView`）のペアを返す。  
この関数を使うことで React は「状態が変わった」と感知し、必要なコンポーネントを再描画する。  
→ **ただの変数 = React は無視する  
→ `useState` 管理下の変数 = 自動再描画対象**

### ✅ 単方向データフロー（One-way Data Flow）
React は「状態 → UI」という方向にしかデータが流れない。  
このことで副作用を減らし、バグの温床になりやすい「DOMの直接操作」や「状態と表示の乖離」を防いでいる。

### ✅ 状態遷移による画面切り替え
`view` のように状態を定義し、条件分岐（`if (view === 'title')` など）によって**異なるUIを切り替える設計**は、状態駆動UIの典型例。  
状態が複雑になっても、すべての画面やコンポーネントの表示ロジックを「状態のみに依存」させることで、UIの予測可能性と保守性が高まる。

### ✅ Flux との関連
Flux は、React と親和性の高いアーキテクチャであり、「状態 → UI → アクション → 状態」という**明快な一方向データ循環**を明文化したモデル。  
状態の拡張や共有が必要になる場面では、Flux や Redux のような構造への移行も自然な流れである。

---

このように、React の思想は「UIは状態の反映である」という原則を軸に、コードをシンプルで再現可能なものに保とうとしている。
</br></br></br>

## [v1.3.0] - 2025-05-18

### 💡 気づきと思考の流れ

- 勝者が現れても、どのマスが揃ったのかが画面上からは分かりづらいと感じた。
- 「勝利ラインを強調表示する」ことで、プレイの決着が視覚的に伝わるようにしたい。
- `calculateWinner` 関数はこれまで勝者しか返していなかったが、3つ並んだ index 情報を付加すれば、UI 側で反映できると気づいた。

---

### ✨ 変更内容（差分の要点）

#### ✅ 勝者ライン情報の返却
- `calculateWinner` を拡張し、勝者だけでなく勝利した 3マスの index を含む `{ winner, line }` オブジェクトを返すように変更。

#### ✅ ハイライトの状態管理
- 勝利ラインの index を元に `highlightSquares` を構築し、各マスがハイライト対象かを判定。

#### ✅ Square コンポーネントの改修
- `highlight` prop を追加し、true の場合に `lightyellow` 背景色を付与。
- スタイル合成時に `...styles.highlight` を条件付きでマージ。

---

### 🎨 UI改善の効果

- 勝者のマスが視覚的に一目瞭然となり、対戦の決着が伝わりやすくなった。
- `X/O` の色分けに加えて背景色の演出も加わり、プレイ体験がよりリッチに。

</br></br></br>


## [v1.1.0] - 2025-05-18

### 💡 気づきと思考の流れ

- JSXに直接書いていた `<button>` を `<Square>` コンポーネントとして切り出した方が再利用しやすいことに気づいた。
- スタイルがベタ書きだと拡張に不向きなので、`styles` オブジェクトで管理した方がスッキリすると判断。
- スマホでの表示崩れを防ぐために、サイズを `px` から `vw` ベースに変更した。
- `flexWrap` はレイアウト崩れに強いが、今回のように「3×3 の固定構造」が重要な場面ではむしろ使わない方が良いと気づいた。

---

### ✨ 変更内容（段階的）

#### ✅ コンポーネント分離
- `<Square>` コンポーネントを新たに定義し、`value` と `onClick` を props 経由で受け取るように変更。
- これにより、JSX の重複コードが削減され、読みやすくなった。

#### ✅ スタイルの外部化
- `styles` オブジェクトを導入し、`container`, `boardRow`, `square`, `resetButton` にスタイルを整理。
- 今後のテーマ変更やデザイン調整が容易に。

#### ✅ レスポンシブ対応
- マスサイズに `20vw`, `maxWidth: 80px` 等を採用し、画面幅に応じてスケール。
- フォントサイズも `6vw` とし、スマホでも視認性を保つ設計に。

#### ✅ 無駄なスタイルを削除
- `flexWrap: 'wrap'` を `boardRow` から削除。
- マス目が折り返されると3×3構造が崩れるため、固定表示を優先。

---

### 🧪 次の改善候補

- 勝者のマスをハイライトする機能
- プレイ履歴（undo）の実装
- UIコンポーネントのファイル分割
- テーマ切り替え（ダークモードなど）

---

</br></br></br>


## 2025-05-18

### Added
- 最初の 〇× ゲーム（Tic Tac Toe） を実装
- `handleClick` や `calculateWinner` 関数でロジック構成
- React の状態管理（useState）を導入

### Changed
- ボタンの見た目を整えるために style オブジェクトを導入


### Refactored
- スタイルをベタ書きから `styles` オブジェクトにまとめて整理
- JSX の見通しがよくなった

### Next
- Square コンポーネントを別ファイルに分割
- 勝者マスのハイライト対応

