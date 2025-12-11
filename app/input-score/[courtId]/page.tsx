"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toPng } from "html-to-image";
import { ThemeToggle } from "@/components/theme-toggle";

interface PageProps {
    params: {
        courtId: string;
    };
}

const formSchema = z.object({
    playerName: z.string().min(1, "Player name is required"),
    playerScore: z.string().min(1, "Player score is required"),
    opponentName: z.string().min(1, "Opponent name is required"),
    opponentScore: z.string().min(1, "Opponent score is required"),
});

type FormData = z.infer<typeof formSchema>;

export function generateStaticParams() {
    return [
        { courtId: '1' },
        { courtId: '2' },
        { courtId: '3' },
        { courtId: '4' },
        { courtId: '5' },
        { courtId: '6' },
    ];
}

export default function InputScorePage({ params }: PageProps) {
    const { courtId } = params;
    const [showScorecard, setShowScorecard] = useState(false);
    const [scoreData, setScoreData] = useState<FormData | null>(null);
    const scorecardRef = useRef<HTMLDivElement>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            playerName: "",
            playerScore: "",
            opponentName: "",
            opponentScore: "",
        },
    });

    const onSubmit = (data: FormData) => {
        setScoreData(data);
        setShowScorecard(true);
    };

    const handleSaveImage = async () => {
        if (scorecardRef.current === null) {
            return;
        }

        try {
            const dataUrl = await toPng(scorecardRef.current, {
                quality: 1,
                pixelRatio: 2,
            });

            const link = document.createElement("a");
            link.download = `scorecard-court${courtId}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to save image:", err);
        }
    };

    const handleEditScore = () => {
        setShowScorecard(false);
    };

    if (showScorecard) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6 flex gap-4 justify-center">
                        <Button onClick={handleEditScore} variant="outline">
                            Edit Score
                        </Button>
                        <Button onClick={handleSaveImage}>Save as Image</Button>
                    </div>

                    {/* Scorecard Container - 9:16 ratio */}
                    <div className="flex justify-center">
                        <div
                            ref={scorecardRef}
                            className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                            style={{
                                aspectRatio: "9/16",
                                background: "linear-gradient(135deg, #32574C 0%, #4a7366 50%, #d4c5b0 100%)"
                            }}
                        >
                            {/* Background Pattern - Court Lines */}
                            <div className="absolute inset-0 opacity-20">
                                {/* Vertical center line */}
                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white" />
                                {/* Horizontal lines */}
                                <div className="absolute left-0 right-0 top-1/4 h-0.5 bg-white" />
                                <div className="absolute left-0 right-0 top-3/4 h-0.5 bg-white" />
                                {/* Court outline */}
                                <div className="absolute inset-8 border-2 border-white rounded-lg" />
                            </div>

                            {/* Decorative corner elements */}
                            <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-white/30" />
                            <div className="absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-white/30" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 border-white/30" />
                            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-white/30" />

                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-between p-8">
                                {/* Header with Logo */}
                                <div className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                                            <Image
                                                src="/logo.png"
                                                alt="Logo"
                                                width={80}
                                                height={80}
                                                className="object-contain"
                                                priority
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-[#f5ebe0]/90 backdrop-blur-sm rounded-xl py-3 px-6 inline-block shadow-lg mb-2">
                                        <h1 className="text-[#32574C] text-3xl font-black tracking-wider">
                                            MATCH RESULT
                                        </h1>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-px w-12 bg-white/50" />
                                        <p className="text-white text-base font-bold tracking-wide px-3 py-1 bg-white/20 rounded-full">
                                            COURT {courtId}
                                        </p>
                                        <div className="h-px w-12 bg-white/50" />
                                    </div>
                                </div>

                                {/* Score Display */}
                                <div className="flex-1 flex flex-col justify-center gap-4">
                                    {/* Player 1 */}
                                    <div className="relative bg-[#f5ebe0]/95 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/60 shadow-xl">
                                        <div className="absolute -top-3 -left-3 bg-[#32574C] text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-lg shadow-lg">
                                            1
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#82644f] text-xs font-bold mb-1 uppercase tracking-wider">
                                                    Player
                                                </p>
                                                <h2 className="text-[#32574C] text-2xl font-black truncate leading-tight">
                                                    {scoreData?.playerName}
                                                </h2>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-[#32574C] blur-md opacity-50" />
                                                <div className="relative bg-[#32574C] rounded-2xl px-5 py-3 min-w-[70px] flex items-center justify-center shadow-xl border-2 border-white/40">
                                                    <span className="text-5xl font-black text-white">
                                                        {scoreData?.playerScore}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* VS Divider */}
                                    <div className="flex items-center justify-center relative">
                                        <div className="absolute left-0 right-0 h-px bg-white/40" />
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-[#82644f] blur-lg opacity-50" />
                                            <div className="relative bg-[#f5ebe0] backdrop-blur-md rounded-full px-6 py-2 border-4 border-[#82644f] shadow-xl">
                                                <span className="text-[#32574C] text-xl font-black tracking-[0.3em]">
                                                    VS
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Player 2 */}
                                    <div className="relative bg-[#f5ebe0]/95 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/60 shadow-xl">
                                        <div className="absolute -top-3 -left-3 bg-[#82644f] text-white rounded-full w-10 h-10 flex items-center justify-center font-black text-lg shadow-lg">
                                            2
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[#82644f] text-xs font-bold mb-1 uppercase tracking-wider">
                                                    Player
                                                </p>
                                                <h2 className="text-[#32574C] text-2xl font-black truncate leading-tight">
                                                    {scoreData?.opponentName}
                                                </h2>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-[#32574C] blur-md opacity-50" />
                                                <div className="relative bg-[#32574C] rounded-2xl px-5 py-3 min-w-[70px] flex items-center justify-center shadow-xl border-2 border-white/40">
                                                    <span className="text-5xl font-black text-white">
                                                        {scoreData?.opponentScore}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="text-center">
                                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 border border-white/40">
                                        <p className="text-white text-xs font-bold tracking-wide">
                                            {new Date().toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            }).toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
            <div className="max-w-md mx-auto">
                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1 pb-6 relative">
                        <div className="flex justify-center mb-4 relative">
                            <div className="absolute top-0 right-0">
                                <ThemeToggle />
                            </div>
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={120}
                                height={120}
                                className="object-contain"
                                priority
                            />
                        </div>
                        <CardTitle className="text-3xl font-bold text-center">
                            Input Score
                        </CardTitle>
                        <CardDescription className="text-center text-base">
                            Court {courtId} - Enter match results
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="playerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">
                                                Your Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your name"
                                                    className="h-12 text-base"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="playerScore"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">
                                                Your Score
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    min="0"
                                                    className="h-12 text-base"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="border-t pt-6 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="opponentName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">
                                                    Opponent's Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter opponent's name"
                                                        className="h-12 text-base"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="opponentScore"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">
                                                    Opponent's Score
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        min="0"
                                                        className="h-12 text-base"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" className="w-full h-12 text-base font-semibold">
                                    Generate Scorecard
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
