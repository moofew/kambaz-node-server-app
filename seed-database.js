import mongoose from "mongoose";
import "dotenv/config";
import courseModel from "./Kambaz/Courses/model.js";
import enrollmentModel from "./Kambaz/Enrollments/model.js";
import userModel from "./Kambaz/Users/model.js";
import assignmentModel from "./Kambaz/Assignments/model.js";
import defaultCourses from "./Kambaz/Database/courses.js";
import defaultEnrollments from "./Kambaz/Database/enrollments.js";
import defaultUsers from "./Kambaz/Database/users.js";
import defaultAssignments from "./Kambaz/Database/assignments.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

console.log("Seeding MongoDB with default data...\n");

try {
  await mongoose.connect(CONNECTION_STRING);
  console.log("✅ Connected to MongoDB\n");

  // Clear existing data
  console.log("Clearing existing data...");
  await courseModel.deleteMany({});
  await enrollmentModel.deleteMany({});
  await userModel.deleteMany({});
  await assignmentModel.deleteMany({});
  console.log("✅ Cleared\n");

  // Insert courses
  console.log(`Inserting ${defaultCourses.length} courses...`);
  await courseModel.insertMany(defaultCourses);
  console.log("✅ Courses inserted\n");

  // Insert users
  console.log(`Inserting ${defaultUsers.length} users...`);
  await userModel.insertMany(defaultUsers);
  console.log("✅ Users inserted\n");

  // Insert enrollments with status field
  console.log(`Inserting ${defaultEnrollments.length} enrollments...`);
  const enrollmentsWithStatus = defaultEnrollments.map(e => ({
    ...e,
    status: "ENROLLED"
  }));
  await enrollmentModel.insertMany(enrollmentsWithStatus);
  console.log("✅ Enrollments inserted\n");

  // Insert assignments with field mapping
  console.log(`Inserting ${defaultAssignments.length} assignments...`);
  const assignmentsWithCorrectFields = defaultAssignments.map(a => ({
    _id: a._id,
    title: a.title,
    course: a.course,
    description: a.description,
    points: a.points,
    dueDate: a.due,
    availableDate: a.available,
    availableUntilDate: a.until
  }));
  await assignmentModel.insertMany(assignmentsWithCorrectFields);
  console.log("✅ Assignments inserted\n");

  console.log("🎉 Database seeded successfully!");

  // Verify
  const courseCount = await courseModel.countDocuments();
  const userCount = await userModel.countDocuments();
  const enrollmentCount = await enrollmentModel.countDocuments();
  const assignmentCount = await assignmentModel.countDocuments();

  console.log(`\nFinal counts:`);
  console.log(`- Courses: ${courseCount}`);
  console.log(`- Users: ${userCount}`);
  console.log(`- Enrollments: ${enrollmentCount}`);
  console.log(`- Assignments: ${assignmentCount}`);

  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
