'use client';

interface ContainerProps {
	children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
	return (
		<div className="max-w-[2520px] max-auto xl:xp-22 md:xp-12 sm:px-4 px-6">
			{children}
		</div>
	);
};

export default Container;
