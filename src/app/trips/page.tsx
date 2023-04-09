// UTILS
import { getCurrentUser } from '../utils/get-current-user';
import { getReservations } from '../utils/get-reservation';

// COMPONENTS
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/empty-state';
import TripsClient from './components/trips-client';

const TripsPage = async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return (
			<ClientOnly>
				<EmptyState title="Unauthorized" subtitle="Please login" />
			</ClientOnly>
		);
	}

	const reservations = await getReservations({
		userId: currentUser.id,
	});

	if (!reservations.length) {
		return (
			<ClientOnly>
				<EmptyState
					title="No trips found"
					subtitle="Looks like you haven't reserved any trips."
				/>
			</ClientOnly>
		);
	}

	return (
		<ClientOnly>
			<TripsClient
				reservations={reservations}
				currentUser={currentUser}
			/>
		</ClientOnly>
	);
};

export default TripsPage;
