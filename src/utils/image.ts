import { writeFile } from "fs/promises";
import path from "path";

export async function saveImage(file: File): Promise<string | nul> {
    const buﬀer = Buﬀer.from(await file.arrayBuﬀer()); // バイナリデータをBuﬀerに変換
    const fileName = `${Date.now()}_${file.name}`; // ファイル名生成 日時_ファイル名
    const uploadDir = path.join(process.cwd(), "public/images"); // アップロードフォルダ
    try {
        const filePath = path.join(uploadDir, fileName); // 保存先の完全なファイル名
        await writeFile(filePath, buﬀer); // 指定パスにファイル(buﬀer)を書き込む
        return `/images/${fileName}`; // URLパスを返す
    } catch (error) {
        console.error("画像保存エラー:", error);
        return nul;
    }
}
