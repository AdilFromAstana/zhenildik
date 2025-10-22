'use client';
import { useParams } from 'next/navigation';
import DealDetailPage from '../../components/DealDetailClient';

export default function DealDetail() {
    const { id } = useParams();
    return <DealDetailPage dealId={id as string} />;
}
