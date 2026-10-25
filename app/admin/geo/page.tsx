import { redirect } from "next/navigation";

export default function AdminGeoRedirect() {
  redirect("/admin/traffic");
}
