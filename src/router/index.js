import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register.vue"),
    meta: { guest: true },
  },
  {
    path: "/interests",
    name: "interests",
    component: () => import("@/views/Interests.vue"),
    meta: { auth: true },
  },
  {
    path: "/live",
    name: "live",
    component: () => import("@/views/LiveFeed.vue"),
  },
  {
    path: "/article/:id",
    name: "article",
    component: () => import("@/views/ArticleDetail.vue"),
  },
  {
    path: "/archive",
    name: "archive",
    component: () => import("@/views/Archive.vue"),
    meta: { auth: true },
  },
  {
    path: "/preferences",
    name: "preferences",
    component: () => import("@/views/Preferences.vue"),
    meta: { auth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/Profile.vue"),
    meta: { auth: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    redirect: { name: "live" },
  },
  {
    path: "/matches",
    name: "matches",
    component: () => import("@/views/Matches.vue"),
  },
  {
    path: "/standings/:leagueId?",
    name: "standings",
    component: () => import("@/views/Standings.vue"),
  },
  {
    path: "/team/:teamId",
    name: "team",
    component: () => import("@/views/Team.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.loading) {
    await auth.init();
  }

  if (to.meta.auth && !auth.user) {
    return { name: "login" };
  }

  if (to.meta.guest && auth.user) {
    return { name: "home" };
  }
});

export default router;
