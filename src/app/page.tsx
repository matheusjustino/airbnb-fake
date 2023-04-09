// UTILS
import { getListings } from './utils/get-listings';
import { getCurrentUser } from './utils/get-current-user';

// COMPONENTS
import Container from './components/container';
import EmptyState from './components/empty-state';
import ListingCard from './components/listings/listing-card';
import ClientOnly from './components/ClientOnly';

export default async function Home() {
	const listings = await getListings();
	const currentUser = await getCurrentUser();

	if (!listings?.length) {
		return (
			<ClientOnly>
				<EmptyState showReset />
			</ClientOnly>
		);
	}

	return (
		<Container>
			<div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
				{listings.map((listing) => {
					return (
						<ListingCard
							key={listing.id}
							data={listing}
							currentUser={currentUser}
						/>
					);
				})}
			</div>
		</Container>
	);
}
