
export const routes = {
  "/": {
    title: "Home",
    path: "/",
    icon: "home"
  },
  "/account": {
    title: "Account",
    path: "/account",
    icon: "user"
  },
  "/files": {
    title: "Files",
    path: "/files",
    icon: "folderopen"
  },
  "/exams": {
    title: "Exams",
    path: "/exams",
    icon: "edit"
  },
  "default": {
    title: "My App"
  }
}

export type RouteKey = keyof typeof routes;
