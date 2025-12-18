# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

WebNEI Backend - Minecraft NEI（Not Enough Items）のレシピデータを提供するGraphQL APIサーバー。modpackのレシピデータベースをクエリ可能にする。

## 開発コマンド

```bash
# 依存関係インストール
pipenv install

# 仮想環境有効化（以降のコマンド実行前に必須）
pipenv shell

# サーバー起動（http://localhost:5000/graphql）
python main.py

# データベースマイグレーション（インデックス設定）
python -m src.scripts.prepare_postgres_db

# テスト実行
pytest
pytest tests/graphql/test_user_stickynotes.py  # 単一テスト

# Lint
ruff check .
ruff check . --fix  # 自動修正
```

## アーキテクチャ

### レイヤー構造

```
src/
├── app.py                    # FastAPIアプリケーションファクトリ
├── graphql/
│   ├── schemas/              # GraphQLスキーマ定義（Query, Mutation）
│   ├── resolvers/            # クエリ解決ロジック
│   ├── scalars/              # Strawberry型定義（NEI_Item, NEI_Fluid等）
│   ├── db/
│   │   └── asyncpg.py        # カスタムコネクションプール＆prepared statement管理
│   └── core/config.py        # 環境変数からの設定読み込み
```

### データベース接続

`_PreparedQueryConnectionHandler`クラス（asyncpg.py）がasyncpgのprepared statementを効率的に管理。各クエリに対して専用のコネクションプールを維持し、高速なクエリ実行を実現。

### 主要なGraphQL型

- `NEI_GT_Recipe` - GregTechレシピ（電圧、アンペア、処理時間等を含む）
- `NEI_Base_Recipe` - 基本レシピ（アイテム/流体の入出力）
- `NEI_Item` / `NEI_Fluid` - アイテム・流体データ
- `AssociatedRecipes` - 特定アイテムを使用/生成するレシピ群

### クエリパターン

resolvers/recipe_resolver.pyでは、SQLAコメントとして元のSQLAlchemyクエリが残されている。これらはcompileQueries.ipynbで生SQLへ変換して使用。

## 環境設定

`envs/.env`に以下を設定:
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_SERVER`, `POSTGRES_PORT`, `POSTGRES_DB`
- `HOST_URL`, `HOST_PORT`

## 技術スタック

- Python 3.11 / FastAPI / Strawberry GraphQL
- asyncpg（非同期PostgreSQLドライバ）
- SQLAlchemy 1.4（マイグレーションスクリプト用）
- Ruff（linter）
