import Newsletter from "@/components/Blog/Newsletter";
import PopularArticle from "@/components/Blog/PopularArticle";
import SingleBlog from "@/components/Blog/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { getAllPosts, getPostBySlug } from "@/utils/markdown";
import markdownToHtml from "@/utils/markdownToHtml";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import CalendarIcon from "@/components/Common/Icons/BlogIcons/CalendarIcon";
import CommentsIcon from "@/components/Common/Icons/BlogIcons/CommentsIcon";
import ViewsIcon from "@/components/Common/Icons/BlogIcons/ViewsIcon";

type Props = {
  params: { slug: string; lang: string };
};

export async function generateMetadata({ params }: Props) {
  const posts = getAllPosts(params.lang, [
    "title",
    "date",
    "excerpt",
    "coverImage",
    "slug",
  ]);
  const post = getPostBySlug(params.lang, params.slug, [
    "title",
    "author",
    "content",
    "metadata",
  ]);

  const siteName = process.env.SITE_NAME || "Your Site Name";
  const authorName = process.env.AUTHOR_NAME || "Your Author Name";

  if (post) {
    return {
      title: `${post.title || "Single Post Page"} | ${siteName}`,
      author: authorName,
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: false,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } else {
    return {
      title: "Not Found",
      description: "No blog article has been found",
      author: authorName,
      robots: {
        index: false,
        follow: false,
        nocache: false,
        googleBot: {
          index: false,
          follow: false,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  }
}

export default async function Post({ params }: Props) {
  const posts = getAllPosts(params.lang, [
    "title",
    "date",
    "excerpt",
    "coverImage",
    "slug",
  ]);
  const post = getPostBySlug(params.lang, params.slug, [
    "title",
    "author",
    "authorImage",
    "content",
    "coverImage",
    "date",
  ]);

  const content = await markdownToHtml(post.content || "");

  return (
    <>
      <Breadcrumb pageName="Blog Details" />
      <section className="pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div
                className="wow fadeInUp relative z-20 mb-[60px] h-[300px] overflow-hidden rounded md:h-[400px] lg:h-[500px]"
                data-wow-delay=".1s"
              >
                <Image
                  src={post.coverImage}
                  alt="image"
                  width={1288}
                  height={500}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute left-0 top-0 z-10 flex h-full w-full items-end bg-gradient-to-t from-dark-700 to-transparent">
                  <div className="flex flex-wrap items-center p-4 pb-4 sm:p-8">
                    <div className="mb-4 mr-5 flex items-center md:mr-10">
                      <div className="mr-4 h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={post.authorImage}
                          alt="image"
                          className="w-full"
                          width={40}
                          height={40}
                        />
                      </div>
                      <p className="text-base font-medium text-white">
                        By{" "}
                        <Link
                          href="/public#"
                          className="text-white hover:opacity-70"
                        >
                          {post.author}
                        </Link>
                      </p>
                    </div>
                    <div className="mb-4 flex items-center">
                      <p className="mr-5 flex items-center text-sm font-medium text-white md:mr-6">
                        <span className="mr-3">
                          <CalendarIcon />
                        </span>
                        {format(new Date(post.date), "dd MMM yyyy")}
                      </p>

                      <p className="mr-5 flex items-center text-sm font-medium text-white md:mr-6">
                        <span className="mr-3">
                          <CommentsIcon />
                        </span>
                        09
                      </p>
                      <p className="flex items-center text-sm font-medium text-white">
                        <span className="mr-3">
                          <ViewsIcon />
                        </span>
                        35
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 lg:w-8/12">
                  <div className="blog-details xl:pr-10">
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                  </div>
                </div>
                <div className="w-full px-4 lg:w-4/12">
                  <div>
                    {/* <Newsletter /> */}
                    <div className="-mx-4 mb-8 flex flex-wrap">
                      <div className="w-full px-4">
                        <h2
                          className="wow fadeInUp relative pb-5 text-2xl font-semibold text-dark dark:text-white sm:text-[28px]"
                          data-wow-delay=".1s"
                        >
                          Popular Articles
                        </h2>
                        <span className="mb-10 inline-block h-[2px] w-20 bg-primary"></span>
                      </div>
                      {posts.slice(0, 3).map((blog, i) => (
                        <PopularArticle
                          key={i}
                          image={blog?.coverImage}
                          title={blog?.title.slice(0, 30)}
                          name={blog?.author}
                        />
                      ))}
                    </div>
                    {/* <div
                      className="wow fadeInUp mb-12 overflow-hidden rounded"
                      data-wow-delay=".1s"
                    >
                      <Image
                        src="/images/blog/bannder-ad.png"
                        alt="image"
                        className="w-full"
                        width={408}
                        height={254}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="-mx-4 flex flex-wrap">
            <div
              className="wow fadeInUp mt-14 w-full px-4"
              data-wow-delay=".2s"
            >
              <h2 className="relative pb-5 text-2xl font-semibold text-dark dark:text-white sm:text-[28px]">
                Related Articles
              </h2>
              <span className="mb-10 inline-block h-[2px] w-20 bg-primary"></span>
            </div>

            {posts.slice(0, 3).map((blog, key) => (
              <div key={key} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
