module.exports = {
    title: '特辣的博客',
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
        // sidebar: [
        //     {
        //         title: 'JavaScript',
        //         children: [
        //             '/JavaScript/ES6上.md',
        //         ]
        //     },
        //     {
        //         title: 'CSS',
        //         children: [
        //             '/CSS/盒子模型.md',
        //             '/CSS/块级元素与行内元素.md',
        //             '/CSS/BFC.md',
        //             '/CSS/选择器.md'
        //         ]
        //     },
        //     {
        //         title: '网络',
        //         children: [
        //             '/网络/三次握手四次挥手.md',
        //         ]
        //     }, 
        //     {
        //         title: '浏览器',
        //         children: [
        //             '/浏览器/浏览器缓存.md',
        //         ]
        //     },
        //     {
        //         title: '数据结构',
        //         children: [
        //             '/数据结构/栈.md',
        //         ]
        //     },
        // ]
    },
}