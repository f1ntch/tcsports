# Supabase Triggers & Functions

Execute these SQL files in Supabase SQL Editor in the following order:

## 1. `process_article_classification.sql`
Function that processes LLM classification JSON and updates:
- `sports` table (creates sport if not exists)
- `articles.sport_id` 
- `article_tags` (creates tags from classification fields)

## 2. `trigger_process_classification.sql`
Trigger on `classification` table that automatically calls `process_article_classification()` when a new classification is inserted.

## 3. `trigger_classify_article.sql`
Trigger on `articles` table that calls the Edge Function when `indicator` changes from 0 to 1.

## 4. `reset_indicator_3x.sql`
Cron job function that marks articles as fresh (indicator=1) every 20 seconds.

---

## Flow:
1. Cron job sets `indicator = 1` on articles
2. `trigger_classify_article` fires → calls Edge Function
3. Edge Function calls LLM → inserts into `classification` table
4. `trigger_process_classification` fires → processes JSON into tags/sports

