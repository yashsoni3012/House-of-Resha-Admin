// // lib/api.js
// import { QueryClient } from "@tanstack/react-query";
// import { createCrudApi } from "./crudFactory";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const getSchool_id = () => {
//   return localStorage.getItem("schoolId");
// };

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 minutes cache
//       retry: 1,
//     },
//   },
// });

// export const api = {
//   // ✅ LOGIN
//   async login(email, password) {
//     const res = await fetch(`${BASE_URL}/Admin_Login_User`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!res.ok) {
//       const err = await res.json().catch(() => ({}));
//       throw new Error(err.message || `Request failed with ${res.status}`);
//     }

//     const data = await res.json();

//     const token =
//       ("access" in data && data.access) ||
//       ("access" in data ? data.access : undefined);

//     if (!token) throw new Error("No access token returned by server");

//     let user;
//     if ("status" in data) {
//       if (!data.data?.id || !data.data.email) {
//         throw new Error("Invalid user data");
//       }
//       user = {
//         id: data.data.id,
//         email: data.data.email,
//       };
//     } else {
//       if (!data.data?.id || !data.data.email || !data.data.role) {
//         throw new Error("Invalid user data");
//       }
//       user = {
//         id: data.data.id,
//         email: data.data.email,
//       };
//     }

//     return { token, user };
//   },

//   // ✅ CRUD MODULES (auto-generated from createCrudApi)
//   class: createCrudApi("class", {
//     getAllEndpoint: "classes/",
//     postEndpoint: "classes/",
//     patchEndpoint: "classes/",
//     deleteEndpoint: "classes/",
//   }),
//   job: createCrudApi("job", {
//     getAllEndpoint: "job/",
//     postEndpoint: "job/",
//     patchEndpoint: "job/",
//     deleteEndpoint: "job/",
//   }),
//   consellor: createCrudApi("counsellors", {
//     getAllEndpoint: "counsellors/",
//     postEndpoint: "counsellors/",
//     patchEndpoint: "counsellors/",
//     deleteEndpoint: "counsellors/",
//   }),
//   jobFilter: createCrudApi("jobFilter", {
//     getAllEndpoint: `job/school_id/${getSchool_id()}/`,
//   }),
//   jobAppFilter: createCrudApi("jobAppFilter", {
//     getAllEndpoint: `job_apply/school_id/${getSchool_id()}/`,
//   }),
//   schoolBook: createCrudApi("schoolBook", {
//     getAllEndpoint: "books/",
//     postEndpoint: "books/",
//     patchEndpoint: "books/",
//     deleteEndpoint: "books/",
//   }),
//   schoolInfo: createCrudApi("schoolInfo", {
//     getAllEndpoint: "schoolsInformation/",
//     postEndpoint: "schoolsInformation/",
//     patchEndpoint: "schoolsInformation/",
//     deleteEndpoint: "schoolsInformation/",
//     getOne: "schoolsInformation/school_id",
//   }),
//   student: createCrudApi("student", {
//     getAllEndpoint: "student/",
//     postEndpoint: "student/",
//     patchEndpoint: "student/",
//     deleteEndpoint: "student/",
//   }),
//   studentFilterBySchoolId: createCrudApi("studentFilterBySchoolId", {
//     getAllEndpoint: `student/school_id/${getSchool_id()}/`,
//   }),
//   questionnaire: createCrudApi("questionnaire", {
//     getAllEndpoint: "questionnaire/",
//     postEndpoint: "questionnaire/",
//     patchEndpoint: "questionnaire/",
//     deleteEndpoint: "questionnaire/",
//     getOne: "questionnaire/student_id",
//   }),
// };


// lib/api.js
import { QueryClient } from "@tanstack/react-query";
import { createCrudApi } from "./crudFactory";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getSchool_id = () => {
  return localStorage.getItem("schoolId");
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      retry: 1,
    },
  },
});

export const api = {
  // ✅ LOGIN
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/Admin_Login_User`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Request failed with ${res.status}`);
    }

    const data = await res.json();

    const token =
      ("access" in data && data.access) ||
      ("access" in data ? data.access : undefined);

    if (!token) throw new Error("No access token returned by server");

    let user;
    if ("status" in data) {
      if (!data.data?.id || !data.data.email) {
        throw new Error("Invalid user data");
      }
      user = {
        id: data.data.id,
        email: data.data.email,
      };
    } else {
      if (!data.data?.id || !data.data.email || !data.data.role) {
        throw new Error("Invalid user data");
      }
      user = {
        id: data.data.id,
        email: data.data.email,
      };
    }

    return { token, user };
  },
  
};
