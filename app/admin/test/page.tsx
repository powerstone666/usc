import { redirect } from "next/navigation";

export default function AdminTestRedirect() {
  redirect("/admin/settings");
}
