'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { AiOutlineMenu } from 'react-icons/ai';

// TYPES
import { SafeUser } from '@/app/types';

// HOOKS
import { useLoginModalStore } from '@/app/hooks/useLoginModel';
import { useRegisterModalStore } from '@/app/hooks/useRegisterModel';
import { useRentModalStore } from '@/app/hooks/useRentModal';

// COMPONENTS
import Avatar from '@/app/components/avatar';
import MenuItem from '../menu-item/menu-item';

interface UserMenu {
	currentUser: SafeUser | null;
}

const UserMenu: React.FC<UserMenu> = ({ currentUser }) => {
	const loginModal = useLoginModalStore();
	const registerModal = useRegisterModalStore();
	const rentModal = useRentModalStore();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = useCallback(() => {
		setIsOpen((old) => !old);
	}, []);

	const onRent = useCallback(() => {
		if (!currentUser) {
			return loginModal.onOpen();
		}

		rentModal.onOpen();
	}, [loginModal, currentUser, rentModal]);

	return (
		<div className="relative">
			<div className="flex flex-row items-center gap-3">
				<div
					onClick={onRent}
					className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
				>
					Airbnb your home
				</div>

				<div
					onClick={toggleOpen}
					className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer shadow-md transition"
				>
					<AiOutlineMenu />

					<div className="hidden md:block">
						<Avatar src={currentUser?.image} />
					</div>
				</div>
			</div>

			{isOpen && (
				<div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
					<div className="flex flex-col cursor-pointer">
						{currentUser ? (
							<>
								<MenuItem
									onClick={() => router.push('/')}
									label="Home"
								/>

								<MenuItem
									onClick={() => router.push('/trips')}
									label="My trips"
								/>
								<MenuItem
									onClick={() => {}}
									label="My favorites"
								/>
								<MenuItem
									onClick={() => {}}
									label="My reservations"
								/>
								<MenuItem
									onClick={() => {}}
									label="My properties"
								/>
								<MenuItem
									onClick={rentModal.onOpen}
									label="Airbnb my home"
								/>
								<hr />
								<MenuItem onClick={signOut} label="Logout" />
							</>
						) : (
							<>
								<MenuItem
									onClick={loginModal.onOpen}
									label="Login"
								/>
								<MenuItem
									onClick={registerModal.onOpen}
									label="Sign Up"
								/>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default UserMenu;
