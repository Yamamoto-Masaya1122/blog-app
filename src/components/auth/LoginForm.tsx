"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions/authenticate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
    const [errorMessage, formAction] = useActionState(authenticate, undefined);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle></CardTitle>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">パスワード</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            ログイン
                        </Button>
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => signIn("google")}
                        >
                            <FcGoogle className="w-4 h-4 mr-2" />
                            Googleでログイン
                        </Button>
                        <div className="flex h-8 items-end space-x-1">
                            {errorMessage && (
                                <div className="text-red-500">
                                    <p className="text-sm text-red-500">
                                        {errorMessage}
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </CardContent>
            </CardHeader>
        </Card>
    );
}
