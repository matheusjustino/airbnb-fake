import './globals.scss';
import { Nunito } from 'next/font/google';

// UTILS
import { getCurrentUser } from './utils/get-current-user';

// PROVIDERS
import ToastProvider from './providers/toast-provider';

// COMPONENTS
import ClientOnly from './components/ClientOnly';
import Navbar from './components/navbar';
import LoginModal from './components/modals/login-modal';
import RegisterModal from './components/modals/register-modal';
import RentModal from './components/modals/rent-modal';
import SearchModal from './components/modals/search-modal';

export const metadata = {
	title: 'Airbnb fake',
	description: 'Airbnb Application Fake',
};

const font = Nunito({
	subsets: ['latin'],
});

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const currentUser = await getCurrentUser();

	return (
		<html lang="en">
			<body className={font.className}>
				<ClientOnly>
					<ToastProvider />
					<Navbar currentUser={currentUser} />
					<LoginModal />
					<RegisterModal />
					<RentModal />
					<SearchModal />
				</ClientOnly>
				<div className="pb-20 pt-28">{children}</div>
			</body>
		</html>
	);
}
