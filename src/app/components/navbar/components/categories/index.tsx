'use client';

import { usePathname, useSearchParams } from 'next/navigation';

// UTILS
import { CATEGORIES_LIST } from '@/app/utils/categories-list';

// COMPONENTS
import Container from '@/app/components/container';
import CategoryBox from '../category-box';

const Categories: React.FC = () => {
	const params = useSearchParams();
	const selectedCategory = params?.get('category');
	const pathname = usePathname();
	const isMainPage = pathname === '/';

	if (!isMainPage) {
		return null;
	}

	return (
		<Container>
			<div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
				{CATEGORIES_LIST.map((category) => {
					return (
						<CategoryBox
							key={category.label}
							label={category.label}
							icon={category.icon}
							selected={selectedCategory === category.label}
						/>
					);
				})}
			</div>
		</Container>
	);
};

export default Categories;
