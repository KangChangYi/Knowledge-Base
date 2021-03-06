const fs = require("fs");

let readDirPath = "";
let fileBasePath = ""

function generatePathJSON(path) {
  // 当前函数的运行路径在项目根路径
  readDirPath = `./docs/${path}`
  // 但是生成的文件路径需要按照相对路径去获取
  fileBasePath = `/${path}`

  let files;
  try {
    files = fs.readdirSync(readDirPath);
  } catch (error) {
    throw new Error(error);
  }

  // console.log(files);
  return generate(files);
}

function generate(docsDirList) {
  docsDirList = docsDirList.filter((item) => !item.includes("."));
  let siderbarJSON = createSiderbarJson(docsDirList);
  // createGuideJson(docsDirList);

  return siderbarJSON;
}

// 生产 config 文件所需 siderbar
function createSiderbarJson(docsDirList) {
  let result = [];
  docsDirList.forEach((dirName) => {
    const docsNameList = fs.readdirSync(`${readDirPath}/${dirName}`);
    const formatedDocsNameList = docsNameList.map(
      (name) => `${fileBasePath}/${dirName}/${name}`
    );

    result.push({
      title: dirName,
      children: formatedDocsNameList,
    });
  });

  return result;
  // fs.writeFile("./siderbarList.json", JSON.stringify(result), (err) => {
  //   if (err) throw err;
  //   console.log("siderbar json 文件已生成");
  // });
}

// 生成 guide.md 所需目录
function createGuideJson(docsDirList) {
  let result = [];
  docsDirList.forEach((dirName) => {
    const docsNameList = fs.readdirSync(`${readDirPath}/${dirName}`);
    const formatedDocsNameList = docsNameList.map(
      (name) =>
        `+ [${name.slice(0, -3)}](${fileBasePath.slice(1)}/${dirName}/${name})`
    );

    result.push({
      title: `## ${dirName}`,
      path: formatedDocsNameList,
    });
  });

  fs.writeFile("./guidePath.json", JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log("guide json 文件已生成");
  });
}

module.exports = { generatePathJSON };
