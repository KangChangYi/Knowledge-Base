module.exports = {
  title: "KangChangYi",
  description: "Step by step",
  base: "/",
  themeConfig: {
    nav: [
      { text: "知识点", link: "/article/" },
      { text: "数据结构与算法", link: "/algorithms/" },
      { text: "关于我", link: "/my/" },
      {
        text: "GitHub",
        link: "https://github.com/KangChangYi",
        target: "_blank",
      },
    ],
    sidebarDepth: 2,
    sidebar: {
      "/article/": require("../siderbarList.json"),
      "/algorithms/": [""],
      "/my/": [""],
    },
    lastUpdated: "上次更新",
    smoothScroll: true,
  },
  plugins: ["@vuepress/back-to-top"],
};
