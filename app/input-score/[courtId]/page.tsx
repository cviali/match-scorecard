import ClientPage from "./client-page";

interface PageProps {
    params: {
        courtId: string;
    };
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

export default function InputScorePage({ params }: PageProps) {
    return <ClientPage courtId={params.courtId} />;
}
