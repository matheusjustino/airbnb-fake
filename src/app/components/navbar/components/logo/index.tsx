'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Logo: React.FC = () => {
	const router = useRouter();

	return (
		<Image
			onClick={() => router.push('/')}
			alt="Logo"
			className="hidden md:block cursor-pointer"
			width="100"
			height="100"
			priority
			quality={75}
			src="/images/logo.png"
			placeholder="blur"
		/>
	);
};

export default Logo;
