// UTILS
import { getCurrentUser } from '../utils/get-current-user';
import { getReservations } from '../utils/get-reservation';

// COMPONENTS
import ClientOnly from '../components/ClientOnly';
import EmptyState from '../components/empty-state';
import ReservationsClient from './components/reservations-client';

const ReservationsPage = async () => {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		return (
			<ClientOnly>
				<EmptyState title="Unauthorized" subtitle="Please login" />
			</ClientOnly>
		);
	}

	const reservations = await getReservations({
		authorId: currentUser.id,
	});

	if (!reservations.length) {
		return (
			<ClientOnly>
				<EmptyState
					title="No reservations found"
					subtitle="Looks like you have no reservations on your properties."
				/>
			</ClientOnly>
		);
	}

	return (
		<ClientOnly>
			<ReservationsClient
				reservations={reservations}
				currentUser={currentUser}
			/>
		</ClientOnly>
	);
};

export default ReservationsPage;
