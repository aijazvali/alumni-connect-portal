import User from "../models/User.js";

export default async function getFilteredAlumni(req, res) {
  try {
    const { college, batch, branch,jobtitle,location } = req.query;
    console.log("fetching.....alumniiii")
    const query = { role: "alumni" };

    if (college) query.college = { $regex: college, $options: "i" };
    if (batch) query.batch = { $regex: batch, $options: "i" };
    if (branch) query.branch = { $regex: branch, $options: "i" };
    if (jobtitle) query.jobtitle = { $regex: jobtitle, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };

    const alumni = await User.find(query).select("-password");
    res.status(200).json(alumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}
