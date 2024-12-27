import connect from "../../../../lib/mongodb";
import { Faculty } from "../../../../models/Faculty";
import { User } from "../../../../models/User";

export const POST = async (req: Request) => {
  await connect();

  const body = await req.json();
  const { action, prn, dob, facultyId, topicName, isFirstChoice, name, topics } = body;

  if (action === "addFaculty") {
    if (!name || !topics) {
      return new Response(JSON.stringify({ message: "Invalid request data" }), { status: 400 });
    }
    try {
      const faculty = await Faculty.create({ name, topics });
      return new Response(JSON.stringify(faculty), { status: 201 });
    } catch{
      if (action === "addFaculty") {
        if (!name || !topics) {
          return new Response(JSON.stringify({ message: "Invalid request data" }), { status: 400 });
        }
        try {
          const faculty = await Faculty.create({ name, topics });
          return new Response(JSON.stringify(faculty), { status: 201 });
        } catch{
          return new Response(JSON.stringify({ message: "An unexpected error occurred" }), { status: 500 });
        }
      }
      
    }
  }

  if (action === "login") {
    // Check if the user already exists
    let user = await User.findOne({ prn, dob });

    // If user doesn't exist, create a new one
    if (!user) {
      user = new User({ prn, dob });
      await user.save();  // Save the new user
    }

    // Check if the user has already selected topics
    if (user.firstChoice && user.secondChoice) {
      return new Response(JSON.stringify({ message: "You have already selected your topics!" }), { status: 400 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  }

  if (action === "getFaculties") {
    const faculties = await Faculty.find({});
    return new Response(JSON.stringify(faculties), { status: 200 });
  }

  if (action === "selectTopic") {
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return new Response(JSON.stringify({ message: "Faculty not found" }), { status: 404 });
    }

    const topic = faculty.topics.find((t: { name: string; available: boolean }) => t.name === topicName && t.available);

    if (!topic) {
      return new Response(JSON.stringify({ message: "Topic not available" }), { status: 400 });
    }

    topic.available = false;
    await faculty.save();

    const user = await User.findOneAndUpdate(
      { prn },
      { $set: isFirstChoice ? { firstChoice: topicName } : { secondChoice: topicName } },
      { new: true }
    );

    return new Response(JSON.stringify(user), { status: 200 });
  }

  // Add submitSelections action
  if (action === "submitSelections") {
    const user = await User.findOne({ prn });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Ensure both choices are set before submitting
    if (!user.firstChoice || !user.secondChoice) {
      return new Response(JSON.stringify({ message: "Both choices are required" }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Selections submitted successfully!" }), { status: 200 });
  }

  // Default response for invalid action
  return new Response(JSON.stringify({ message: "Invalid action" }), { status: 400 });
};
