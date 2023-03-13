import roles from "../config/rolesList.js";
import Tutor from "../database/models/tutorModel.js";
import User from "../database/models/userModel.js";

export const getTutorsService = async (skill) => {
  const tutors = await Tutor.find({
    skills: { $regex: skill, $options: "i" },
  }).sort({ hourlyCost: 1 });
  return tutors;
};

export const createNewTutorService = async ({ profile, file }) => {
  let data = {
    userId: profile.userId,
    fname: profile.fname,
    lname: profile.lname,
    image: file,
    description: profile.description,
    spokenLanguages: profile.spokenLanguages,
    skills: profile.skills,
    hourlyRate: profile.hourlyRate,
    currency: profile.currency,
  };

  try {
    const tutor = await new Tutor(data).save();
    // Add this line to update the role in User table
    await User.updateOne(
      { _id: data.userId },
      { $set: { roles: { User: roles.user, Tutor: roles.tutor } } }
    );
    return tutor;
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      throw new Error(`User already registered as tutor`);
    } else {
      throw error;
    }
  }
};

export const getTutorService = async (id) => {
  const tutor = await Tutor.findOne({ _id: id });
  return tutor;
};

// Get Tutor by ID
export const getTutorByIdService = async (id) => {
  const tutor = await Tutor.findOne({ _id: id })
    .populate({ path: "userId", select: "name lastName email" })
    .exec();
  return tutor;
};

export const getTutorByUserService = async (id) => {
  const tutor = await Tutor.findOne({
    userId: id,
  });

  return tutor;
};

export const updateTutorService = async (
  id,
  skills,
  spokenLanguages,
  hourlyRate,
  description
) => {
  try {
    const user = Tutor.findOneAndUpdate(
      { _id: id },
      {
        skills: skills,
        spokenLanguages: spokenLanguages,
        hourlyRate: hourlyRate,
        description: description,
      },
      { new: true }
    );
    if (user) {
      return user;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateImageService = async ({ id, image }) => {
  const tutor = Tutor.findOneAndUpdate(
    { _id: id },
    {
      image: image,
    },
    { new: true }
  );
  return tutor;
};
