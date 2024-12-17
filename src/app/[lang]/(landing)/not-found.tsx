import Breadcrumb from "@/components/Common/Breadcrumb";
import NotFound from "@/components/NotFound";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Page | ModAstera - Save 90% on Medical AI Development Costs",
};

const ErrorPage = () => {
  return (
    <>
      <Breadcrumb pageName="404 Page" />
      <NotFound />
    </>
  );
};

export default ErrorPage;
