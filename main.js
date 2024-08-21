const fs = require("fs").promises;

// ファイルを読み込む関数
async function read(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("ファイルを読み込めませんでした:", err);
    process.exit(1);
  }
}

// ファイルに書き込む関数
async function write(filePath, data) {
  try {
    await fs.writeFile(filePath, data, "utf8");
    console.log("編集された内容が output.md に保存されました");
  } catch (err) {
    console.error("ファイルを書き込めませんでした:", err);
    process.exit(1);
  }
}

const removeDoubleKaigyo = (data) => {
  let editedData = "";
  let kaigyoNum = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i] === "\n") {
      kaigyoNum++;
    } else {
      kaigyoNum = 0;
    }

    if (kaigyoNum >= 3) {
      continue;
    } else {
      editedData += data[i];
    }
  }

  return editedData;
};

const editList = (data) => {
  let editedData = "";
  let listFlg = false;

  for (let i = 0; i < data.length; i++) {
    if (data[i] === "\n") {
      // console.log(`${i} -2:${data[i-2]}, -1:${data[i-1]}, +1:${data[i+1]}.`)
    }
    if (
      data[i] === "\n" &&
      i > 1 &&
      (data[i - 2] === "*" || data[i - 2] === ".")
    ) {
      listFlg = true;
    } else {
      listFlg = false;
    }

    if (listFlg) {
      continue;
    } else {
      editedData += data[i];
    }
  }

  return editedData;
};

// メイン処理
const main = async () => {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("ファイルパスを指定してください");
    process.exit(1);
  }

  // ファイルの読み込み
  const data = await read(filePath);

  const editedData = editList(removeDoubleKaigyo(data));

  // 編集後のデータを output.md に書き込み
  await write("output.md", editedData);
};

main();
