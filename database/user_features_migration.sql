-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_articles (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id      BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, article_id)
);

CREATE TABLE IF NOT EXISTS user_interests (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sport_id    BIGINT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, sport_id)
);

ALTER TABLE user_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_articles" ON user_articles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_interests" ON user_interests FOR ALL USING (auth.uid() = user_id);
