import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  const findAllEnrollments = (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.json(enrollments);
  };

  const findUsersForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const users = await dao.findUsersForCourse(courseId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const findCoursesForUser = async (req, res) => {
    try {
      let { userId } = req.params;
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        userId = currentUser._id;
      }
      const courses = await dao.findCoursesForUser(userId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const enrollUserInCourse = async (req, res) => {
    try {
      let { userId, courseId } = req.params;
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        userId = currentUser._id;
      }
      const enrollment = await dao.enrollUserInCourse(userId, courseId);
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const unenrollUserFromCourse = async (req, res) => {
    try {
      let { userId, courseId } = req.params;
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        userId = currentUser._id;
      }
      await dao.unenrollUserFromCourse(userId, courseId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  app.get("/api/enrollments", findAllEnrollments);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.get("/api/users/:userId/courses", findCoursesForUser);
  app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
  app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
}
