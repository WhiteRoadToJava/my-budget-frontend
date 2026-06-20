export default function validteUpdateUser(profile) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.text(profile.username)) {
    throw {
      hasError: true,
      message: "Username is not match an email type",
      position: "username",
    };
  }
  if (profile.username.trim()) {
    throw {
      hasError: true,
      message: "Username is required",
      position: "username",
    };
  }
  // function to check
  if (profile.password.trim()) {
    throw {
      hasError: true,
      message: "the password can not be empty.",
      position: "password",
    };
  }
  if (!profile.firstname?.trim()) {
    throw {
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
  return { hasError: false };
}
