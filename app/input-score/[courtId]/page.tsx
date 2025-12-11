import ClientPage from "./client-page";

interface PageProps {
    params: Promise<{
        courtId: string;
    }>;
}

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

export default async function InputScorePage({ params }: PageProps) {
    const { courtId } = await params;
    return <ClientPage courtId={courtId} />;
}
