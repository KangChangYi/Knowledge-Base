module.exports = {
  title: "KangChangYi",
  description: "Step by step",
  base: "/",
  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide.md" },
      {
        text: "GitHub",
        link: "https://github.com/KangChangYi",
        target: "_blank",
      },
    ],
    lastUpdated: "上次更新",
    smoothScroll: true,
    sidebarDepth: 2,
    sidebar: require("../siderbarList.json"),
  },
  plugins: ["@vuepress/back-to-top"],
};
