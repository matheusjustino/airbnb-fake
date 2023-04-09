'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// HOOKS
import { useLoginModalStore } from '@/app/hooks/useLoginModal';
import { useRegisterModalStore } from '@/app/hooks/useRegisterModal';

// COMPONENTS
import Modal from './modal';
import Heading from '../heading';
import Input from '../inputs';
import Button from '../button';

const formSchema = z.object({
	email: z.string().email().nonempty(),
	password: z.string().min(6).nonempty(),
});

const LoginModal: React.FC = () => {
	const loginModal = useLoginModalStore();
	const registerModal = useRegisterModalStore();
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FieldValues>({
		resolver: zodResolver(formSchema),
		values: {
			email: '',
			password: '',
		},
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = async (data, event) => {
		event?.preventDefault();
		setIsLoading(true);

		await signIn('credentials', {
			...data,
			redirect: false,
		})
			.then((callback) => {
				if (callback?.ok) {
					toast.success('Logged in!');
					loginModal.onClose();
					reset();
					router.refresh();
				}

				if (callback?.error) {
					toast.error(`Ops... ${callback?.error}`);
				}

				setIsLoading(false);
			})
			.catch((error: any) => {
				console.error(error);
				const errorMsg =
					error.response?.data?.error ||
					// error.response?.data ||
					error.message ||
					error;
				toast.error(`Ops... ${errorMsg}`);
				setIsLoading(false);
			});
	};

	const toggle = useCallback(() => {
		loginModal.onClose();
		registerModal.onOpen();
	}, [loginModal, registerModal]);

	const bodyContent = (
		<div className="flex flex-col ga-4">
			<Heading title="Welcome back" subtitle="Login to your account!" />

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
					<div>First time using Airbnb?</div>
					<div
						onClick={toggle}
						className="text-neutral-800 cursor-pointer hover:underline"
					>
						Create an account
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<Modal
			disabled={isLoading}
			isOpen={loginModal.isOpen}
			title="Login"
			actionLabel="Continue"
			onClose={() => {
				loginModal.onClose();
				reset();
			}}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
			footer={footerContent}
		/>
	);
};

export default LoginModal;
