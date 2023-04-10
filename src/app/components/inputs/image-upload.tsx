'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { TbPhotoPlus } from 'react-icons/tb';
import { CldUploadWidget } from 'next-cloudinary';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
	var cloudinary: any;
}

interface ImageUploadProps {
	onChange: (value: string) => void;
	value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
	const handleUpload = useCallback(
		(result: any) => {
			onChange(result.info.secure_url);
		},
		[onChange],
	);

	return (
		<CldUploadWidget
			onUpload={handleUpload}
			uploadPreset="yp0rh54u"
			options={{
				maxFiles: 1,
			}}
		>
			{({ open }) => {
				return (
					<div
						onClick={() => open?.()}
						className="relative cursor-pointer hover:opacity-70
							transition border-2 border-dashed border-neutral-300
							flex flex-col items-center justify-center gap-4
							text-neutral-600 p-20"
					>
						<TbPhotoPlus size={50} />
						<div className="font-semibold">Click to upload</div>

						{value && (
							<div className="absolute inset-0 w-full h-full">
								<Image
									alt="Upload"
									fill
									style={{ objectFit: 'cover' }}
									src={value}
									quality={75}
									placeholder="blur"
									priority
								/>
							</div>
						)}
					</div>
				);
			}}
		</CldUploadWidget>
	);
};

export default ImageUpload;
