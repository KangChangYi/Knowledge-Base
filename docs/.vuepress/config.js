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
    sidebarDepth: 2,
    sidebar: require("../siderbarList.json"),
  },
};
 