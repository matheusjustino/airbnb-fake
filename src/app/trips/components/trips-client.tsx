'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { SafeReservation, SafeUser } from '@/app/types';

// SERVICES
import { api } from '@/app/services/api';

// COMPONENTS
import Container from '@/app/components/container';
import Heading from '@/app/components/heading';
import ListingCard from '@/app/components/listings/listing-card';

interface TripsClientProps {
	reservations: SafeReservation[];
	currentUser: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
	reservations = [],
	currentUser,
}) => {
	const router = useRouter();
	const [deletingId, setDeletingId] = useState('');

	const onCancel = useCallback(
		async (id: string) => {
			setDeletingId(id);

			try {
				console.log(`/reservations/${id}`);
				await api.delete(`/reservations/${id}`);
				toast.success('Reservation cancelled');
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
			<Heading
				title="Trips"
				subtitle="Where you've been and where you're going"
			/>

			<div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
				{reservations?.map((reservation) => (
					<ListingCard
						key={reservation.id}
						actionLabel="Cancel reservation"
						actionId={reservation.id}
						onAction={onCancel}
						disabled={deletingId === reservation.id}
						currentUser={currentUser}
						reservation={reservation}
						data={reservation.listing}
					/>
				))}
			</div>
		</Container>
	);
};

export default TripsClient;
