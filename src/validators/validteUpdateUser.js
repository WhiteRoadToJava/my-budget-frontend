export default function validteUpdateUser(profile) {
  if (!profile.firstname?.trim()) {
    throw { // ✅ throw so catch block receives it
      hasError: true,
      message: "First name is required",
      position: "firstname",
    };
  }
  if (!profile.lastname?.trim()) {
    throw {
      hasError: true,
      message: "Last name is required",
      position: "lastname",
    };
  }
  if (!profile.phone?.trim()) {
    throw {
      hasError: true,
      message: "Phone number is required",
      position: "phone",
    };
  }
}