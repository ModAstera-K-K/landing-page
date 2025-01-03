import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getAllPosts } from "@/utils/markdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News + Blog | ModAstera - Save 90% on Medical AI Development Costs",
  description:
    "Save 90% on Medical AI Development Costs: Integrated and AI-automated workflow. From data preprocessing and annotation to model building and deployment in days.",
};

const BlogListPage = ({ params }: { params: { lang: string } }) => {
  const posts = getAllPosts(params.lang, [
    "title",
    "date",
    "excerpt",
    "coverImage",
    "slug",
  ]);

  return (
    <>
      <Breadcrumb
        pageName="News + Blog"
        showPath={false}
        pageDescription="Stay up-to-date with the latest news and insights from ModAstera."
      />
      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {posts.map((blog, i) => (
              <div key={i} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogListPage;
