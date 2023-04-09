'use client';

import { useEffect } from 'react';

// COMPONENTS
import EmptyState from './components/empty-state';

interface ErrorPageProps {
	error: Error;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return <EmptyState title="Ops..." subtitle="Something want wrong!" />;
};

export default ErrorPage;
