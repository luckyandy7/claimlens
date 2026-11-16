import Capture from "@/components/capture";
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return <Capture token={(await params).token} />;
}
