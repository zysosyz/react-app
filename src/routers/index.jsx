import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
let Home = lazy(() => import("../Pages/Home"));
let Index = lazy(() => import("../view"));
let Info = lazy(() => import("../Pages/Info/Info"));
let Cart = lazy(() => import("../view/Cart/Cart"));
let Mine = lazy(() => import("../view/Mine/Mine"));
let Login = lazy(() => import("../components/Login/Login"));
let Author = lazy(() => import("../components/author/Author"));
let Conorder = lazy(() => import("../Pages/Conorder/Conorder"));
let Address = lazy(() => import("../Pages/Address/Address"));
let Add = lazy(() => import("../Pages/addAddress/Adddizhi"));
let OrderList = lazy(() => import("../components/OrderList/OrderList"));
let User = lazy(() => import("../view/user"));
let Goods = lazy(() => import("../view/Goods/Goods"));
let SearchKey = lazy(() => import("../components/SearchKey/SearchKey"));
let Collect = lazy(() => import("../components/Collect/Collect"));
let Myloading = lazy(() => import("../components/Myloading/Myloading"));
// console.log(Home);

const list = [
  {
    path: "/",
    element: <Navigate to={"/index/home"}></Navigate>,
  },
  {
    path: "index",
    element: (
      <Suspense fallback={<Myloading />}>
        <Index />
      </Suspense>
    ),
    chirdren: [
      {
        path: "",
        element: <Navigate to={"home"}></Navigate>,
      },
      {
        path: "home",
        element: (
          <Suspense fallback={<Myloading />}>
            <Home />
          </Suspense>
        ),
        author: false,
      },
      {
        path: "cart",
        element: (
          <Suspense fallback={<Myloading />}>
            <Cart />
          </Suspense>
        ),
        author: true,
      },
      {
        path: "mine",
        element: (
          <Suspense fallback={<Myloading />}>
            <Mine />
          </Suspense>
        ),
        author: true,
      },
      {
        path: "goods",
        element: (
          <Suspense fallback={<Myloading />}>
            <Goods />
          </Suspense>
        ),
        author: false,
      },
    ],
  },
  {
    path: "info/:id",
    element: (
      <Suspense fallback={<Myloading />}>
        <Info />
      </Suspense>
    ),
    author: false,
  },
  {
    path: "login",
    element: (
      <Suspense fallback={<Myloading />}>
        {" "}
        <Login />
      </Suspense>
    ),
    author: false,
  },
  {
    path: "conorder",
    element: (
      <Suspense fallback={<Myloading />}>
        <Conorder />
      </Suspense>
    ),
    author: true,
  },
  {
    path: "address",
    element: (
      <Suspense fallback={<Myloading />}>
        <Address />
      </Suspense>
    ),
    author: true,
  },
  {
    path: "addAddress",
    element: (
      <Suspense fallback={<Myloading />}>
        <Add />
      </Suspense>
    ),
    author: true,
  },
  {
    path: "user",
    element: (
      <Suspense fallback={<Myloading />}>
        <User />
      </Suspense>
    ),
    author: true,
    chirdren: [
      {
        path: "orderlist",
        element: (
          <Suspense fallback={<Myloading />}>
            <OrderList />
          </Suspense>
        ),
        author: true,
      },
      {
        path: "collect",
        element: (
          <Suspense fallback={<Myloading />}>
            <Collect />
          </Suspense>
        ),
        author: true,
      },
    ],
  },
  {
    path: "search",
    element: (
      <Suspense fallback={<Myloading />}>
        <SearchKey />
      </Suspense>
    ),
    author: false,
  },
  {
    path: "*",
    element: <h1>404 Notfound</h1>,
  },
];
function RouterView() {
  return (
    <Routes>
      {list.map((item, index) => (
        <Route
          path={item.path}
          element={
            item.author ? (
              <Author OldElement={item.element} Oldpath={item.path} />
            ) : (
              item.element
            )
          }
          key={index}
        >
          {item.chirdren &&
            item.chirdren.map((item2, index2) => (
              <Route
                path={item2.path}
                element={
                  item2.author ? (
                    <Author
                      OldElement={item2.element}
                      Oldpath={`${item.path}/${item2.path}`}
                    />
                  ) : (
                    item2.element
                  )
                }
                key={index2}
              ></Route>
            ))}
        </Route>
      ))}
    </Routes>
  );
}
export default RouterView;
