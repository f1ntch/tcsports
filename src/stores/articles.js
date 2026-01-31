import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const useArticlesStore = defineStore("articles", () => {
  const articles = ref([]);
  const loading = ref(false);
  const loadingMore = ref(false);
  const totalCount = ref(0);
  const currentPage = ref(0);
  const pageSize = ref(20);

  /** True when there are more articles to load. */
  function hasMore() {
    return articles.value.length < totalCount.value;
  }

  /**
   * Fetch a page of articles, most recent first.
   * Page 1 replaces the list; page > 1 appends.
   */
  async function fetchArticles(page = 1, limit = pageSize.value) {
    if (!isSupabaseConfigured) {
      articles.value = [];
      return { data: [], totalCount: 0 };
    }
    const isFirstPage = page === 1;
    if (isFirstPage) {
      loading.value = true;
      articles.value = [];
      currentPage.value = 0;
    } else {
      loadingMore.value = true;
    }
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    try {
      const { data, error, count } = await supabase
        .from("articles")
        .select("*, sports(name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      if (isFirstPage) {
        articles.value = data ?? [];
        totalCount.value = count ?? 0;
      } else {
        articles.value = [...articles.value, ...(data ?? [])];
      }
      currentPage.value = page;
      return { data: articles.value, totalCount: totalCount.value };
    } finally {
      loading.value = false;
      loadingMore.value = false;
    }
  }

  /** Fetch the next page (for infinite scroll). */
  async function fetchNextPage() {
    if (!hasMore() || loading.value || loadingMore.value) return;
    await fetchArticles(currentPage.value + 1, pageSize.value);
  }

  /** Fetch a single article by id with sport, media, and tags. */
  async function fetchArticle(id) {
    if (!isSupabaseConfigured) return null;
    loading.value = true;
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(
          "*, sports(name), article_media(*), article_tags(*, tag_types(name))",
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } finally {
      loading.value = false;
    }
  }

  return {
    articles,
    loading,
    loadingMore,
    totalCount,
    currentPage,
    pageSize,
    hasMore,
    fetchArticles,
    fetchNextPage,
    fetchArticle,
  };
});
