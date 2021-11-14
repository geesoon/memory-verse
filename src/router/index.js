import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import firebase from "firebase";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "login",
        component: Login,
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/Register.vue"),
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/Dashboard.vue"),
        meta: {
            authRequired: true,
        },
        children: [
            {
                path: "main",
                name: "main",
                component: () => import("../views/Home.vue"),
            },
            {
                path: "profile",
                name: "profile",
                component: () => import("../views/Profile.vue"),
            },
            {
                path: "review",
                name: "review",
                component: () => import("../views/Review.vue"),
            },
            {
                path: "library",
                name: "library",
                component: () => import("../views/Library.vue"),
            },
            {
                path: "collection/:collectionId?",
                name: "collection",
                component: () => import("../views/Collection.vue"),
            },
        ],
    },
    {
        path: "/flashcard",
        name: "flashcard",
        component: () => import("../views/FlashCard.vue"),
        meta: {
            authRequired: true,
        },
    },
    {
        path: "/audioreview",
        name: "audioreview",
        component: () => import("../views/AudioReview.vue"),
        meta: {
            authRequired: true,
        },
    },
    {
        path: "/answer",
        name: "answer",
        component: () => import("../views/AnswerPanel.vue"),
        meta: {
            authRequired: true,
        },
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.authRequired)) {
        if (firebase.auth().currentUser) {
            next();
        } else {
            next({
                path: "/",
            });
        }
    } else {
        next();
    }
});

export default router;
