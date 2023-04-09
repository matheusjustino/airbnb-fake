'use client';

import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// SERVICES
import { api } from '@/app/services/api';

// HOOKS
import { useRegisterModalStore } from '@/app/hooks/useRegisterModel';
import { useLoginModalStore } from '@/app/hooks/useLoginModel';

// COMPONENTS
import Modal from './modal';
import Heading from '../heading';
import Input from '../inputs';
import Button from '../button';

const formSchema = z.object({
	name: z.string().nonempty(),
	email: z.string().email().nonempty(),
	password: z.string().min(6).nonempty(),
});

const RegisterModal: React.FC = () => {
	const registerModal = useRegisterModalStore();
	const loginModal = useLoginModalStore();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FieldValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
		event?.preventDefault();
		setIsLoading(true);

		try {
			await api.post(`/auth/register`, data);
			registerModal.onClose();
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

	const toggle = useCallback(() => {
		registerModal.onClose();
		loginModal.onOpen();
	}, [loginModal, registerModal]);

	const bodyContent = (
		<div className="flex flex-col ga-4">
			<Heading title="Welcome to Airbnb" subtitle="Create an account!" />

			<Input
				id="name"
				label="Name"
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>

			<Input
				id="email"
				label="Email"
				type="email"
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>

			<Input
				id="password"
				label="Password"
				type="password"
				disabled={isLoading}
				register={register}
				errors={errors}
				required
			/>
		</div>
	);

	const footerContent = (
		<div className="flex flex-col gap-4 mt-3">
			<hr />

			<Button
				outline
				label="Continue with Google"
				icon={FcGoogle}
				onClick={() => signIn('google')}
			/>

			<Button
				outline
				label="Continue with Github"
				icon={AiFillGithub}
				onClick={() => signIn('github')}
				disabled
			/>

			<div className="text-neutral-500 text-center mt-4 font-light">
				<div className="flex flex-row items-center justify-center gap-2">
					<div>Already have an account?</div>
					<div
						onClick={toggle}
						className="text-neutral-800 cursor-pointer hover:underline"
					>
						Log in
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<Modal
			disabled={isLoading}
			isOpen={registerModal.isOpen}
			title="Register"
			actionLabel="Continue"
			onClose={() => {
				registerModal.onClose();
				reset();
			}}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
			footer={footerContent}
		/>
	);
};

export default RegisterModal;
