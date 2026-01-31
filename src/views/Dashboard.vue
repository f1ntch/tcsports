<template>
  <div class="dashboard-page">
    <v-container class="dashboard py-6">
      <header class="d-flex justify-space-between align-center mb-8">
        <div>
          <h1 class="text-h4 font-weight-bold text-primary">Dashboard</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">
            Welcome back, {{ auth.user?.email }}
          </p>
        </div>
        <v-btn color="error" variant="outlined" @click="handleSignOut">
          Sign Out
        </v-btn>
      </header>

      <section class="articles-section">
        <h2 class="text-h6 font-weight-medium mb-4 text-medium-emphasis">
          Recent articles
        </h2>

        <v-progress-linear
          v-if="articlesStore.loading"
          indeterminate
          color="primary"
          class="mb-4 rounded"
        />

        <v-alert
          v-else-if="articlesStore.articles.length === 0"
          type="info"
          variant="tonal"
          rounded="lg"
          class="mb-4"
        >
          No articles yet.
        </v-alert>

        <div v-else class="articles-list">
          <article
            v-for="article in articlesStore.articles"
            :key="article.id"
            class="article-card"
          >
            <v-card
              variant="elevated"
              rounded="lg"
              class="article-card__inner pa-4"
              elevation="0"
            >
              <div
                class="d-flex flex-column flex-sm-row justify-space-between align-start gap-2 mb-2"
              >
                <h3 class="article-card__title text-h6 font-weight-medium">
                  {{ article.title }}
                </h3>
                <span
                  class="article-card__date text-caption text-medium-emphasis flex-shrink-0"
                >
                  {{ formatDate(article.created_at) }}
                </span>
              </div>
              <p
                v-if="article.source"
                class="article-card__source text-body-2 text-medium-emphasis mb-3"
              >
                {{ article.source }}
              </p>
              <div class="d-flex align-center flex-wrap gap-2">
                <v-chip
                  v-if="article.sports?.name"
                  size="small"
                  color="primary"
                  variant="tonal"
                  rounded="pill"
                >
                  {{ article.sports.name }}
                </v-chip>
                <v-chip
                  v-if="article.language_code"
                  size="x-small"
                  variant="outlined"
                  rounded="pill"
                >
                  {{ article.language_code }}
                </v-chip>
              </div>
            </v-card>
          </article>

          <div ref="sentinelRef" class="scroll-sentinel" aria-hidden="true" />

          <div
            v-if="articlesStore.loadingMore"
            class="d-flex justify-center py-6"
          >
            <v-progress-circular indeterminate color="primary" size="32" />
          </div>
          <p
            v-else-if="
              articlesStore.articles.length > 0 && !articlesStore.hasMore()
            "
            class="text-center text-caption text-medium-emphasis py-4"
          >
            You've seen all {{ articlesStore.totalCount }} articles.
          </p>
        </div>
      </section>
    </v-container>

    <v-btn
      class="fab-get-newest"
      color="primary"
      size="small"
      variant="flat"
      rounded="pill"
      :loading="articlesStore.loading"
      @click="refreshArticles"
    >
      Get Newest
    </v-btn>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useArticlesStore } from "@/stores/articles";

const auth = useAuthStore();
const articlesStore = useArticlesStore();
const router = useRouter();
const sentinelRef = ref(null);

let observer = null;

function setupObserver() {
  if (observer || !sentinelRef.value) return;
  observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (
        entry?.isIntersecting &&
        articlesStore.hasMore() &&
        !articlesStore.loading &&
        !articlesStore.loadingMore
      ) {
        articlesStore.fetchNextPage();
      }
    },
    { rootMargin: "200px", threshold: 0 },
  );
  observer.observe(sentinelRef.value);
}

onMounted(() => {
  articlesStore.fetchArticles(1, 20);
});

watch(
  sentinelRef,
  (el) => {
    if (el) setupObserver();
  },
  { flush: "post" },
);

onUnmounted(() => {
  observer?.disconnect();
});

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { dateStyle: "medium" });
}

async function refreshArticles() {
  await articlesStore.fetchArticles(1, 20);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function handleSignOut() {
  await auth.signOut();
  router.push("/");
}
</script>

<style scoped>
.dashboard-page {
  position: relative;
  padding-bottom: 4rem;
}

.dashboard {
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.fab-get-newest {
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-card__inner {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.article-card__inner:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.article-card__title {
  line-height: 1.35;
  letter-spacing: 0.01em;
}

.scroll-sentinel {
  height: 1px;
  width: 100%;
  pointer-events: none;
}
</style>
