import { allPosts } from "@/.contentlayer/generated";
import { compareDesc } from "date-fns";
import { GithubOutlined } from "@ant-design/icons";
import PostCard from "../PostCard/PostCard";

export default function SelfIntroduction() {
    const posts = allPosts
        .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
        .slice(0, 5);
    return (
        <main className="max-w-screen-md flex flex-col px-10 m-auto ">
            <section className="text-left w-full items-center justify-items-start py-12 flex">
                <h1 className="font-bold text-3xl md:text-7xl py-2 mr-4">👨🏻‍💻</h1>
                <div>
                    <h1 className="text-3xl md:text-xl py-1">
                        Meet Your Book 기술 블로그입니다.
                    </h1>
                    <a href="https://github.com/MeetYourBook/myb-blog">
                        <GithubOutlined />
                        <span className="ml-1">GITHUB</span>
                    </a>
                </div>
            </section>
            <hr className="border-t-2 border-gray-200 " />
            <section className="text-left w-full">
                <h1 className="font-bold text-xl md:text-2xl py-8">
                    📋 Recent Posts
                </h1>
                <main className="w-full mx-auto">
                    {posts.map((post) => (
                        <PostCard key={post._id} {...post} />
                    ))}
                </main>
            </section>
        </main>
    );
}
