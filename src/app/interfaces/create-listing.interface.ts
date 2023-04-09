export interface CreateListingInterface {
	category: string;
	location: {
		flag: string;
		label: string;
		latlng: number[];
		region: string;
		value: string;
	};
	guestCount: number;
	roomCount: number;
	bathroomCount: number;
	imageSrc: string;
	price: number;
	title: string;
	description: string;
}
