// UTILS
import { getListingById } from '@/app/utils/get-listing-by-id';
import { getReservations } from '@/app/utils/get-reservation';
import { getCurrentUser } from '@/app/utils/get-current-user';

// COMPONENTS
import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/empty-state';
import ListingClient from './components/listing-client';

interface ParamsInterface {
	listingId?: string;
}

const ListingPage = async ({ params }: { params: ParamsInterface }) => {
	const listing = await getListingById(params);
	const reservations = await getReservations(params);
	const currentUser = await getCurrentUser();

	if (!listing) {
		return (
			<ClientOnly>
				<EmptyState />
			</ClientOnly>
		);
	}

	return (
		<ClientOnly>
			<ListingClient
				listing={listing}
				reservations={reservations}
				currentUser={currentUser}
			/>
		</ClientOnly>
	);
};

export default ListingPage;
