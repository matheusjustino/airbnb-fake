// UTILS
import { getCurrentUser } from '../utils/get-current-user';
import { getFavoritesListings } from '../utils/get-favorities-listings';

// COMPONENTS
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/empty-state';
import FavoritesClient from './components/favorites-client';

const FavoritesPage = async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return (
			<ClientOnly>
				<EmptyState title="Unauthorized" subtitle="Please login" />
			</ClientOnly>
		);
	}

	const favorites = await getFavoritesListings();

	if (!favorites.length) {
		return (
			<ClientOnly>
				<EmptyState
					title="No favorites found"
					subtitle="Looks like you have no favorites listings."
				/>
			</ClientOnly>
		);
	}

	return (
		<ClientOnly>
			<FavoritesClient currentUser={currentUser} favorites={favorites} />
		</ClientOnly>
	);
};

export default FavoritesPage;
