import { NextResponse } from 'next/server';
import connect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(req: Request) {
  const { name, dob } = await req.json();

  if (!name || !dob) {
    return new NextResponse(
      JSON.stringify({ error: 'Name and Date of Birth are required' }),
      { status: 400 }
    );
  }

  try {
    await connect(); // Connect to MongoDB

    // Create and save the user in MongoDB
    const user = new User({ name, dob });
    await user.save();

    return new NextResponse(
      JSON.stringify({ message: 'User registered successfully!' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error saving user data' }),
      { status: 500 }
    );
  }
}
