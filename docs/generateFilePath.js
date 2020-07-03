const fs = require('fs')

const basePath = './article'

fs.readdir(basePath, (err, data) => {
    if (err) throw err;
    generate(data)
})

function generate (docsDirList) {
    createSiderbarJson(docsDirList)
    createGuideJson(docsDirList)
}

// 生产 config 文件所需 siderbar
function createSiderbarJson (docsDirList) {
    let result = []
    docsDirList.forEach(dirName => {
        const docsNameList = fs.readdirSync(`${basePath}/${dirName}`)
        const formatedDocsNameList = docsNameList
            .map(name => `${basePath}/${dirName}/${name}`)

        result.push({
            title: dirName,
            children: formatedDocsNameList
        })
    })
    fs.writeFile('./siderbarList.json', JSON.stringify(result), (err) => {
        if (err) throw err;
        console.log('siderbar json 文件已生成')
    })
}

// 生成 guide.md 所需目录
function createGuideJson (docsDirList) {
    let result = []
    docsDirList.forEach(dirName => {
        const docsNameList = fs.readdirSync(`${basePath}/${dirName}`)
        const formatedDocsNameList = docsNameList
            .map(name => `+ [${name.slice(0, -3)}](${basePath.slice(1)}/${dirName}/${name})`)

        result.push({
            title: `## ${dirName}`,
            path: formatedDocsNameList
        })
    })
    fs.writeFile('./guidePath.json', JSON.stringify(result), (err) => {
        if (err) throw err;
        console.log('guide json 文件已生成')
    })
}