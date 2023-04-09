'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { SafeListing, SafeUser } from '@/app/types';

// SERVICES
import { api } from '@/app/services/api';

// COMPONENTS
import Container from '@/app/components/container';
import Heading from '@/app/components/heading';
import ListingCard from '@/app/components/listings/listing-card';

interface TripsClientProps {
	listings: SafeListing[];
	currentUser: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
	listings = [],
	currentUser,
}) => {
	const router = useRouter();
	const [deletingId, setDeletingId] = useState('');

	const onCancel = useCallback(
		async (id: string) => {
			setDeletingId(id);

			try {
				await api.delete(`/listings/${id}`);
				toast.success('Listing deleted');
				router.refresh();
			} catch (error: any) {
				console.error(error);
				const errorMsg =
					error.response?.data?.error ||
					// error.response?.data ||
					error.message ||
					error;
				toast.error(`Ops... ${errorMsg}`);
			} finally {
				setDeletingId('');
			}
		},
		[router],
	);

	return (
		<Container>
			<Heading title="Properties" subtitle="List of your properties" />

			<div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
				{listings?.map((listing) => (
					<ListingCard
						key={listing.id}
						actionLabel="Delete property"
						actionId={listing.id}
						onAction={onCancel}
						disabled={deletingId === listing.id}
						currentUser={currentUser}
						data={listing}
					/>
				))}
			</div>
		</Container>
	);
};

export default TripsClient;
