// UTILS
import { getCurrentUser } from '../utils/get-current-user';
import { getListings } from '../utils/get-listings';

// COMPONENTS
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/empty-state';
import PropertiesClient from './components/properties-client';

const TripsPage = async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return (
			<ClientOnly>
				<EmptyState title="Unauthorized" subtitle="Please login" />
			</ClientOnly>
		);
	}

	const listings = await getListings({
		userId: currentUser.id,
	});

	if (!listings.length) {
		return (
			<ClientOnly>
				<EmptyState
					title="No properties found"
					subtitle="Looks like you have no properties."
				/>
			</ClientOnly>
		);
	}

	return (
		<ClientOnly>
			<PropertiesClient listings={listings} currentUser={currentUser} />
		</ClientOnly>
	);
};

export default TripsPage;
