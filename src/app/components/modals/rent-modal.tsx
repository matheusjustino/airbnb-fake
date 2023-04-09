'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

// SERVICES
import { api } from '@/app/services/api';

// HOOKS
import { useRentModalStore } from '@/app/hooks/useRentModal';

// UTILS
import { CATEGORIES_LIST } from '@/app/utils/categories-list';

// COMPONENTS
import Modal from './modal';
import Heading from '../heading';
import CategoryInput from '../inputs/category-input';
import CountrySelect, { CountrySelectValue } from '../inputs/country-select';
import Counter from '../inputs/counter';
import ImageUpload from '../inputs/image-upload';
import Input from '../inputs';

enum STEPS {
	CATEGORY = 0,
	LOCATION = 1,
	INFO = 2,
	IMAGES = 3,
	DESCRIPTION = 4,
	PRICE = 5,
}

const RentModal: React.FC = () => {
	const rentModal = useRentModalStore();
	const router = useRouter();
	const [step, setStep] = useState(STEPS.CATEGORY);
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<FieldValues>({
		// resolver: zodResolver(formSchema),
		defaultValues: {
			category: '',
			location: null,
			guestCount: 1,
			roomCount: 1,
			bathroomCount: 1,
			imageSrc: '',
			price: 1,
			title: '',
			description: '',
		},
	});

	const category: string = watch('category');
	const location: CountrySelectValue = watch('location');
	const guestCount: number = watch('guestCount');
	const roomCount: number = watch('roomCount');
	const bathroomCount: number = watch('bathroomCount');
	const imageSrc: string = watch('imageSrc');

	const Map = useMemo(
		() => dynamic(() => import('../map'), { ssr: false }),
		[location],
	);

	const setCustomValue = (id: string, value: any) => {
		setValue(id, value, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
	};

	const onBack = () => {
		setStep((old) => old - 1);
	};

	const onNext = () => {
		setStep((old) => old + 1);
	};

	const onSubmit: SubmitHandler<FieldValues> = async (
		data: FieldValues,
		event,
	) => {
		event?.preventDefault();

		if (step !== STEPS.PRICE) {
			return onNext();
		}

		setIsLoading(true);

		try {
			await api.post(`/listings`, data);
			toast.success('Listing Created!');
			reset();
			setStep(STEPS.CATEGORY);
			rentModal.onClose();
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
			setIsLoading(false);
		}
	};

	const actionLabel = useMemo(() => {
		if (step === STEPS.PRICE) {
			return 'Create';
		}

		return 'Next';
	}, [step]);

	const secondaryActionLabel = useMemo(() => {
		if (step === STEPS.CATEGORY) {
			return undefined;
		}

		return 'Back';
	}, [step]);

	let bodyContent = (
		<div className="flex flex-col gap-8">
			<Heading
				title="Witch of these best describes your place?"
				subtitle="Pick a category"
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
				{CATEGORIES_LIST.map((item) => {
					return (
						<div key={item.label} className="col-span-1">
							<CategoryInput
								onClick={(category) =>
									setCustomValue('category', category)
								}
								label={item.label}
								icon={item.icon}
								selected={category === item.label}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);

	if (step === STEPS.LOCATION) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading
					title="Where is your place located?"
					subtitle="Help guess find you!"
				/>

				<CountrySelect
					value={location}
					onChange={(value) => setCustomValue('location', value)}
				/>

				<Map center={location?.latlng} />
			</div>
		);
	}

	if (step === STEPS.INFO) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading
					title="Share some basics about your place"
					subtitle="What amenities do you have?"
				/>

				<Counter
					title="Guests"
					subtitle="How many guests do you allow?"
					value={guestCount}
					onChange={(value) => setCustomValue('guestCount', value)}
				/>
				<hr />

				<Counter
					title="Rooms"
					subtitle="How many rooms do you have?"
					value={roomCount}
					onChange={(value) => setCustomValue('roomCount', value)}
				/>
				<hr />

				<Counter
					title="Bathrooms"
					subtitle="How many bathrooms do you have?"
					value={bathroomCount}
					onChange={(value) => setCustomValue('bathroomCount', value)}
				/>
			</div>
		);
	}

	if (step === STEPS.IMAGES) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading
					title="Add a photo  of your place"
					subtitle="Show guests what your place looks like!"
				/>

				<ImageUpload
					value={imageSrc}
					onChange={(value) => setCustomValue('imageSrc', value)}
				/>
			</div>
		);
	}

	if (step === STEPS.DESCRIPTION) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading
					title="How would you describe your place?"
					subtitle="Short and sweet works best!"
				/>

				<Input
					id="title"
					label="Title"
					disabled={isLoading}
					register={register}
					errors={errors}
					required
				/>

				<hr />

				<Input
					id="description"
					label="Description"
					disabled={isLoading}
					register={register}
					errors={errors}
					required
				/>
			</div>
		);
	}

	if (step === STEPS.PRICE) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading
					title="Now, set your price"
					subtitle="How much do you charge per night?"
				/>

				<Input
					id="price"
					label="Price"
					formatPrice
					type="number"
					disabled={isLoading}
					register={register}
					errors={errors}
					required
				/>
			</div>
		);
	}

	return (
		<Modal
			title="Airbnb your home!"
			actionLabel={actionLabel}
			secondaryActionLabel={secondaryActionLabel}
			secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
			isOpen={rentModal.isOpen}
			onClose={() => {
				rentModal.onClose();
				reset();
				setStep(STEPS.CATEGORY);
			}}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
		/>
	);
};

export default RentModal;
