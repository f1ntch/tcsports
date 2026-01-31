<template>
  <div class="article-detail">
    <v-container class="py-6">
      <v-btn
        variant="text"
        color="primary"
        class="mb-4"
        :to="{ name: 'dashboard' }"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Dashboard
      </v-btn>

      <v-progress-linear
        v-if="articlesStore.loading && !article"
        indeterminate
        color="primary"
        class="mb-4 rounded"
      />

      <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        rounded="lg"
        class="mb-4"
      >
        {{ error }}
      </v-alert>

      <article v-else-if="article" class="article-detail__content">
        <header class="article-detail__header mb-6">
          <div class="d-flex flex-wrap align-center gap-2 mb-2">
            <v-chip
              v-if="article.sports?.name"
              size="small"
              color="primary"
              variant="tonal"
              rounded="pill"
            >
              {{ article.sports.name }}
            </v-chip>
            <span class="text-caption text-medium-emphasis">
              {{ formatDate(article.created_at) }}
            </span>
          </div>
          <h1 class="article-detail__title text-h4 font-weight-bold">
            {{ article.title }}
          </h1>
          <div
            v-if="article.source"
            class="d-flex align-center flex-wrap gap-2 mt-2"
          >
            <v-chip size="small" color="primary" variant="tonal" rounded="pill">
              {{ article.source }}
            </v-chip>
          </div>
          <div class="d-flex justify-center mt-8 pt-6">
            <v-btn
              variant="tonal"
              color="primary"
              size="small"
              :prepend-icon="
                canShare ? 'mdi-share-variant' : 'mdi-content-copy'
              "
              @click="handleShare"
            >
              {{ canShare ? "Share" : "Copy link" }}
            </v-btn>
          </div>
        </header>

        <section v-if="media.length" class="article-detail__media mb-6">
          <div
            v-for="m in media"
            :key="m.id"
            class="article-detail__media-item mb-4"
          >
            <img
              v-if="m.media_type === 'IMAGE'"
              :src="m.hyperlink"
              :alt="article.title"
              class="article-detail__img rounded-lg"
              loading="lazy"
            />
            <div v-else class="pa-3 rounded-lg bg-surface-variant">
              <a
                :href="m.hyperlink"
                target="_blank"
                rel="noopener"
                class="text-body-2"
              >
                {{ m.media_type }}: {{ m.hyperlink }}
              </a>
            </div>
          </div>
        </section>

        <section v-if="tags.length" class="article-detail__tags mb-6">
          <h2 class="text-subtitle-2 text-medium-emphasis mb-2">Tags</h2>
          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="t in tags"
              :key="t.id"
              size="small"
              variant="outlined"
              rounded="pill"
            >
              {{ t.tag_types?.name }}: {{ t.tagname }}
            </v-chip>
          </div>
        </section>

        <section v-if="articleBody" class="article-detail__body">
          <div
            class="article-detail__body-text text-body-1"
            v-html="articleBodyHtml"
          ></div>
        </section>

        <p v-else class="text-body-2 text-medium-emphasis">
          This article has no full text stored. Title, source, and metadata are
          shown above.
        </p>

        <div class="d-flex justify-center mt-8 pt-6">
          <v-btn
            variant="tonal"
            color="primary"
            size="small"
            :prepend-icon="canShare ? 'mdi-share-variant' : 'mdi-content-copy'"
            @click="handleShare"
          >
            {{ canShare ? "Share" : "Copy link" }}
          </v-btn>
        </div>
      </article>

      <v-snackbar
        v-model="snackbar"
        :timeout="2500"
        color="success"
        location="bottom"
      >
        Link copied to clipboard
      </v-snackbar>
    </v-container>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useArticlesStore } from "@/stores/articles";

const route = useRoute();
const articlesStore = useArticlesStore();

const article = ref(null);
const error = ref("");
const snackbar = ref(false);

const shareUrl = computed(() => {
  if (typeof window === "undefined" || !route.params.id) return "";
  return `${window.location.origin}/article/${route.params.id}`;
});

const canShare = computed(() => {
  return typeof navigator !== "undefined" && !!navigator.share;
});

async function handleShare() {
  if (!shareUrl.value) return;
  const title = article.value?.title ?? "Article";
  const text = article.value?.source
    ? `${title} (${article.value.source})`
    : title;
  if (canShare.value) {
    try {
      await navigator.share({
        title,
        text,
        url: shareUrl.value,
      });
    } catch (e) {
      if (e.name !== "AbortError") copyLink();
    }
  } else {
    copyLink();
  }
}

async function copyLink() {
  if (!shareUrl.value) return;
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    snackbar.value = true;
  } catch {
    // fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = shareUrl.value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    snackbar.value = true;
  }
}

const media = computed(() => {
  if (!article.value?.article_media) return [];
  return Array.isArray(article.value.article_media)
    ? article.value.article_media
    : [];
});

const tags = computed(() => {
  if (!article.value?.article_tags) return [];
  return Array.isArray(article.value.article_tags)
    ? article.value.article_tags
    : [];
});

// Common column names for article full text (DB may use any of these)
const BODY_KEYS = [
  "body",
  "content",
  "full_text",
  "article_text",
  "description",
  "text",
];

const articleBody = computed(() => {
  if (!article.value) return "";
  const raw = BODY_KEYS.map((key) => article.value[key]).find(
    (v) => v != null && String(v).trim() !== "",
  );
  return raw != null ? String(raw).trim() : "";
});

// Escape HTML and preserve line breaks for safe display
const articleBodyHtml = computed(() => {
  const s = articleBody.value;
  if (!s) return "";
  const escaped = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return escaped.replace(/\n/g, "<br>");
});

async function loadArticle() {
  const id = route.params.id;
  if (!id) return;
  article.value = null;
  error.value = "";
  try {
    const data = await articlesStore.fetchArticle(id);
    article.value = data ?? null;
    if (!article.value) error.value = "Article not found.";
  } catch (e) {
    error.value = e.message || "Failed to load article.";
  }
}

onMounted(loadArticle);
watch(() => route.params.id, loadArticle);

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { dateStyle: "medium" });
}
</script>

<style scoped>
.article-detail {
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.article-detail__title {
  line-height: 1.3;
  letter-spacing: 0.01em;
}

.article-detail__img {
  max-width: 100%;
  height: auto;
  display: block;
}

.article-detail__body-text {
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
