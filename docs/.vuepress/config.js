module.exports = {
    title: 'KangChangYi',
    description: 'Step by step',
    // base: "/Knowledge-Base/",
    base: "/",
    themeConfig: {
        nav: [
            { text: 'GitHub', link: 'https://github.com/KangChangYi' },
            { text: 'Blog', link: 'https://kangchangyi.github.io/' },
        ],
        sidebarDepth: 0,
        sidebar: require('../siderbarList.json')
    },
}