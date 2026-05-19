import { createBrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import client from "./api/client";

// Views
import MainView from "./views/MainView";
import BrowsingView from "./views/BrowsingView";
import PostingView from "./views/PostingView";
import ReportView from "./views/ReportView";
import AdminView from "./views/AdminView";
import UserView from "./views/UserView";
import RegisterView from "./views/RegisterView";
import SignInView from "./views/SignInView";
import PublicUserView from "./views/PublicUserView";
import PostView from "./views/PostView";

// LOADERS
async function usersLoader() {
  const res = await client.get("/users");
  return res.data;
}

async function postLoader({ params }) {
  const res = await client.get(`/posts/${params.id}`);
  return res.data;
}

async function publicUserLoader({ params }) {
  const res = await client.get(`/users/${params.id}`);
  return res.data;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <MainView /> },

      { path: "browsing", element: <BrowsingView /> },
      { path: "posting", element: <PostingView /> },
      { path: "reporting", element: <ReportView /> },

      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminView />
          </ProtectedRoute>
        ),
      },

      {
        path: "profile",
        loader: usersLoader,
        element: (
          <ProtectedRoute>
            <UserView />
          </ProtectedRoute>
        ),
      },

      { path: "signup", element: <RegisterView /> },
      { path: "signin", element: <SignInView /> },

      {
        path: "users/:id",
        loader: publicUserLoader,
        element: <PublicUserView />,
      },

      {
        path: "posts/:id",
        loader: postLoader,
        element: <PostView />,
      },
      {
        path: "posts/:id/edit",
        element: (
          <ProtectedRoute>
            <PostingView />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);


// import { createBrowserRouter } from "react-router-dom";
// import AppLayout from "./layouts/AppLayout";

// // Views
// import MainView from "./views/MainView";
// import BrowsingView from "./views/BrowsingView";
// import PostingView from "./views/PostingView";
// import ReportView from "./views/ReportView";
// import AdminView from "./views/AdminView";
// import UserView from "./views/UserView";
// import RegisterView from "./views/RegisterView";
// import SignInView from "./views/SignInView";
// import PublicUserView from "./views/PublicUserView";
// import PostView from "./views/PostView";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <AppLayout />,
//     children: [
//       // 🔹 Página principal
//       { index: true, element: <MainView /> },

//       { path: "browsing", element: <BrowsingView /> },
//       { path: "posting", element: <PostingView /> },
//       { path: "reporting", element: <ReportView /> },
//       { path: "admin", element: <AdminView /> },
//       { path: "profile", element: <UserView /> },
//       { path: "signup", element: <RegisterView /> },
//       { path: "signin", element: <SignInView /> },

//       { path: "user/:id", element: <PublicUserView /> },
//       { path: "post/:id", element: <PostView /> },
//     ],
//   },
// ]);




// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AppLayout from "./layouts/AppLayout";
// import MainView from "./views/MainView";



// export default function Router(){
//     return( 
//         <BrowserRouter>
//             <Routes>
//                 <Route element={<AppLayout />}>
//                     <Route path='/main' element={<MainView/>} />
//                     <Route path='/browsing' element={<BrowsingView/>} />
//                     <Route path='/posting' element={<PostingView/>} />
//                     <Route path='/reposting' element={<ReportView/>} />
//                     <Route path='/admin' element={<AdminView/>} />
//                     <Route path='/profile' element={<UserView/>} />
//                     <Route path='/signup' element={<RegisterView/>} />
//                     <Route path='/signin' element={<SignInView/>} />
//                     <Route path='/user/:id' element={<PublicUserView/>}/>
//                     <Route path='/post/:id' element={<PostView/>}/>
//                 </Route>
//                 {/* <Route element={<ProductLayout />}>
//                     <Route path='/' element={<MainView />} index />
//                     <Route path='/products' element={<ProductsView />} />
//                     <Route path='/products/create' element={<CreateProductView />} />
//                     <Route path='/products/:id' element={<EditProductView />} />
//                 </Route> */}
//             </Routes>
//         </BrowserRouter>
//     )
// }