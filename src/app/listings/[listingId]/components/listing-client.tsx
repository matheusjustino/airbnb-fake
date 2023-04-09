'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { Range } from 'react-date-range';

import { SafeListing, SafeReservation, SafeUser } from '@/app/types';

// UTILS
import { CATEGORIES_LIST } from '@/app/utils/categories-list';

// SERVICES
import { api } from '@/app/services/api';

// HOOKS
import { useLoginModalStore } from '@/app/hooks/useLoginModal';

// COMPONENTS
import Container from '@/app/components/container';
import ListingHead from '@/app/components/listings/listing-head';
import ListingInfo from '@/app/components/listings/listing-info';
import ListingReservation from '@/app/components/listings/listing-reservation';

const initialDateRange = {
	startDate: new Date(),
	endDate: new Date(),
	key: 'selection',
};

interface ListingClientProps {
	listing: SafeListing & { user: SafeUser };
	currentUser: SafeUser | null;
	reservations?: SafeReservation[];
}

const ListingClient: React.FC<ListingClientProps> = ({
	listing,
	currentUser,
	reservations = [],
}) => {
	const loginModal = useLoginModalStore();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [totalPrice, setTotalPrice] = useState(listing.price);
	const [dateRange, setDateRange] = useState<Range>(initialDateRange);
	const disabledDates = useMemo(() => {
		const dates: Date[] = [];

		reservations.forEach((reservation) => {
			const range = eachDayOfInterval({
				start: new Date(reservation.startDate),
				end: new Date(reservation.endDate),
			});

			dates.push(...range);
		});

		return dates;
	}, [reservations]);
	const category = useMemo(() => {
		return CATEGORIES_LIST.find((item) => item.label === listing.category);
	}, [listing]);

	const onCreateReservation = useCallback(async () => {
		if (!currentUser) {
			return loginModal.onOpen();
		}

		setIsLoading(true);

		try {
			await api.post('/reservations', {
				totalPrice,
				startDate: dateRange.startDate,
				endDate: dateRange.endDate,
				listingId: listing?.id,
			});
			toast.success('Listing reserved!');
			setDateRange(initialDateRange);
			router.push(`/trips`);
		} catch (error: any) {
			console.error(error);
			const errorMsg =
				error.response?.data?.error ||
				// error.response?.data ||
				error.message ||
				error;
			toast.error(`Ops... ${errorMsg}`);
		} finally {
			setIsLoading(false);
		}
	}, [currentUser, dateRange, listing, loginModal, totalPrice, router]);

	useEffect(() => {
		if (dateRange.startDate && dateRange.endDate) {
			let dayCount = differenceInCalendarDays(
				dateRange.startDate,
				dateRange.endDate,
			);

			if (dayCount < 0) {
				dayCount = dayCount * -1;
			}

			if (dayCount && listing.price) {
				setTotalPrice(dayCount * listing.price);
			} else {
				setTotalPrice(listing.price);
			}
		}
	}, [dateRange, listing.price]);

	return (
		<Container>
			<div className="max-w-screen-lg mx-auto">
				<div className="flex flex-col gap-6">
					<ListingHead
						title={listing.title}
						imageSrc={listing.imageSrc}
						locationValue={listing.locationValue}
						id={listing.id}
						currentUser={currentUser}
					/>

					<div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
						<ListingInfo
							user={listing.user}
							category={category}
							description={listing.description}
							roomCount={listing.roomCount}
							guestCount={listing.guestCount}
							bathroomCount={listing.bathroomCount}
							locationValue={listing.locationValue}
						/>

						<div className="order-first mb-10 md:order-last md:col-span-3">
							<ListingReservation
								price={listing.price}
								totalPrice={totalPrice}
								dateRange={dateRange}
								onChangeDate={(value) => setDateRange(value)}
								onSubmit={onCreateReservation}
								disabled={isLoading}
								disabledDates={disabledDates}
							/>
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default ListingClient;
