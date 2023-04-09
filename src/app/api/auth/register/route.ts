import { NextResponse } from 'next/server';
import { genSaltSync, hashSync } from 'bcrypt';

// LIBS
import { prismaClient } from '@/app/libs/prisma-db';

// INTERFACES
import { RegisterInterface } from '@/app/interfaces/register.interface';

export async function POST(request: Request) {
	const { name, email, password } = await request
		.json()
		.then((res: RegisterInterface) => res);

	const salt = genSaltSync(12);
	const hashedPassword = hashSync(password, salt);

	const user = await prismaClient.user.create({
		data: {
			name,
			email,
			hashedPassword,
		},
	});

	return NextResponse.json(user);
}
