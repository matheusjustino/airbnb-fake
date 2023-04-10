'use client';

import { MouseEvent, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { SafeListing, SafeReservation, SafeUser } from '@/app/types';

// UTILS
import { formatPrice } from '@/app/utils/format-price';

// HOOKS
import { useCountries } from '@/app/hooks/useCountries';

// COMPONENTS
import HeartButton from '../heart-button';
import Button from '../button';

interface ListingsCardProps {
	data: SafeListing;
	currentUser: SafeUser | null;
	reservation?: SafeReservation;
	onAction?: (id: string) => void;
	disabled?: boolean;
	actionLabel?: string;
	actionId?: string;
}

const ListingCard: React.FC<ListingsCardProps> = ({
	data,
	currentUser,
	reservation,
	onAction,
	disabled,
	actionLabel,
	actionId = '',
}) => {
	const router = useRouter();
	const { getByValue } = useCountries();

	const location = getByValue(data.locationValue);

	const handleCancel = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();

			if (disabled) {
				return;
			}

			onAction?.(actionId);
		},
		[disabled, onAction, actionId],
	);

	const price = useMemo(() => {
		if (reservation) {
			return reservation.totalPrice;
		}

		return data.price;
	}, [data, reservation]);

	const reservationDate = useMemo(() => {
		if (!reservation) {
			return null;
		}

		const start = new Date(reservation.startDate);
		const end = new Date(reservation.endDate);

		return `${format(start, 'PP')} - ${format(end, 'PP')}`;
	}, [reservation]);

	return (
		<div
			onClick={() => router.push(`/listings/${data.id}`)}
			className={`
				col-span-1 cursor-pointer group
			`}
		>
			<div className="flex flex-col gap-2 w-full">
				<div
					className={`
					aspect-square
					w-full
					relative
					overflow-hidden
					rounded-xl
				`}
				>
					<Image
						alt="Listing"
						fill
						src={data.imageSrc}
						className="object-cover w-full h-full group-hover:scale-110 transition"
						quality={75}
						placeholder="blur"
						priority
					/>

					<div className="absolute top-3 right-3">
						<HeartButton
							listingId={data.id}
							currentUser={currentUser}
						/>
					</div>
				</div>

				<div className="font-semibold text-lg">
					{location?.region}, {location?.label}
				</div>

				<div className="font-light text-neutral-500">
					{reservationDate || data.category}
				</div>

				<div className="flex flex-row items-center gap-1">
					<div className="font-semibold">{formatPrice(price)}</div>
					{!reservation && <div className="font-light">night</div>}
				</div>

				{onAction && actionLabel && (
					<Button
						disabled={disabled}
						small
						label={actionLabel}
						onClick={handleCancel}
					/>
				)}
			</div>
		</div>
	);
};

export default ListingCard;
