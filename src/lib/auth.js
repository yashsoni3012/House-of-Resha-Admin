export async function validateUserLogin(email, password) {
  try {
    const response = await fetch(
      "http://localhost:5000/user/data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (!response.ok) {
      // Non-200 response (invalid credentials or server error)
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const data = await response.json();
    console.log(data, "this is login res");

    // If login successful
    return {
      success: true,
      message: data.message,
      user: {
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        school_id: data.school_id,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
