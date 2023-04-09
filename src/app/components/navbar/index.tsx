'use client';

// TYPES
import { SafeUser } from '@/app/types';

// COMPONENTS
import Container from '../container';
import Logo from './components/logo';
import Search from './components/search';
import UserMenu from './components/user-menu';
import Categories from './components/categories';

interface NavbarProps {
	currentUser: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
	return (
		<div className="fixed w-full bg-white z-10 shadow-sm">
			<div
				className="
					py-4
					border-b-[1px]
					"
			>
				<Container>
					<div
						className="
							flex
							flex-row
							items-center
							justify-between
							gap-3
							md:gap-0
						"
					>
						<Logo />
						<Search />
						<UserMenu currentUser={currentUser} />
					</div>
				</Container>
			</div>
			<Categories />
		</div>
	);
};

export default Navbar;
