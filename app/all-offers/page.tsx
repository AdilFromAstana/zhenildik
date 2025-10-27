import { redirect } from "next/navigation";

export default function AllDealsRedirectPage() {
  // Можно подставить дефолтный город, например Астану
  redirect("/all-deals/astana");
}
