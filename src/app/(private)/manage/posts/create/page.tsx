"use client";
import { useState, useActionState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import TextareaAutosize from "react-textarea-autosize";
import "highlight.js/styles/github.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreatePage() {
    const [content, setContent] = useState("");
    const [contentLength, setContentLength] = useState(0);
    const [preview, setPreview] = useState(false);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setContent(value);
        setContentLength(value.length);
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">
                新規記事投稿(Markdown対応)
            </h1>
            <form className="space-y-4">
                <div>
                    <Label htmlFor="title">タイトル</Label>
                    <Input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="タイトルを入力してください"
                    />
                </div>
                <div>
                    <Label htmlFor="topImage">トップ画像</Label>
                    <Input
                        type="file"
                        id="topImage"
                        accept="image/*"
                        name="topImage"
                    />
                </div>
                <div>
                    <Label htmlFor="content">内容(Markdown)</Label>
                    <TextareaAutosize
                        id="content"
                        name="content"
                        placeholder="Markdown形式で入力してください"
                        className="w-full border p-2"
                        minRows={8}
                        value={content}
                        onChange={handleContentChange}
                    />
                </div>
                <div className="text-right text-sm text-gray-500 mt-1">
                    文字数：{contentLength}
                </div>
                <div>
                    <Button type="button" onClick={() => setPreview(!preview)}>
                        {preview ? "プレビューを閉じる" : "プレビューを表示"}
                    </Button>
                </div>
                {preview && (
                    <div className="border p-4 bg-gray-50 prose max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            skipHtml={false}
                            unwrapDisalowed={true}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                )}
                <Button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    投稿する
                </Button>
            </form>
        </div>
    );
}
