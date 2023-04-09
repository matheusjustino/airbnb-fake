'use client';

import { SafeListing, SafeUser } from '@/app/types';

// COMPONENTS
import Container from '@/app/components/container';
import Heading from '@/app/components/heading';
import ListingCard from '@/app/components/listings/listing-card';

interface FavoritesClientProps {
	currentUser: SafeUser | null;
	favorites: SafeListing[];
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
	currentUser,
	favorites,
}) => {
	return (
		<Container>
			<Heading
				title="Favorites"
				subtitle="List of places you have favorited!"
			/>

			<div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
				{favorites?.map((favorite) => (
					<ListingCard
						key={favorite.id}
						currentUser={currentUser}
						data={favorite}
					/>
				))}
			</div>
		</Container>
	);
};

export default FavoritesClient;
