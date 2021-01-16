module.exports = {
  title: "KangChangYi",
  description: "Step by step",
  // base: "/Knowledge-Base/",
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
    sidebarDepth: 0,
    sidebar: require("../siderbarList.json"),
  },
};
 